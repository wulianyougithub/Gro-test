import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminAuth } from '@/utils/withAdminAuth';
import OpenAI from "openai";


export const POST = async (request: Request) => {
  const { name, role, company, customerId } = await request.json();
  const prompt = `Write a short, friendly LinkedIn outreach message to ${name}, who is a ${role} at ${company}. Make it casual and under 500 characters.`;
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY , baseURL: 'https://api.deepseek.com',});

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "deepseek-chat",
  });

  const message = completion.choices[0].message.content;

          // 插入到 message 表
        const { data, error } = await supabaseAdmin.from('message').insert([
    {
      customer_id:customerId,
      message:message,
      status: 'draft' // 默认状态，可根据需要调整
    }
  ]).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: data });
};