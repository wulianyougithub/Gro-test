"use client";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';
import { withAuthGuard } from "../../withAuthGuard";
import { useLocale, useTranslations } from 'next-intl';
import { LoadingSpinner } from "@/components/LoadingSpinner";

function Waiting() {
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const locale = useLocale();
    const t = useTranslations();

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        let isMounted = true; // 跟踪组件是否仍然挂载

        const fetchMessage = async () => {
            if (!isMounted) return; // 如果组件已卸载，停止执行

            const { data: { session } } = await supabase.auth.getSession();
            const id = session?.user?.id;

            if (!isMounted) return; // 再次检查，防止异步操作期间组件卸载

            setLoading(true);
            const { data, error } = await supabase
                .from('message')
                .select('message, customer!inner(id, user_id)')
                .eq('status', 'sent')
                .eq('customer.user_id', id)
                .order('id', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (!isMounted) return; // 再次检查，防止异步操作期间组件卸载

            if (data && data.message) {
                setMessage(data.message);
                setLoading(false);
            } else {
                setMessage(null);
                setLoading(false);
                if (isMounted) { // 只有在组件仍然挂载时才设置新的定时器
                    timer = setTimeout(fetchMessage, 2000); // 2秒轮询
                }
            }
        };

        fetchMessage();

        // 清理函数
        return () => {
            isMounted = false; // 标记组件已卸载
            if (timer) {
                clearTimeout(timer); // 清理定时器
            }
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-[60vh]">
            <h2 className="text-2xl font-bold mb-4">{t('waitingTitle')}</h2>
            {message ? (
                <div className="bg-white rounded-lg shadow-lg p-8 text-lg text-gray-800 max-w-2xl w-full">
                    <div className="prose prose-lg">
                        {message}
                    </div>
                </div>
            ) : (
                <div className="text-center space-y-4">
                    <div className="space-y-4">
                        <LoadingSpinner size="md" text={t('waitingContent')} />
                    </div>
                </div>
            )}
        </div>
    );
}
export default withAuthGuard(Waiting)