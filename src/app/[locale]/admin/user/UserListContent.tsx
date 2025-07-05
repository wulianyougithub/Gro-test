"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { UserListSkeleton } from "./UserListSkeleton";

export default function UserListContent() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    email: '',
    name: '',
    role: '',
    admin: ''
  });
  const t = useTranslations();

  const fetchUsers = async (page: number = 1, searchFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString()
      });
      
      if (searchFilters.email) {
        params.append('email', searchFilters.email);
      }
      if (searchFilters.name) {
        params.append('name', searchFilters.name);
      }
      if (searchFilters.role) {
        params.append('role', searchFilters.role);
      }
      if (searchFilters.admin !== '') {
        params.append('admin', searchFilters.admin);
      }
      
      const response = await fetchWithAuth(`/api/admin-customers?${params.toString()}`);
      if (response && response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
        setCurrentPage(result.pagination.page);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const setAdmin = async (id: string, admin: boolean) => {
    setUpdatingId(id);
    try {
      await fetchWithAuth(`/api/admin-customers`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, admin })
      });
      
      // 刷新当前页面数据
      fetchUsers(currentPage, filters);
    } catch (error) {
      console.error('Failed to update admin status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchUsers(page, filters);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    setCurrentPage(1); // 重置到第一页
    fetchUsers(1, newFilters);
  };

  const handleClearFilters = () => {
    const newFilters = { email: '', name: '', role: '', admin: '' };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchUsers(1, newFilters);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm(t('deleteUserConfirm'))) {
      return;
    }
    
    setDeletingId(userId);
    try {
      const response = await fetchWithAuth('/api/admin-customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });
      
      if (response && response.ok) {
        // 刷新当前页面数据
        fetchUsers(currentPage, filters);
        alert(t('deleteUserSuccess'));
      } else {
        alert(t('deleteUserFailed'));
      }
    } catch (error) {
      console.error('Failed to delete user:', error);
      alert(t('deleteUserFailed'));
    } finally {
      setDeletingId(null);
    }
  };

  const Pagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 如果没有数据，显示提示信息
    if (total === 0) {
      return (
        <div className="flex items-center justify-center px-4 py-8 bg-white border-t">
          <span className="text-gray-500">暂无数据</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            {t('showing')} {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} {t('of')} {total} {t('results')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('previous')}
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          
          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm border rounded ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('next')}
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <UserListSkeleton />;
  }

  return (
    <div>
      {/* 筛选组件 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('messageEmail')}
            </label>
            <input
              type="text"
              value={filters.email}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              placeholder={t('filterByEmailPlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('userName')}
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              placeholder={t('filterByNamePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('userRole')}
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('filterAllRoles')}</option>
              <option value="Founder/Owner">{t('roleFounder')}</option>
              <option value="CEO">{t('roleCEO')}</option>
              <option value="Manager">{t('roleManager')}</option>
              <option value="Employee">{t('roleEmployee')}</option>
              <option value="Other">{t('roleOther')}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('userAdmin')}
            </label>
            <select
              value={filters.admin}
              onChange={(e) => handleFilterChange('admin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('filterAllAdmins')}</option>
              <option value="true">{t('userYes')}</option>
              <option value="false">{t('userNo')}</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t('clearFilters')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">{t('userID')}</th>
              <th className="px-4 py-2">{t('userName')}</th>
              <th className="px-4 py-2">{t('messageEmail')}</th>
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
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.company_name}</td>
                <td className="px-4 py-2">{c.role}</td>
                <td className="px-4 py-2">{c.admin ? t('userYes') : t('userNo')}</td>
                <td className="px-4 py-2 flex gap-2">
                  {c.admin ? (
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                      disabled={!!updatingId}
                      onClick={() => setAdmin(c.id, false)}
                    >
                      {updatingId === c.id ? t('userRemoving') : t('userRemoveAdmin')}
                    </button>
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
                      disabled={!!updatingId}
                      onClick={() => setAdmin(c.id, true)}
                    >
                      {updatingId === c.id ? t('userSetting') : t('userSetAdmin')}
                    </button>
                  )}
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                    disabled={deletingId === c.id}
                    onClick={() => handleDeleteUser(c.id)}
                  >
                    {deletingId === c.id ? t('deleting') : t('delete')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination />
      </div>
    </div>
  );
} 