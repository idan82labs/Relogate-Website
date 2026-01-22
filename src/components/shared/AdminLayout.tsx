"use client";

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './Button';
import { AdminGuard } from './AdminGuard';
import { NotificationBell } from './NotificationBell';
import { siteContent } from '@/content/he';
import { getCurrentUser, logout } from '@/services/auth';

const content = siteContent.admin;

interface AdminLayoutProps {
  children: ReactNode;
  activeTab?: 'users' | 'reports' | 'payments';
}

function AdminHeader({ userName, onLogout }: { userName: string; onLogout: () => void }) {
  return (
    <header className="bg-white border-b border-[#C6C6C6] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-xl font-bold text-[#215388] hover:text-[#1a4270]">
            Relogate
          </Link>
          <span className="text-[#706F6F]">|</span>
          <span className="text-[#1D1D1B] font-medium">{content.dashboard.title}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#706F6F]">
            {content.dashboard.welcome}, <span className="font-medium text-[#1D1D1B]">{userName}</span>
          </span>
          <NotificationBell />
          <Button variant="outline" size="sm" onClick={onLogout}>
            {content.dashboard.logout}
          </Button>
        </div>
      </div>
    </header>
  );
}

interface NavItem {
  id: 'users' | 'reports' | 'payments';
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'users', label: content.dashboard.nav.users, href: '/admin/users' },
  { id: 'reports', label: content.dashboard.nav.reports, href: '/admin/reports' },
  { id: 'payments', label: content.dashboard.nav.payments, href: '/admin/payments' },
];

function AdminNav({ activeTab }: { activeTab?: string }) {
  return (
    <nav className="bg-white border-b border-[#C6C6C6]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === item.id
                  ? 'border-[#215388] text-[#215388] font-medium'
                  : 'border-transparent text-[#706F6F] hover:text-[#1D1D1B]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function AdminLayoutContent({ children, activeTab }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState('');

  // Auto-detect active tab from pathname if not provided
  const detectedTab = activeTab || (() => {
    if (pathname.startsWith('/admin/reports')) return 'reports';
    if (pathname.startsWith('/admin/payments')) return 'payments';
    if (pathname.startsWith('/admin/users')) return 'users';
    return 'users';
  })();

  useEffect(() => {
    async function init() {
      const user = await getCurrentUser();
      if (user) {
        const name = user.firstName || user.email?.split('@')[0] || 'Admin';
        setUserName(name);
      }
    }
    init();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir="rtl">
      <AdminHeader userName={userName} onLogout={handleLogout} />
      <AdminNav activeTab={detectedTab} />
      {children}
    </div>
  );
}

export function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  return (
    <AdminGuard>
      <AdminLayoutContent activeTab={activeTab}>
        {children}
      </AdminLayoutContent>
    </AdminGuard>
  );
}

