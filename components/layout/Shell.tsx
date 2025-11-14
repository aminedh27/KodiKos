// components/Shell.tsx
'use client';
import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Shell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r transition-all duration-200 ${
            collapsed ? 'w-20' : 'w-64'
          } hidden md:block`}
        >
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((s) => !s)}
          />
        </aside>

        {/* Mobile sidebar placeholder (we'll show a topbar menu button) */}
        <div className="flex-1 min-h-screen flex flex-col">
          <Header
            onToggleSidebar={() => setCollapsed((s) => !s)}
            collapsed={collapsed}
          />
          <main className="p-6 md:p-8">
            <div className="max-w-[1200px] mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
