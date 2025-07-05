import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

export default withNextIntl({
  // 性能优化配置
  experimental: {
    // 不启用 PPR，因为项目高度动态化
    // ppr: 'incremental',
    
    // 启用其他性能优化
    optimizePackageImports: ['recharts', '@supabase/supabase-js'],
  },
  
  // 图片优化
  images: {
    domains: ['localhost'],
  },
  
  // 压缩配置
  compress: true,
  
  // 生产环境优化
  swcMinify: true,
});
