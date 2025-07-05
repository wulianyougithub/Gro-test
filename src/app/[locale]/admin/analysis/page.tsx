"use client";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { useTranslations } from "next-intl";
import { AnalysisSkeleton } from "./AnalysisSkeleton";

export default function AdminAnalysis() {
  const [customerDaily, setCustomerDaily] = useState<any[]>([]);
  const [messageDaily, setMessageDaily] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolePie, setRolePie] = useState<any[]>([]);
  const t = useTranslations();

  useEffect(() => {
    fetchWithAuth('/api/admin-analysis')
      .then(res => res.json())
      .then(data => {
        setCustomerDaily(data.customerDaily || []);
        setMessageDaily(data.messageDaily || []);
        setRolePie(data.rolePie || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-left">{t('analysisTitle')}</h2>
      {loading ? (
        <AnalysisSkeleton />
      ) : (
        <>
          <div className="flex flex-row gap-8 mb-12">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{t('analysisCustomerDaily')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={customerDaily} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name={t('analysisCustomerCount')} stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">{t('analysisMessageDaily')}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={messageDaily} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" name={t('analysisMessageCount')} stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-2">{t('analysisRolePie')}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={rolePie}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={entry => `${entry.role} (${entry.count})`}
                >
                  {rolePie.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"][idx % 6]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
} 