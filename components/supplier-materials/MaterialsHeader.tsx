'use client';
import React from 'react';

export default function MaterialsHeader() {
  return (
    <header className="bg-white border-b">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between p-4">
        <div>
          <h1 className="text-lg font-semibold">
            Tableau Fournisseur Matériaux
          </h1>
          <p className="text-sm text-slate-500">
            Gérez produits, stock et devis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-sm text-slate-600">
            Actions rapides
          </div>
          {/* you can add quick action buttons here */}
        </div>
      </div>
    </header>
  );
}
