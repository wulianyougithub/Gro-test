"use client";
import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { UserListSkeleton } from "./UserListSkeleton";

// 动态导入，只在客户端加载
const UserListContent = lazy(() => import("./UserListContent"));

export default function AdminUserPage() {
  const [isClient, setIsClient] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full p-8">
      <h2 className="text-2xl font-bold mb-6 text-left">{t('userList')}</h2>
      {isClient ? (
        <Suspense fallback={<UserListSkeleton />}>
          <UserListContent />
        </Suspense>
      ) : (
        <UserListSkeleton />
      )}
    </div>
  );
} 