// src/components/withAuthGuard.tsx
'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export function withAuthGuard(Component: React.ComponentType<any>) {
  return function Wrapped(props: any) {
    const router = useRouter();
    const pathname = usePathname();

    // 用正则提取 locale
    const match = pathname.match(/^\/(\w{2})(\/|$)/);
    const locale = match ? match[1] : 'zh';

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          router.replace(`/${locale}`);
        }
      });
    }, []);

    return <Component {...props} />;
  };
}