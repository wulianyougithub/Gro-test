import { useTranslations } from "next-intl";

export function UserListSkeleton() {
  const t = useTranslations();

  return (
    <div>
      {/* 筛选组件骨架屏 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index}>
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2 w-20"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-24"></div>
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
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="px-4 py-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* 分页骨架屏 */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 