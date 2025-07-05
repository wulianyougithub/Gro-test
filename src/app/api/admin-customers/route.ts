import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminAuth } from '@/utils/withAdminAuth';

export const GET = withAdminAuth(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const email = searchParams.get('email') || '';
  const name = searchParams.get('name') || '';
  const role = searchParams.get('role') || '';
  const admin = searchParams.get('admin') || '';
  const offset = (page - 1) * limit;

  // 构建查询
  let query = supabaseAdmin
    .from('customer')
    .select('*', { count: 'exact' });

  // 添加筛选条件
  if (email) {
    query = query.ilike('email', `%${email}%`);
  }
  if (name) {
    query = query.ilike('name', `%${name}%`);
  }
  if (role) {
    query = query.eq('role', role);
  }
  if (admin !== '') {
    query = query.eq('admin', admin === 'true');
  }

  // 获取总数
  const { count } = await query;

  // 获取分页数据
  const { data: customers, error } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data: customers,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  });
});

export const PATCH = withAdminAuth(async (request: Request) => {
  const { id, admin } = await request.json();
  const { error } = await supabaseAdmin.from('customer').update({ admin }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
});

export const DELETE = withAdminAuth(async (request: Request) => {
  const { id } = await request.json();
  
  // 首先删除该用户相关的消息
  const { error: messageError } = await supabaseAdmin
    .from('message')
    .delete()
    .eq('customer_id', id);
    
  if (messageError) return NextResponse.json({ error: messageError.message }, { status: 500 });
  
  // 然后删除用户
  const { error: customerError } = await supabaseAdmin
    .from('customer')
    .delete()
    .eq('id', id);
    
  if (customerError) return NextResponse.json({ error: customerError.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}); 