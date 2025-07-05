import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminAuth } from '@/utils/withAdminAuth';

export const GET = withAdminAuth(async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const name = searchParams.get('name') || '';
  const role = searchParams.get('role') || '';
  const offset = (page - 1) * limit;

  // 构建查询
  let query = supabaseAdmin
    .from('customer')
    .select(`
      id,
      name,
      company_name,
      role,
      linkedin_url,
      email,
      message:message(id, message, status)
    `, { count: 'exact' });

  // 添加筛选条件
  if (name) {
    query = query.ilike('name', `%${name}%`);
  }
  if (role) {
    query = query.eq('role', role);
  }

  // 获取总数
  const { count } = await query;

  // 获取分页数据
  const { data: customers, error } = await query
    .order('id', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  const result = customers.map((c: any) => ({
    id: c.id,
    name: c.name,
    company_name: c.company_name,
    role: c.role,
    linkedin_url: c.linkedin_url,
    email: c.email,
    message: c.message?.[0] || null // 只取第一条消息
  }));

  return NextResponse.json({
    data: result,
    pagination: {
      page,
      limit,
      total: count || 0,
      totalPages: Math.ceil((count || 0) / limit)
    }
  });
});

export const PATCH = withAdminAuth(async (request: Request) => {
  const { id, status, message } = await request.json();
  
  // 构建更新对象
  const updateData: any = {};
  if (status !== undefined) updateData.status = status;
  if (message !== undefined) updateData.message = message;
  
  const { error } = await supabaseAdmin.from('message').update(updateData).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
});

export const DELETE = withAdminAuth(async (request: Request) => {
  const { id } = await request.json();
  
  // 删除消息
  const { error: messageError } = await supabaseAdmin
    .from('message')
    .delete()
    .eq('id', id);
    
  if (messageError) return NextResponse.json({ error: messageError.message }, { status: 500 });
  
  return NextResponse.json({ success: true });
}); 