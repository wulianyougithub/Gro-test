"use client";
import Image from "next/image";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabaseClient';
import { useLocale, useTranslations } from "next-intl";

export default function AdminLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations();
    const menu = [
        { label: t('adminUserList'), path: `/${locale}/admin/user` },
        { label: t('adminMessageManagement'), path: `/${locale}/admin/message` },
        { label: t('adminAnalysis'), path: `/${locale}/admin/analysis` },
        { label: t('backHome'), path: `/${locale}/dashboard/wellcome` },
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        const locale = window.location.pathname.split('/')[1] || 'zh';
        window.location.href = `/${locale}/login`;
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
                    <div className="text-xs font-bold text-gray-800 mb-2">{t('adminMenu')}</div>
                    {menu.map(item => {
                        const isActive = pathname.endsWith(item.path);
                        return (
                            <div
                                key={item.path}
                                className={
                                    "flex items-center gap-2 cursor-pointer rounded px-2 py-2 font-medium " +
                                    (isActive
                                        ? "bg-blue-100 text-blue-700 font-bold border-l-4 border-blue-500"
                                        : "hover:bg-gray-100 text-gray-700")
                                }
                                onClick={() => router.push(item.path)}
                            >
                                {item.label}
                            </div>
                        );
                    })}
                </nav>
                <button className="flex items-center gap-2 text-gray-600 mt-auto hover:text-black" onClick={handleLogout}>
                    <span>⎋</span> {t('logout')}
                </button>
            </aside>
            {/* 内容区 */}
            <main className="flex-1 flex flex-col items-start">
                {children}
            </main>
        </div>
    );
} 