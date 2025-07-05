export function AnalysisSkeleton() {
  return (
    <div className="w-full">
      <div className="flex flex-row gap-8 mb-12">
        {/* 第一个图表骨架 */}
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
          <div className="bg-white rounded shadow p-4">
            <div className="h-[300px] bg-gray-100 rounded animate-pulse flex items-center justify-center">
              <div className="text-gray-400">图表加载中...</div>
            </div>
          </div>
        </div>
        
        {/* 第二个图表骨架 */}
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
          <div className="bg-white rounded shadow p-4">
            <div className="h-[300px] bg-gray-100 rounded animate-pulse flex items-center justify-center">
              <div className="text-gray-400">图表加载中...</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 饼图骨架 */}
      <div className="mb-12">
        <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
        <div className="bg-white rounded shadow p-4">
          <div className="h-[350px] bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <div className="text-gray-400">图表加载中...</div>
          </div>
        </div>
      </div>
    </div>
  );
} 