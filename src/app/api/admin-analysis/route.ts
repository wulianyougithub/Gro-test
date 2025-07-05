import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminAuth } from '@/utils/withAdminAuth';

export const GET = withAdminAuth(async (request: Request) => {
  // 查询视图
  const { data: customerDaily, error: customerError } = await supabaseAdmin
    .from('customer_daily')
    .select('*')
    .order('date', { ascending: true });
  const { data: messageDaily, error: messageError } = await supabaseAdmin
    .from('message_daily')
    .select('*')
    .order('date', { ascending: true });
  const { data: rolePie, error: roleError } = await supabaseAdmin
    .from('customer_role_pie')
    .select('*')
    .order('count', { ascending: false });
  if (customerError || messageError || roleError) {
    return NextResponse.json({ error: customerError?.message || messageError?.message || roleError?.message }, { status: 500 });
  }
  return NextResponse.json({ customerDaily, messageDaily, rolePie });
}); 