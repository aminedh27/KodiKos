'use client';
import React from 'react';

export default function EnginesHeader() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between p-4">
        <div>
          <h1 className="text-lg font-semibold">Tableau Fournisseur Engins</h1>
          <p className="text-sm text-slate-500">
            Gérez votre flotte, missions et facturation
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Quick actions can be placed here */}
        </div>
      </div>
    </header>
  );
}
