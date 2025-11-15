'use client';
import React, { useState } from 'react';
import { Engine } from '@/types/engine';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Truck,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  QrCode,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
  DollarSign,
} from 'lucide-react';

export default function EnginesTable({
  engines,
  loading,
}: {
  engines: Engine[];
  loading: boolean;
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [engineToDelete, setEngineToDelete] = useState<Engine | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!engineToDelete) return;

    setDeleting(true);
    try {
      await fetch('/api/engines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: engineToDelete.id }),
      });
      location.reload();
    } catch (error) {
      console.error('Error deleting engine:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  }

  function openDeleteDialog(engine: Engine) {
    setEngineToDelete(engine);
    setDeleteDialogOpen(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-2" />
          <p className="text-slate-600">Chargement des engins...</p>
        </div>
      </div>
    );
  }

  if (!engines.length) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-600 font-medium">Aucun engin dans la flotte</p>
        <p className="text-sm text-slate-400 mt-1">
          Ajoutez votre premier engin pour commencer
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="font-semibold w-[250px]">Engin</TableHead>
              <TableHead className="font-semibold">Catégorie</TableHead>
              <TableHead className="font-semibold text-right">
                Tarif Horaire
              </TableHead>
              <TableHead className="font-semibold text-right">
                Tarif Journalier
              </TableHead>
              <TableHead className="font-semibold text-center">
                Disponibilité
              </TableHead>
              <TableHead className="font-semibold text-center w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {engines.map((engine) => (
              <TableRow
                key={engine.id}
                className="hover:bg-mariner-50/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-mariner-100">
                      <Truck className="w-5 h-5 text-mariner-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {engine.name}
                      </p>
                      <p className="text-xs text-slate-500">ID: {engine.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {engine.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <p className="font-semibold text-slate-900">
                      {engine.hoursRate.toLocaleString()} DA
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>/heure</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <p className="font-semibold text-slate-900">
                      {engine.dayRate.toLocaleString()} DA
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <DollarSign className="w-3 h-3" />
                      <span>/jour</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {engine.available ? (
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-300"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Disponible
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-red-50 text-danger-700 border-danger-300"
                    >
                      <XCircle className="w-3 h-3 mr-1" />
                      En mission
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-mariner-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/supplier-engines/fleet/${engine.id}`}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4 mr-2 " />
                          Voir détails
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/supplier-engines/fleet/${engine.id}/edit`}
                          className="cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <QrCode className="w-4 h-4 mr-2" />
                        Générer QR Code
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(engine)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'engin{' '}
              <strong className="text-slate-900">{engineToDelete?.name}</strong>{' '}
              ?
              <br />
              <br />
              Cette action est irréversible et supprimera également toutes les
              missions associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
