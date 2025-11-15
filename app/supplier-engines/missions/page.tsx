'use client';
import React, { useEffect, useState } from 'react';
import { Mission } from '@/types/mission';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Truck,
  Play,
  Square,
  Clock,
  MapPin,
  User,
  DollarSign,
  Plus,
  Filter,
  Search,
  RefreshCw,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Pause,
  XCircle,
  FileText,
  Download,
  QrCode,
  TrendingUp,
  Activity,
  CalendarDays,
  Edit,
  Trash2,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ScanSimulator from '@/components/supplier-engines/ScanSimulator';

type MissionStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export default function MissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [filteredMissions, setFilteredMissions] = useState<Mission[]>([]);
  const [engines, setEngines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');

  // Create Mission Dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [client, setClient] = useState('');
  const [engineId, setEngineId] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  // Scanner Dialog
  const [scanOpen, setScanOpen] = useState(false);

  useEffect(() => {
    fetchAll();
    fetchEngines();
  }, []);

  useEffect(() => {
    filterMissions();
  }, [missions, searchTerm, filterStatus, activeTab]);

  async function fetchAll() {
    setLoading(true);
    try {
      const res = await fetch('/api/missions');
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error(err);
      setMissions([]);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEngines() {
    try {
      const res = await fetch('/api/engines');
      const e = await res.json();
      setEngines(e);
    } catch (err) {
      console.error(err);
      setEngines([]);
    }
  }

  function filterMissions() {
    let filtered = [...missions];

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter((m) => m.status === activeTab);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
          engines
            .find((e) => e.id === m.engineId)
            ?.name.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((m) => m.status === filterStatus);
    }

    setFilteredMissions(filtered);
  }

  async function createMission() {
    if (!engineId || !client) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const mission = {
      engineId,
      client,
      location: location || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      notes: notes || undefined,
      status: 'planned' as MissionStatus,
    };

    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', mission }),
      });
      const json = await res.json();

      if (json?.ok) {
        resetForm();
        setCreateDialogOpen(false);
        fetchAll();
      } else {
        alert('Erreur lors de la création de la mission');
      }
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création de la mission');
    }
  }

  function resetForm() {
    setClient('');
    setEngineId('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setNotes('');
  }

  async function startMission(id: string) {
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', id }),
      });
      const json = await res.json();
      if (json?.ok) fetchAll();
      else alert('Erreur lors du démarrage de la mission');
    } catch (error) {
      console.error(error);
      alert('Erreur lors du démarrage de la mission');
    }
  }

  async function stopMission(id: string) {
    try {
      const res = await fetch('/api/missions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop', id }),
      });
      const json = await res.json();
      if (json?.ok) fetchAll();
      else alert("Erreur lors de l'arrêt de la mission");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'arrêt de la mission");
    }
  }

  function getStatusConfig(status: MissionStatus) {
    const configs = {
      planned: {
        label: 'Planifiée',
        color: 'bg-primary-100 text-primary-700 border-primary-300',
        icon: Calendar,
      },
      in_progress: {
        label: 'En cours',
        color: 'bg-success-100 text-success-700 border-success-300',
        icon: Activity,
      },
      completed: {
        label: 'Terminée',
        color: 'bg-success-100 text-success-700 border-success-300',
        icon: CheckCircle2,
      },
      cancelled: {
        label: 'Annulée',
        color: 'bg-danger-100 text-danger-700 border-danger-300',
        icon: XCircle,
      },
    };
    return configs[status] || configs.planned;
  }

  function getEngineName(engineId: string) {
    return engines.find((e) => e.id === engineId)?.name || 'Engin inconnu';
  }

  function calculateDuration(start?: string, end?: string) {
    if (!start) return null;
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const hours = Math.floor(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)
    );
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}j ${hours % 24}h`;
    return `${hours}h`;
  }

  const stats = {
    total: missions.length,
    planned: missions.filter((m) => m.status === 'planned').length,
    inProgress: missions.filter((m) => m.status === 'in_progress').length,
    completed: missions.filter((m) => m.status === 'completed').length,
  };

  const activeEngines = new Set(
    missions.filter((m) => m.status === 'in_progress').map((m) => m.engineId)
  ).size;
  const utilizationRate =
    engines.length > 0 ? (activeEngines / engines.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-2" />
          <p className="text-slate-600">Chargement des missions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Missions
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {stats.total}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Ce mois</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">En Cours</p>
                <h3 className="text-3xl font-bold text-green-700 mt-2">
                  {stats.inProgress}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Actives maintenant
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-100">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Planifiées</p>
                <h3 className="text-3xl font-bold text-mariner-700 mt-2">
                  {stats.planned}
                </h3>
                <p className="text-xs text-slate-500 mt-1">À venir</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-100">
                <CalendarDays className="w-5 h-5 text-mariner-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Taux Utilisation
                </p>
                <h3 className="text-3xl font-bold text-success-700 mt-2">
                  {utilizationRate.toFixed(0)}%
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {activeEngines}/{engines.length} engins actifs
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <TrendingUp className="w-5 h-5 text-success-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Gestion des Missions</CardTitle>
              <CardDescription className="text-secondary-700">
                Planifiez et suivez vos missions d'engins
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchAll}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScanOpen(true)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scanner QR
              </Button>
              <Button
                size="sm"
                onClick={() => setCreateDialogOpen(true)}
                className="bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Mission
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher par client ou engin..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="planned">Planifiées</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
                <SelectItem value="cancelled">Annulées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 "
          >
            <TabsList className="grid w-full grid-cols-4 bg-white border rounded">
              <TabsTrigger value="all" className="">
                Toutes
                <Badge variant="secondary" className="ml-2">
                  {stats.total}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="planned">
                Planifiées
                <Badge variant="secondary" className="ml-2">
                  {stats.planned}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                En cours
                <Badge variant="secondary" className="ml-2">
                  {stats.inProgress}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Terminées
                <Badge variant="secondary" className="ml-2">
                  {stats.completed}
                </Badge>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredMissions.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">
                    Aucune mission trouvée
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    {activeTab === 'all'
                      ? 'Créez votre première mission'
                      : `Aucune mission ${getStatusConfig(
                          activeTab as MissionStatus
                        ).label.toLowerCase()}`}
                  </p>
                  {activeTab === 'all' && (
                    <Button
                      className="mt-4 bg-primary-600 hover:bg-primary-700"
                      onClick={() => setCreateDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer une mission
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredMissions.map((mission) => {
                    const statusConfig = getStatusConfig(mission.status);
                    const StatusIcon = statusConfig.icon;
                    const engineName = getEngineName(mission.engineId);
                    const duration = calculateDuration(
                      mission.start,
                      mission.end
                    );

                    return (
                      <Card
                        key={mission.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-2.5 rounded-lg bg-amber-100">
                                <Truck className="w-5 h-5 text-amber-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 mb-1">
                                  {mission.client}
                                </h3>
                                <p className="text-sm text-slate-600">
                                  {engineName}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`${statusConfig.color} border`}
                              >
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Modifier
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Détails
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <div className="space-y-3 mb-4">
                            {mission.start && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <span>
                                  {mission.status === 'in_progress'
                                    ? 'Démarré'
                                    : 'Démarrage'}
                                  :{' '}
                                  {new Date(mission.start).toLocaleDateString(
                                    'fr-FR'
                                  )}{' '}
                                  à{' '}
                                  {new Date(mission.start).toLocaleTimeString(
                                    'fr-FR',
                                    { hour: '2-digit', minute: '2-digit' }
                                  )}
                                </span>
                              </div>
                            )}
                            {mission.end && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                <span>
                                  Terminé:{' '}
                                  {new Date(mission.end).toLocaleDateString(
                                    'fr-FR'
                                  )}{' '}
                                  à{' '}
                                  {new Date(mission.end).toLocaleTimeString(
                                    'fr-FR',
                                    { hour: '2-digit', minute: '2-digit' }
                                  )}
                                </span>
                              </div>
                            )}
                            {duration && (
                              <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
                                <Activity className="w-4 h-4" />
                                <span>Durée: {duration}</span>
                              </div>
                            )}
                          </div>

                          {/* Progress Bar for In Progress Missions */}
                          {mission.status === 'in_progress' &&
                            mission.start && (
                              <div className="mb-4">
                                <div className="flex justify-between text-xs text-slate-600 mb-1">
                                  <span>Mission en cours</span>
                                  <span>{duration}</span>
                                </div>
                                <Progress value={65} className="h-2" />
                              </div>
                            )}

                          {/* Action Buttons */}
                          <div className="flex gap-2">
                            {mission.status === 'planned' && (
                              <Button
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                onClick={() => startMission(mission.id)}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Démarrer
                              </Button>
                            )}
                            {mission.status === 'in_progress' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Pause className="w-4 h-4 mr-2" />
                                  Pause
                                </Button>
                                <Button
                                  size="sm"
                                  className="flex-1 bg-red-600 hover:bg-red-700"
                                  onClick={() => stopMission(mission.id)}
                                >
                                  <Square className="w-4 h-4 mr-2" />
                                  Terminer
                                </Button>
                              </>
                            )}
                            {mission.status === 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Télécharger rapport
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Mission Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Planifier une Nouvelle Mission</DialogTitle>
            <DialogDescription>
              Créez une mission et assignez un engin à un client
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="client">Client *</Label>
              <Input
                id="client"
                placeholder="Nom du client"
                value={client}
                onChange={(e) => setClient(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="engine">Engin *</Label>
              <Select value={engineId} onValueChange={setEngineId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un engin" />
                </SelectTrigger>
                <SelectContent>
                  {engines
                    .filter((e) => e.available)
                    .map((engine) => (
                      <SelectItem key={engine.id} value={engine.id}>
                        {engine.name} - {engine.category} (
                        {engine.dayRate.toLocaleString()} DA/jour)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                {engines.filter((e) => e.available).length} engin(s)
                disponible(s)
              </p>
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                placeholder="Adresse ou lieu"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin estimée</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Détails supplémentaires..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={createMission}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Créer la mission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Scanner */}
      {scanOpen && (
        <ScanSimulator
          onClose={() => {
            setScanOpen(false);
            fetchAll();
          }}
          onResult={() => {
            fetchAll();
            fetchEngines();
            setScanOpen(false);
          }}
        />
      )}
    </div>
  );
}
