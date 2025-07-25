"use client";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { MessageSkeleton } from "./MessageSkeleton";

export default function AdminMessage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState({
    name: '',
    role: ''
  });
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const locale = useLocale();
  const t = useTranslations();

  // 格式化日期时间函数
  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const fetchMessages = async (page: number = 1, searchFilters = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString()
      });
      
      if (searchFilters.name) {
        params.append('name', searchFilters.name);
      }
      if (searchFilters.role) {
        params.append('role', searchFilters.role);
      }
      
      const response = await fetchWithAuth(`/api/admin-messages?${params.toString()}`);
      if (response && response.ok) {
        const result = await response.json();
        console.log('API Response:', result); // 调试信息
        setMessages(result.data || []);
        setTotalPages(result.pagination.totalPages);
        setTotal(result.pagination.total);
        setCurrentPage(result.pagination.page);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(1);
  }, []);

  const updateStatus = async (id: string, nextStatus: string) => {
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
            msg?.message?.id === id ? { 
              ...msg, 
              message: { ...msg.message, status: nextStatus } 
            } : msg
          )
        );
      }
    } catch (error) {
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
        company: row.company_name,
        customerId:  row.id
      })
    });
    setLoadingId(null);
    if (res.ok) {
      // 刷新当前页面数据
      fetchMessages(currentPage, filters);
    } else {
      alert(t('messageGenerateFailed'));
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchMessages(page);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    setCurrentPage(1); // 重置到第一页
    fetchMessages(1, newFilters);
  };

  const handleClearFilters = () => {
    const newFilters = { name: '', role: '' };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchMessages(1, newFilters);
  };

  const handleCopyMessage = async (message: string) => {
    try {
      await navigator.clipboard.writeText(message);
      setCopyFeedback(t('copySuccess'));
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
      setCopyFeedback(t('copyFailed'));
      setTimeout(() => setCopyFeedback(null), 2000);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm(t('deleteConfirm'))) {
      return;
    }
    
    setDeletingId(messageId);
    try {
      const response = await fetchWithAuth('/api/admin-messages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageId })
      });
      
      if (response && response.ok) {
        // 刷新当前页面数据
        fetchMessages(currentPage, filters);
        setCopyFeedback(t('deleteSuccess'));
        setTimeout(() => setCopyFeedback(null), 2000);
      } else {
        setCopyFeedback(t('deleteFailed'));
        setTimeout(() => setCopyFeedback(null), 2000);
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
      setCopyFeedback(t('deleteFailed'));
      setTimeout(() => setCopyFeedback(null), 2000);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditMessage = (messageId: string, currentMessage: string) => {
    setEditingId(messageId);
    setEditingMessage(currentMessage);
  };

  const handleSaveMessage = async () => {
    if (!editingId) return;
    
    setSavingId(editingId);
    try {
      const response = await fetchWithAuth('/api/admin-messages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingId, 
          message: editingMessage 
        })
      });
      
      if (response && response.ok) {
        // 刷新当前页面数据
        fetchMessages(currentPage, filters);
        setCopyFeedback(t('editSuccess'));
        setTimeout(() => setCopyFeedback(null), 2000);
        setEditingId(null);
        setEditingMessage('');
      } else {
        setCopyFeedback(t('editFailed'));
        setTimeout(() => setCopyFeedback(null), 2000);
      }
    } catch (error) {
      console.error('Failed to update message:', error);
      setCopyFeedback(t('editFailed'));
      setTimeout(() => setCopyFeedback(null), 2000);
    } finally {
      setSavingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingMessage('');
  };

  // 暂时这么实现，
  const handleExportCSV = async () => {
    setExporting(true);
    try {
      // 获取所有数据（不分页）
      const params = new URLSearchParams({
        limit: '10000' // 设置一个很大的数字来获取所有数据
      });
      
      if (filters.name) {
        params.append('name', filters.name);
      }
      if (filters.role) {
        params.append('role', filters.role);
      }
      
      const response = await fetchWithAuth(`/api/admin-messages?${params.toString()}`);
      if (response && response.ok) {
        const result = await response.json();
        const allMessages = result.data || [];
        
        // 准备CSV数据
        const csvHeaders = [
          'Email',
          'Company',
          'Name', 
          'Role',
          'LinkedIn URL',
          'Message Content',
          'Status',
          'Created At'
        ];
        
        const csvData = allMessages.map((m: any) => [
          m.email || '',
          m.company_name || '',
          m.name || '',
          m.role || '',
          m.linkedin_url || '',
          m.message?.message || '',
          getLabelStatus(m?.message?.status) || '',
          m.message?.created_at ? formatDateTime(m.message.created_at) : ''
        ]);
        
        // 创建CSV内容
        const csvContent = [
          csvHeaders.join(','),
          ...csvData.map((row: any[]) => 
            row.map((cell: any) => 
              typeof cell === 'string' && cell.includes(',') 
                ? `"${cell.replace(/"/g, '""')}"` 
                : cell
            ).join(',')
          )
        ].join('\n');
        
        // 创建并下载文件
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `messages_export_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setCopyFeedback(t('exportSuccess') || '导出成功');
        setTimeout(() => setCopyFeedback(null), 2000);
      }
    } catch (error) {
      console.error('Failed to export CSV:', error);
      setCopyFeedback(t('exportFailed') || '导出失败');
      setTimeout(() => setCopyFeedback(null), 2000);
    } finally {
      setExporting(false);
    }
  };

  const Pagination = () => {
    // 调试信息
    console.log('Pagination Debug:', { currentPage, totalPages, total, pageSize });
    
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // 如果没有数据，显示提示信息
    if (total === 0) {
      return (
        <div className="flex items-center justify-center px-4 py-8 bg-white border-t">
          <span className="text-gray-500">暂无数据</span>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            {t('showing')} {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} {t('of')} {total} {t('results')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('previous')}
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                1
              </button>
              {startPage > 2 && <span className="px-2">...</span>}
            </>
          )}
          
          {pages.map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 text-sm border rounded ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="px-2">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('next')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-left">{t('messageManagement')}</h2>
      
      {/* 复制反馈提示 */}
      {copyFeedback && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 transition-opacity duration-300">
          {copyFeedback}
        </div>
      )}
      
      {/* 筛选组件 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('messageName')}
            </label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              placeholder={t('filterByNamePlaceholder')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('messageRole')}
            </label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{t('filterAllRoles')}</option>
              <option value="Founder/Owner">{t('roleFounder')}</option>
              <option value="CEO">{t('roleCEO')}</option>
              <option value="Manager">{t('roleManager')}</option>
              <option value="Employee">{t('roleEmployee')}</option>
              <option value="Other">{t('roleOther')}</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {t('clearFilters')}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (t('exporting') || '导出中...') : (t('exportCSV') || '导出CSV')}
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <MessageSkeleton />
      ) : (
        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="min-w-full text-sm text-left" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">{t('messageEmail')}</th>
                <th className="px-4 py-2">{t('messageCompany')}</th>
                <th className="px-4 py-2">{t('messageName')}</th>
                <th className="px-4 py-2">{t('messageRole')}</th>
                <th className="px-4 py-2">{t('messageLinkedIn')}</th>
                <th className="px-4 py-2" style={{ width: '400px' }}>{t('messageContent')}</th>
                <th className="px-4 py-2">{t('messageStatusCreatedAT')}</th>
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
                  <td className="px-4 py-2" style={{ width: '400px' }}>
                    {m.message?.message ? (
                      editingId === m.message.id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingMessage}
                            onChange={(e) => setEditingMessage(e.target.value)}
                            placeholder={t('editMessagePlaceholder')}
                            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows={6}
                            style={{ minHeight: '120px' }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveMessage}
                              disabled={savingId === m.message.id}
                              className="bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700 disabled:opacity-50 font-medium"
                            >
                              {savingId === m.message.id ? t('saving') : t('save')}
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-gray-600 text-white px-4 py-2 text-sm rounded hover:bg-gray-700 font-medium"
                            >
                              {t('cancel')}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="group relative cursor-pointer"
                          onClick={() => handleCopyMessage(m.message.message)}
                        >
                          <div className="text-sm leading-relaxed break-words hover:bg-gray-50 p-2 rounded transition-colors">
                            {m.message.message.length > 80 
                              ? `${m.message.message.substring(0, 80)}...` 
                              : m.message.message
                            }
                          </div>
                          {/* 悬停提示框 */}
                          <div className="absolute left-0 top-full z-50 hidden group-hover:block bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg max-w-md whitespace-pre-wrap break-words">
                            {m.message.message}
                            <div className="text-xs text-gray-300 mt-2">点击复制</div>
                          </div>
                        </div>
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                                      </td>
                    <td className="px-4 py-2">{m?.message?.created_at ? formatDateTime(m.message.created_at) : '-'}</td>
                    <td className="px-4 py-2">{getLabelStatus(m?.message?.status)}</td>
                  <td className="px-4 py-2" style={{ verticalAlign: 'middle' }}>
                    <div className="flex gap-2">
                    {!m.message && (
                      <button
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
                        disabled={loadingId === m.id}
                        onClick={() => handleGenerate(m)}
                      >
                        {loadingId === m.id ? t('messageGenerating') : t('messageGenerate')}
                      </button>
                    )}
                    {m.message && m.message.status !== 'sent' && (
                      <>
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          onClick={() => updateStatus(m?.message?.id, getNextStatus(m?.message?.status).value)}
                        >
                          {getNextStatus(m?.message?.status).label}
                        </button>
                        <button
                          className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                          onClick={() => handleEditMessage(m.message.id, m.message.message)}
                        >
                          {t('edit')}
                        </button>
                      </>
                    )}
                    {m.message && (
                      <button
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                        disabled={deletingId === m.message.id}
                        onClick={() => handleDeleteMessage(m.message.id)}
                      >
                        {deletingId === m.message.id ? t('deleting') : t('delete')}
                      </button>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination />
        </div>
      )}
    </div>
  );
} 