
import { useTranslations } from "next-intl";

export function MessageSkeleton() {
  const t = useTranslations();

  return (
    <div className="overflow-x-auto rounded shadow bg-white">
      <table className="min-w-full text-sm text-left" style={{ tableLayout: 'fixed' }}>
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            </th>
            <th className="px-4 py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </th>
            <th className="px-4 py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            </th>
            <th className="px-4 py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-14"></div>
            </th>
            <th className="px-4 py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </th>
            <th className="px-4 py-2" style={{ width: '400px' }}>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </th>
            <th className="px-4 py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
            </th>
            <th className="px-4 py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
            </th>
            <th className="px-4 py-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...Array(8)].map((_, index) => (
            <tr key={index} className="border-b last:border-0">
              <td className="px-4 py-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              </td>
              <td className="px-4 py-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </td>
              <td className="px-4 py-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </td>
              <td className="px-4 py-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </td>
              <td className="px-4 py-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-28"></div>
              </td>
              <td className="px-4 py-2" style={{ width: '400px' }}>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                </div>
              </td>
              <td className="px-4 py-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </td>
              <td className="px-4 py-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* 分页骨架 */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        <div className="flex items-center space-x-2">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  );
} 