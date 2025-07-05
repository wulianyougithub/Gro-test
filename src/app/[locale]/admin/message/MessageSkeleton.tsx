
import { useTranslations } from "next-intl";

export function MessageSkeleton() {
  const t = useTranslations();

  return (
    <div className="overflow-x-auto rounded shadow bg-white">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th  className="h-4 bg-gray-200 rounded animate-pulse"></th>
            <th className="h-4 bg-gray-200 rounded animate-pulse"></th>
            <th className="h-4 bg-gray-200 rounded animate-pulse"></th>
            <th className="h-4 bg-gray-200 rounded animate-pulse"></th>
            <th className="h-4 bg-gray-200 rounded animate-pulse"></th>
            <th className="h-4 bg-gray-200 rounded animate-pulse"></th>
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
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 