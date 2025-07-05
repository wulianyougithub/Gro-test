"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';

export default function VerifyPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [checking, setChecking] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  // 自动检测 session 是否存在（已登录）
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace(`/${locale}`);
      }
    });
  }, [locale, router]);

  // 轮询检查邮箱认证状态
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (email) {
      setChecking(true);
      interval = setInterval(async () => {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          setError(error.message);
          setChecking(false);
          clearInterval(interval);
        } else if (user && user.email_confirmed_at) {
          setVerified(true);
          setChecking(false);
          clearInterval(interval);
          router.replace(`/${locale}`); // 认证后跳转内容页
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [email, locale, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="flex flex-col justify-center items-center bg-white/60 rounded-lg shadow-lg m-4 md:m-8 p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{t("verifyTitle")}</h2>
        <div className="text-gray-600 text-center mb-4">
          {t("verifyTip", { email })}
        </div>
        {checking && <div className="text-green-600 mb-2">{t("verifying")}</div>}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          className="mt-4 px-4 py-2 rounded bg-black text-white font-semibold"
          onClick={async () => {
            setChecking(true);
            setError("");
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) setError(error.message);
            else if (user && user.email_confirmed_at) {
              setVerified(true);
              router.replace(`/${locale}`);
            } else {
              setError(t("verifyNotYet"));
            }
            setChecking(false);
          }}
          disabled={checking}
        >
          {t("verifyCheckNow")}
        </button>
      </div>
    </div>
  );
} 