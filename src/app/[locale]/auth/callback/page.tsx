"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallbackPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 解析 hash 参数
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token })
        .then(async ({ error }) => {
          if (error) setError(error.message);
          else {
            // 获取 user.id 并存入 sessionStorage
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.id) {
              // 查询 customer 表判断是否存在
              const { data: profile } = await supabase
                .from('customer')
                .select('id')
                .eq('user_id', user.id)
                .maybeSingle();
              if (profile?.id) {
                router.replace(`/${locale}/dashboard/wellcome`);
              } else {
                // 不存在则插入一条数据（只插入 userId 和 email）
                const { error: insertError } = await supabase
                  .from('customer')
                  .insert([{ user_id: user.id, email: user.email }]);
                if (insertError) {
                  setError(insertError.message);
                } else {
                  router.replace(`/${locale}/dashboard/wellcome`);
                }
              }
            } else {
              setError('No user info');
            }
          }
        })
        .finally(() => setLoading(false));
    } else {
      setError("Missing access_token or refresh_token in URL");
      setLoading(false);
    }
  }, [locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="flex flex-col justify-center items-center bg-white/60 rounded-lg shadow-lg m-4 md:m-8 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{t("authCallbackTitle")}</h2>
        {loading && <div className="text-green-600 mb-2">{t("authCallbackLoading")}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
      </div>
    </div>
  );
} 