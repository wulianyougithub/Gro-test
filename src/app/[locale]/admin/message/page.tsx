"use client";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { MessageSkeleton } from "./MessageSkeleton";

export default function AdminMessage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const locale = useLocale();
  const t = useTranslations();


  useEffect(() => {
    fetchWithAuth('/api/admin-messages')
      .then(res => res && res.json())
      .then(data => {
        if (data) setMessages(data || []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, nextStatus: string) => {
    console.log('hahahah')
    setLoading(true);
    try {
      const response = await fetchWithAuth('/api/admin-messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: nextStatus })
      });
      
      if (response.ok) {
        // 直接更新本地状态，避免重新请求
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg?.message?.id === id ? { ...msg, status: nextStatus } : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextStatus = (status: string) => {
    if (status === 'draft') return { label: t('messageApprove'), value: 'approve' };
    if (status === 'approve') return { label: t('messageSend'), value: 'sent' };
    if (status === 'sent') return { label: t('messageSetDraft'), value: 'draft' };
    return { label: t('messageSetDraft'), value: 'draft' };
  };
  const getLabelStatus = (status: string) => {
    if (status === 'draft') return t('messageStatusDraft');
    if (status === 'approve') return t('messageStatusApproved');
    if (status === 'sent') return t('messageStatusSent');
    return t('messageStatusPending');
  };
  
  const handleGenerate = async (row: any) => {
    setLoadingId(row.id);
    const res = await fetchWithAuth('/api/generate-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: row.name,
        role: row.role,
        company: row.companyName,
        customerId:  row.id
      })
    });
    setLoadingId(null);
    if (res.ok) {
      // 刷新数据
      setLoading(true);
      fetchWithAuth('/api/admin-messages')
        .then(res => res && res.json())
        .then(data => {
          if (data) setMessages(data || []);
          setLoading(false);
        });
    } else {
      alert(t('messageGenerateFailed'));
    }
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-left">{t('messageManagement')}</h2>
      {loading ? (
        <MessageSkeleton />
      ) : (
        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">{t('messageEmail')}</th>
                <th className="px-4 py-2">{t('messageCompany')}</th>
                <th className="px-4 py-2">{t('messageName')}</th>
                <th className="px-4 py-2">{t('messageRole')}</th>
                <th className="px-4 py-2">{t('messageLinkedIn')}</th>
                <th className="px-4 py-2">{t('messageContent')}</th>
                <th className="px-4 py-2">{t('messageStatus')}</th>
                <th className="px-4 py-2">{t('messageActions')}</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(messages) ? messages : []).map((m: any) => (
                <tr key={m.id} className="border-b last:border-0">
                  <td className="px-4 py-2">{m.email}</td>
                  <td className="px-4 py-2">{m.company_name}</td>
                  <td className="px-4 py-2">{m.name}</td>
                  <td className="px-4 py-2">{m.role}</td>
                  <td className="px-4 py-2">{m.linkedin_url}</td>
                  <td className="px-4 py-2">{m.message?.message}</td>
                  <td className="px-4 py-2">{getLabelStatus(m?.message?.status)}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {m.status !== 'sent' && (
                      <>
                        {!m.message && (
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                            disabled={loadingId === m.id}
                            onClick={() => handleGenerate(m)}
                          >
                            {loadingId === m.id ? t('messageGenerating') : t('messageGenerate')}
                          </button>
                        )}
                        {m.message && m.message.status != 'sent' && (
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                            onClick={() => updateStatus(m?.message?.id, getNextStatus(m?.message?.status).value)}
                          >
                            {getNextStatus(m?.message?.status).label}
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 