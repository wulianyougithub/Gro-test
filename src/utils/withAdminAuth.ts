import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export function withAdminAuth(handler: (request: Request, ...args: any[]) => Promise<Response>) {
  return async (request: Request, ...args: any[]) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 });
    const { data: { user } } = await supabaseAdmin.auth.getUser(token);
    if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });
    const { data: profile } = await supabaseAdmin
      .from('customer')
      .select('admin')
      .eq('user_id', user.id)
      .maybeSingle();
    if (!profile?.admin) return NextResponse.json({ error: '无权限' }, { status: 403 });
    // 通过校验，执行原 handler
    return handler(request, ...args);
  };
} 

