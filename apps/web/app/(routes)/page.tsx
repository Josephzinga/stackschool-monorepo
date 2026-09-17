'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from '@/components/ui/toast';
import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';

export function MainComponent({ children }: { children: React.ReactNode }) {
  const { isMobile, state } = useSidebar();
  return (
    <React.Fragment>
      <AppSidebar className="z-30" variant="sidebar" collapsible="icon" />
      <main
        className=""
        style={{
          width: isMobile
            ? '100%'
            : state === 'expanded'
              ? 'calc(100% - var(--sidebar-width))'
              : 'calc(100% - 3rem)',
        }}
      >
        <SiteHeader />

        <Toaster />

        {children}
      </main>
    </React.Fragment>
  );
}
