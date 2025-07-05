 "use client";
import Image from "next/image";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default  function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [tab, setTab] = useState("login");
  const otherLocale = locale === "zh" ? "en" : "zh";
  const handleGoogleLogin = () => {
    // 提示暂未开放
    alert(t('loginWithGoogleTip'));
  }
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // 邮箱格式校验
  const validateEmail = (value: string) => {
    if (!value) return t("emailRequired");
    const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) return t("emailInvalid");
    return "";
  };

  // 可选：异步校验邮箱是否可用
  // const checkEmailAvailable = async (value: string) => {
  //   // 调用后端API
  //   // const res = await fetch(`/api/check-email?email=${value}`);
  //   // const data = await res.json();
  //   // if (!data.available) return t("emailUsed");
  //   // return "";
  // };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailError && email) {
      const type = tab === "login" ? "login" : "register";
      sessionStorage.setItem("ground_auth_email", email);
      sessionStorage.setItem("ground_auth_type", type);
      router.push(`/${locale}/login`);
    }
  };

  // 计算当前页面的“去掉 locale 部分”的路径
  // 例如 /zh/dashboard => /dashboard
  const currentPath = pathname.replace(/^\/[a-zA-Z-]+/, '');

  const handleLocaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    router.replace(`/${newLocale}${currentPath === '' ? '/' : currentPath}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      {/* 语言切换下拉框 */}
      <div style={{ position: 'absolute', top: 20, right: 20 }}>
        <select value={locale} onChange={handleLocaleChange} className="border rounded px-2 py-1">
          <option value="zh">中文</option>
          <option value="en">English</option>
        </select>
      </div>
      <div className="flex flex-col justify-center items-center bg-white/60 rounded-lg shadow-lg m-4 md:m-8 p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/groundLogoBlack.svg" alt="ground logo" width={128} height={48} />
          {/* <span className="text-xl font-semibold mt-2">ground</span> */}
        </div>
        {/* Tab 切换 */}
        <div className="flex mb-6 w-full">
          <button
            className={`flex-1 py-2 rounded-l-lg border border-gray-200 ${tab === "login" ? "bg-white shadow font-bold" : "bg-gray-100"}`}
            onClick={() => setTab("login")}
          >
            {t("login")}
          </button>
          <button
            className={`flex-1 py-2 rounded-r-lg border border-gray-200 border-l-0 ${tab === "register" ? "bg-white shadow font-bold" : "bg-gray-100"}`}
            onClick={() => setTab("register")}
          >
            {t("register")}
          </button>
        </div>
        {/* 登录/注册表单 */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleContinue}>
          <label className="text-sm font-medium">
            {tab === "login" ? t("loginWithEmail") : t("createWithEmail")}
          </label>
          <input
            type="email"
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setEmailError(validateEmail(e.target.value));
            }}
            onBlur={async e => {
              const formatError = validateEmail(e.target.value);
              if (formatError) {
                setEmailError(formatError);
              } else {
                // 可选：异步校验
                // const asyncError = await checkEmailAvailable(e.target.value);
                // setEmailError(asyncError);
              }
            }}
            className={`border ${emailError ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-200`}
            placeholder=""
          />
          {emailError && (
            <span className="text-red-500 text-xs">{emailError}</span>
          )}
          <button
            type="submit"
            className="bg-black text-white rounded py-2 mt-2 shadow hover:bg-gray-800 text-lg font-semibold"
            disabled={!!emailError}
          >
            {t("continue")}
          </button>
        </form>
        {/* 分割线 */}
        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        {/* Google 登录/注册按钮 */}
        <button className="flex items-center justify-center gap-2 border border-gray-300 rounded py-2 w-full bg-white hover:bg-gray-50 text-base font-medium shadow" onClick={handleGoogleLogin}>
          <Image src="/googleLogo.webp" alt="Google logo" width={20} height={20} />
          {tab === "login" ? t("loginWithGoogle") : t("continueWithGoogle")}
        </button>
      </div>
    </div>
  );
} 