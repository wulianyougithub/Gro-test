"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { withAuthGuard } from "../../withAuthGuard";

 function Dashboard() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  useEffect(() => {
    async function getCustomer() {
      const { data: { session } } = await supabase.auth.getSession();
      const id = session?.user?.id;
      if (!id) return;
      supabase.from('customer')
        .select('id,name')
        .eq('user_id', id)
        .maybeSingle()
        .then(({ data }) => {
          if (data && data.id&&data.name) {
            router.replace(`/${locale}/dashboard/waiting`);
          }
        });
    }
    getCustomer()

  }, [router, locale]);
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-white">
      {/* 内容区 */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-lg w-full flex flex-col items-center justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-center">{t('dashboardWelcome')}</h1>
          <p className="text-gray-600 text-center mb-8">
            {t('dashboardIntro')}
          </p>
          <button
            className="w-full bg-black text-white rounded-full py-3 text-lg font-semibold hover:bg-gray-900 transition"
            onClick={() => router.push(`/${locale}/dashboard/onboarding`)}
          >
            {t('dashboardGetStarted')}
          </button>
        </div>
      </main>
    </div>
  );
} 
export default withAuthGuard(Dashboard)