"use client";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { withAuthGuard } from "../../withAuthGuard";

function Onboarding() {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState({})
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const roles = [
    t('roleFounder'),
    t('roleCEO'),
    t('roleManager'),
    t('roleEmployee'),
    t('roleOther')
  ];
  const isValid = company && name && role;

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
          if(data&&data.id)setCustomer(data)
          if (data && data.id && data.name) {
            router.replace(`/${locale}/dashboard/waiting`);
          }
        });
    }
    getCustomer()

  }, [router, locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const id = session?.user?.id;
    try {
      // 获取当前用户信息
      const email = session?.user?.email || '';
      const { error } = await supabase.from('customer').upsert([
        {
          ...customer,
          name,
          role,
          company_name: company,
          linkedin_url: linkedinUrl || null,
          user_id: id,
          email: email,
        }
      ]);
      if (error) throw error;
      router.push(`/${locale}/dashboard/waiting`);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <form className="max-w-xl w-full flex flex-col items-center justify-center mt-20" onSubmit={handleSubmit}>
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">{t('onboardingTitle')}</h1>
        <div className="w-full mb-6">
          <label className="block mb-2 font-medium">
            {t('onboardingCompany')} <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            value={company}
            onChange={e => setCompany(e.target.value)}
            placeholder=""
          />
        </div>
        <div className="w-full mb-6">
          <label className="block mb-2 font-medium">
            {t('onboardingName')} <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder=""
          />
        </div>
        <div className="w-full mb-6">
          <label className="block mb-2 font-medium">
            {t('onboardingRole')} <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="">{t('onboardingSelectRole')}</option>
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="w-full mb-8">
          <label className="block mb-2 font-medium">{t('onboardingLinkedIn')} (可选)</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200"
            value={linkedinUrl}
            onChange={e => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/your-profile"
            type="url"
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full rounded-full py-3 text-lg font-semibold transition"
          style={{ background: isValid && !loading ? "#000" : "#e5e5e5", color: isValid && !loading ? "#fff" : "#aaa" }}
          disabled={!isValid || loading}
        >
          {loading ? t('onboardingSubmitting') : t('continue')}
        </button>
      </form>
    </div>
  );
}
export default withAuthGuard(Onboarding)