"use client";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [type, setType] = useState("login");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // 密码校验
  const validatePassword = (value: string) => {
    if (!value) return t("passwordRequired");
    if (value.length < 6) return t("passwordTooShort");
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const pwdErr = validatePassword(password);
    setPasswordError(pwdErr);
    if (pwdErr) return;
    setLoading(true);
    try {
      if (type === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`,
          },
        });
        if (error) setFormError(error.message);
        else router.replace(`/${locale}/verify?email=${encodeURIComponent(email)}`); // 注册成功跳转到认证等待页
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setFormError(error.message);
        else router.replace(`/${locale}/dashboard`); // 登录成功跳转首页或其他页面
      }
    } catch (err: any) {
      setFormError(err.message || t("unknownError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const emailVal = sessionStorage.getItem("ground_auth_email") || "";
    const typeVal = sessionStorage.getItem("ground_auth_type") || "login";
    setEmail(emailVal);
    setType(typeVal);
    console.log(emailVal, typeVal,sessionStorage);
    // 清除，避免刷新后残留
    // sessionStorage.removeItem("ground_auth_email");
    // sessionStorage.removeItem("ground_auth_type");
    // 如果没有 email，跳回首页
    if (!emailVal) router.replace(`/${locale}`);
  },[]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
      <div className="flex flex-col justify-center items-center bg-white/60 rounded-lg shadow-lg m-4 md:m-8 p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image src="/groundLogoBlack.svg" alt="ground logo" width={64} height={64} />
        </div>
        <h2 className="text-2xl font-bold mb-2">{t("loginWelcome")}</h2>
        <div className="text-gray-500 text-sm mb-6">{type === "register" ? t("signupSubtitle") : t("loginSubtitle")}</div>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium">{t("loginEmailLabel")}</label>
          <input
            type="email"
            value={email}
            disabled
            className="border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
          />
          <label className="text-sm font-medium">{t("loginPasswordLabel")}</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setPasswordError(validatePassword(e.target.value));
              }}
              className={`border ${passwordError ? "border-red-500" : "border-gray-300"} rounded px-3 py-2 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-green-200`}
              placeholder={t("loginPasswordPlaceholder")}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
            >
              {showPassword ? t("hide") : t("show")}
            </button>
          </div>
          {passwordError && <span className="text-red-500 text-xs">{passwordError}</span>}
          {formError && <span className="text-red-500 text-xs">{formError}</span>}
          <div className="flex justify-between items-center mt-2 mb-2">
            <a href="#" className="text-sm text-blue-600 hover:underline font-medium">
              {t("forgotPassword")}
            </a>
          </div>
          <button
            type="submit"
            className="bg-black text-white rounded py-2 mt-2 shadow hover:bg-gray-800 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? t("loading") : t("continue")}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          {t("noAccount")} <a href="#" className="text-blue-600 hover:underline font-medium">{t("signUp")}</a>
        </div>
      </div>
    </div>
  );
} 