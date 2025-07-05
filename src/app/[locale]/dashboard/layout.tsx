"use client";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from "next-intl";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [customer, setCustomer] = useState<any>(null);
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations();
    const pathname = usePathname();

    useEffect(() => {
        async function checkAdmin() {
            const { data: { session } } = await supabase.auth.getSession();
            const userId = session?.user?.id;
            if (!userId) {
                setIsAdmin(false);
                return;
            }
            supabase.from('customer')
                .select('*')
                .eq("user_id", userId)
                .maybeSingle()
                .then(({ data }) => {
                    setCustomer(data);
                    if (data?.admin) {
                        setIsAdmin(true)
                    } else {
                        setIsAdmin(false);
                    }
                });
        }
        checkAdmin();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace(`/${locale}/login`);
    };

    // loading 状态
    if (isAdmin === null) {
        return <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>;
    }

    // 判断当前菜单是否选中
    const isMenuActive = (target: string) => {
        return pathname === `/${locale}${target}` || pathname.startsWith(`/${locale}${target}/`);
    };

    // 判断菜单是否禁用
    const isMenuDisabled = (key: 'getStarted' | 'businessDetails') => {
        if (customer && customer.name) {
            return true;
        }
        return false;
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-white">
            {/* 侧边栏 */}
            <aside className="w-64 min-h-screen bg-white rounded-r-2xl shadow flex flex-col p-6 gap-6">
                <div className="flex items-center gap-2 mb-8">
                    <Image src="/groundLogoBlack.svg" alt="ground logo" width={32} height={32} />
                    <span className="text-xl font-bold ml-2">ground</span>
                </div>
                <nav className="flex-1 flex flex-col gap-2">
                    <div
                        className={`text-gray-400 flex items-center gap-2 mb-2 cursor-pointer ${isMenuActive('/dashboard/wellcome') ? 'font-bold text-black' : ''} ${isMenuDisabled('getStarted') ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => {
                            if (!isMenuDisabled('getStarted')) router.replace(`/${locale}/dashboard/wellcome`)
                        }}
                    >
                        {t('dashboardMenuGetStarted')} {isMenuDisabled('businessDetails')?<span>🔒</span>:''}
                    </div>
                    <div
                        className={`text-gray-400 flex items-center gap-2 mb-2 cursor-pointer ${isMenuActive('/dashboard/onboarding') ? 'font-bold text-black' : ''} ${isMenuDisabled('businessDetails') ? 'opacity-50 pointer-events-none' : ''}`}
                        onClick={() => {
                            if (!isMenuDisabled('businessDetails')) router.replace(`/${locale}/dashboard/onboarding`)
                        }}
                    >
                        <span>{t('dashboardMenuBusinessDetails')}</span> {isMenuDisabled('businessDetails')?<span>🔒</span>:''}
                    </div>
                    <div
                        className={`text-gray-400 flex items-center gap-2 mb-2 cursor-pointer ${isMenuActive('/dashboard/waiting') ? 'font-bold text-black' : ''}`}
                        onClick={() => router.replace(`/${locale}/dashboard/waiting`)}
                    >
                        {t('dashboardMenuFeedback')}
                    </div>
                    {isAdmin && (
                        <div
                            className={`text-gray-400 flex items-center gap-2 mb-2 cursor-pointer ${isMenuActive('/admin/user') ? 'font-bold text-black' : ''}`}
                            onClick={() => router.replace(`/${locale}/admin/user`)}
                        >
                            {t('dashboardMenuAdmin')}
                        </div>
                    )}
                </nav>
                <button className="flex items-center gap-2 text-gray-600 mt-auto hover:text-black" onClick={handleLogout}>
                    <span>⎋</span> {t('logout')}
                </button>
            </aside>
            {/* 内容区 */}
            <main className="flex-1 flex flex-col items-center justify-center">
                {children}
            </main>
        </div>
    );
} 