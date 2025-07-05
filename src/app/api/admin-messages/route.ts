import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminAuth } from '@/utils/withAdminAuth';

export const GET = withAdminAuth(async (request: Request) => {
  const { data: customers, error } = await supabaseAdmin
    .from('customer')
    .select(`
      id,
      name,
      company_name,
      role,
      linkedin_url,
      email,
              message:message(id, message, status)
    `)
    .order('id', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const result = customers.map((c: any) => ({
    id: c.id,
    name: c.name,
    companyName: c.companyName,
    role: c.role,
    linkedInUrl: c.linkedInUrl,
    email: c.email,
                message: c.message?.[0] || null // 只取第一条消息
  }));
  return NextResponse.json(result);
});

export const PATCH = withAdminAuth(async (request: Request) => {
  const { id, status } = await request.json();
  const { error } = await supabaseAdmin.from('message').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}); 