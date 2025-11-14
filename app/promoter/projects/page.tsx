// app/promoter/projects/page.tsx
'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([
    { id: 'proj1', name: 'Résidence A', budget: 0, status: 'draft' },
  ]);

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Projets</h2>
        <Button onClick={() => alert('Créer projet (mock)')}>
          Nouveau projet
        </Button>
      </div>

      <div className="bg-white border rounded p-4">
        <ul className="space-y-2">
          {projects.map((p) => (
            <li
              key={p.id}
              className="flex justify-between items-center border rounded p-2"
            >
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-slate-500">Statut: {p.status}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => alert('Ouvrir projet (mock)')}
                >
                  Ouvrir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
