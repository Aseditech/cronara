'use client';

import { Menu, Bell, Settings, User } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button className="rounded-lg p-2 hover:bg-zinc-100">
            <Menu className="h-5 w-5 text-zinc-600" />
          </button>
          <h1 className="text-xl font-bold text-zinc-900">Cronara</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="rounded-lg p-2 hover:bg-zinc-100">
            <Bell className="h-5 w-5 text-zinc-600" />
          </button>
          <button className="rounded-lg p-2 hover:bg-zinc-100">
            <Settings className="h-5 w-5 text-zinc-600" />
          </button>
          <button className="rounded-lg p-2 hover:bg-zinc-100">
            <User className="h-5 w-5 text-zinc-600" />
          </button>
        </div>
      </div>
    </nav>
  );
}
