import { supabase } from "@/lib/supabaseClient";

export async function fetchWithAuth(url: string, options: any = {}) {
    // 动态获取当前 session 的 access_token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    // 在服务端渲染时，需要提供完整的 URL
    let fullUrl = url;
    if (typeof window === 'undefined') {
        // 服务端渲染时，使用完整的 URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8001';
        fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
    }
    
    // if (!token) {
    //     const locale = window.location.pathname.split('/')[1] || 'zh';
    //     window.location.href = `/${locale}/login`;
    // }
    const res = await fetch(fullUrl, {
        ...options,
        headers: {
            ...(options.headers || {}),
            'Authorization': `Bearer ${token}`,
        }
    });
    // if (res.status === 401) {
    //     const locale = window.location.pathname.split('/')[1] || 'zh';
    //     window.location.href = `/${locale}/login`;
    //     return res;
    // }
    return res;
} 