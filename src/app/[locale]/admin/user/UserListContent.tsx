"use client";
import { use, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

// 创建一个 Promise 来获取用户数据
function fetchUsers() {
  return fetchWithAuth('/api/admin-customers')
    .then(res => {
      if (res.status === 401) {
        // 如果是认证失败，抛出错误
        throw new Error('Authentication required');
      }
      return res.json();
    })
    .then(data => data || []);
}

// 创建一个全局的 Promise 缓存
let usersPromise: Promise<any[]> | null = null;

function getUsersPromise() {
  if (!usersPromise) {
    usersPromise = fetchUsers();
  }
  return usersPromise;
}

function resetUsersPromise() {
  usersPromise = null;
}

export default function UserListContent() {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useTranslations();
  
 
  const users = use(getUsersPromise());

  const setAdmin = async (id: string, admin: boolean) => {
    setUpdatingId(id);
    try {
      await fetchWithAuth(`/api/admin-customers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin })
      });
      
      // 使用 startTransition 来重新获取数据
      startTransition(() => {
        resetUsersPromise();
        // 触发重新渲染
        window.location.reload();
      });
    } catch (error) {
      console.error('Failed to update admin status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto rounded shadow bg-white">
      {isPending && (
        <div className="p-4 bg-blue-50 text-blue-700 text-sm">
          正在更新数据...
        </div>
      )}
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">{t('userID')}</th>
            <th className="px-4 py-2">{t('userName')}</th>
            <th className="px-4 py-2">{t('userCompany')}</th>
            <th className="px-4 py-2">{t('userRole')}</th>
            <th className="px-4 py-2">{t('userAdmin')}</th>
            <th className="px-4 py-2">{t('userActions')}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((c: any) => (
            <tr key={c.id} className="border-b last:border-0">
              <td className="px-4 py-2">{c.id}</td>
              <td className="px-4 py-2">{c.name}</td>
              <td className="px-4 py-2">{c.company_name}</td>
              <td className="px-4 py-2">{c.role}</td>
              <td className="px-4 py-2">{c.admin ? t('userYes') : t('userNo')}</td>
              <td className="px-4 py-2">
                {c.admin ? (
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                    disabled={!!updatingId || isPending}
                    onClick={() => setAdmin(c.id, false)}
                  >
                    {updatingId === c.id ? t('userRemoving') : t('userRemoveAdmin')}
                  </button>
                ) : (
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={!!updatingId || isPending}
                    onClick={() => setAdmin(c.id, true)}
                  >
                    {updatingId === c.id ? t('userSetting') : t('userSetAdmin')}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 