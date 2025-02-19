'use client';
import React, { useState } from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { navItems } from '@/constants/data';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import { useSidebar } from '@/hooks/useSidebar';
import Link from 'next/link';
import Logo from '@/assets/branding/logo';
import LogoIcon from '@/assets/branding/logo_icon';

type SidebarProps = {
  className?: string;
  userData?: any;
};

export default function Sidebar({ className, userData }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();

  const navigationList = navItems?.filter(nav => nav?.permission?.includes(userData?.permission))

  const handleToggle = () => {
    toggle();
  };

  return (
    <aside
      className={cn(
        `relative  hidden h-screen flex-none border-r bg-card transition-[width] duration-500 md:block`,
        !isMinimized ? 'w-48' : 'w-[72px]',
        className
      )}
    >
      <div className="hidden p-5 pb-2 pl-3 lg:block">
        <Link
          href={'/dashboard'}
        >
          {isMinimized ? <div className="transition-all duration-500 text-center"><LogoIcon className="w-12" /></div> : <div className="duration-1000 transition-all font-bold w-full">Super Admin</div>}
        </Link>
      </div>
      <ChevronLeft
        className={cn(
          'absolute -right-3 top-10 z-50  cursor-pointer rounded-full border bg-background text-3xl text-foreground',
          isMinimized && 'rotate-180'
        )}
        onClick={handleToggle}
      />
      <div className="space-y-4 py-4 pt-0">
        <div className="px-3">
          <div className="mt-3">
            <DashboardNav items={navigationList} />
          </div>
        </div>
      </div>
    </aside>
  );
}
