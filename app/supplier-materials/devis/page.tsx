// app/supplier-materials/devis/page.tsx
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Printer,
  Eye,
  Loader2,
  Calendar,
  Building2,
  Phone,
  Mail,
  MapPin,
  X,
  Search,
} from 'lucide-react';
import { searchProducts } from '@/app/services/products';
import { listDevis, createDevis as createDevisSvc } from '@/app/services/devis';

const CLIENTS = [
  {
    id: '1',
    name: 'Client A',
    email: 'clienta@example.com',
    phone: '+213 555 123 456',
    address: 'Alger Centre',
  },
  {
    id: '2',
    name: 'Client B',
    email: 'clientb@example.com',
    phone: '+213 555 789 012',
    address: 'Oran',
  },
  {
    id: '3',
    name: 'Client C',
    email: 'clientc@example.com',
    phone: '+213 555 345 678',
    address: 'Constantine',
  },
];

type DevisItem = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  unit: string;
};

export default function DevisPage() {
  const [devis, setDevis] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDevis, setLoadingDevis] = useState(false);

  // Form state
  const [selectedClient, setSelectedClient] = useState<
    (typeof CLIENTS)[0] | null
  >(null);
  const [items, setItems] = useState<DevisItem[]>([]);
  const [notes, setNotes] = useState('');
  const [validityDays, setValidityDays] = useState(30);

  // Dialog states
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewDevis, setPreviewDevis] = useState<any>(null);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);

  // Add item form
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    fetchDevis();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await searchProducts('');
      const data = await res;
      setProducts(data);
    } catch (err) {
      console.error('fetch products error', err);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  }

  async function fetchDevis() {
    setLoadingDevis(true);
    try {
      const rows = await listDevis();
      // Map to UI shape expected by this page
      const mapped = rows.map((d) => ({
        id: d.id,
        client: d.client_name,
        clientPhone: d.client_phone,
        total: d.total,
        createdAt: d.created_at,
        items: d.items,
      }));
      setDevis(mapped);
    } catch (err) {
      console.error('fetch devis error', err);
    } finally {
      setLoadingDevis(false);
    }
  }

  function addItemToDevis() {
    if (!selectedProduct) {
      toast.error('Veuillez sélectionner un produit');
      return;
    }

    if (itemQuantity <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }

    const newItem: DevisItem = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      quantity: itemQuantity,
      price: selectedProduct.price,
      unit: selectedProduct.unit,
    };

    setItems([...items, newItem]);
    setAddItemDialogOpen(false);
    setSelectedProduct(null);
    setItemQuantity(1);
    setSearchTerm('');
    toast.success('Article ajouté');
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
    toast.success('Article retiré');
  }

  function calculateSubtotal() {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }

  function calculateTax() {
    return calculateSubtotal() * 0.19; // 19% TVA
  }

  function calculateTotal() {
    return calculateSubtotal() + calculateTax();
  }

  async function createDevis() {
    if (!selectedClient) {
      toast.error('Veuillez sélectionner un client');
      return;
    }

    if (items.length === 0) {
      toast.error('Veuillez ajouter au moins un article');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        client_name: selectedClient.name,
        client_phone: selectedClient.phone,
        total: calculateTotal(),
        items: items.map((it) => ({
          product_id: it.productId,
          quantity: it.quantity,
          unit_price: it.price,
          subtotal: it.quantity * it.price,
        })),
      };
      await createDevisSvc(payload);
      resetForm();
      fetchDevis();
      toast.success('Devis créé avec succès');
    } catch (err) {
      console.error('create devis error', err);
      toast.error('Erreur lors de la création du devis');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSelectedClient(null);
    setItems([]);
    setNotes('');
    setValidityDays(30);
  }

  function openPreview(devisData?: any) {
    if (devisData) {
      setPreviewDevis(devisData);
    } else {
      // Create preview from current form
      setPreviewDevis({
        id: 'DRAFT',
        client: selectedClient?.name || '',
        clientEmail: selectedClient?.email || '',
        clientPhone: selectedClient?.phone || '',
        clientAddress: selectedClient?.address || '',
        items,
        total: calculateTotal(),
        notes,
        validityDays,
        createdAt: new Date().toISOString(),
      });
    }
    setPreviewDialogOpen(true);
  }

  function printDevis() {
    if (previewRef.current) {
      const printContent = previewRef.current.innerHTML;
      const printWindow = window.open('', '', 'height=800,width=800');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Devis</title>');
        printWindow.document.write(
          '<style>body{font-family:Arial,sans-serif;padding:40px;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #ddd;padding:8px;text-align:left;} th{background-color:#f5f5f5;}</style>'
        );
        printWindow.document.write('</head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Devis
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {devis.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-indigo-100">
                <FileText className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Ce Mois</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {
                    devis.filter((d) => {
                      const date = new Date(d.createdAt);
                      const now = new Date();
                      return (
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear()
                      );
                    }).length
                  }
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <Calendar className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Valeur Totale
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {(
                    devis.reduce((sum, d) => sum + d.total, 0) / 1000000
                  ).toFixed(1)}
                  M DA
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <Building2 className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create Devis Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Créer un Nouveau Devis</CardTitle>
            <CardDescription>
              Sélectionnez un client et ajoutez des articles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Client Selection */}
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select
                value={selectedClient?.id || ''}
                onValueChange={(id) =>
                  setSelectedClient(CLIENTS.find((c) => c.id === id) || null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {CLIENTS.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedClient && (
                <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 mt-2">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-4 h-4 text-indigo-600" />
                      <span>{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-4 h-4 text-indigo-600" />
                      <span>{selectedClient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span>{selectedClient.address}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Articles</Label>
                <Button
                  size="sm"
                  onClick={() => setAddItemDialogOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">Aucun article ajouté</p>
                </div>
              ) : (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead>Article</TableHead>
                        <TableHead className="text-center">Qté</TableHead>
                        <TableHead className="text-right">Prix U.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs text-slate-500">
                                {item.unit}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.price.toLocaleString()} DA
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {(item.quantity * item.price).toLocaleString()} DA
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Sous-total:</span>
                  <span className="font-semibold">
                    {calculateSubtotal().toLocaleString()} DA
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">TVA (19%):</span>
                  <span className="font-semibold">
                    {calculateTax().toLocaleString()} DA
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-900">
                    Total TTC:
                  </span>
                  <span className="font-bold text-lg text-indigo-600">
                    {calculateTotal().toLocaleString()} DA
                  </span>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="validity">Validité (jours)</Label>
                <Input
                  id="validity"
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(Number(e.target.value))}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes / Conditions</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Conditions de paiement, délai de livraison, etc..."
                  rows={3}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                Annuler
              </Button>
              <Button
                variant="outline"
                onClick={() => openPreview()}
                disabled={!selectedClient || items.length === 0}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Aperçu
              </Button>
              <Button
                onClick={createDevis}
                disabled={loading || !selectedClient || items.length === 0}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                Créer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Devis History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Historique des Devis</CardTitle>
            <CardDescription>Derniers devis créés</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingDevis ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : devis.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-lg">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">Aucun devis créé</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {devis.map((d) => (
                  <div
                    key={d.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => openPreview(d)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900">
                          {d.client}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(d.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-indigo-50 text-indigo-700 border-indigo-200"
                      >
                        #{d.id}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">
                        {d.items?.length || 0} article
                        {(d.items?.length || 0) > 1 ? 's' : ''}
                      </span>
                      <span className="font-bold text-indigo-600">
                        {d.total.toLocaleString()} DA
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un Article</DialogTitle>
            <DialogDescription>
              Sélectionnez un produit de votre catalogue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Products Grid */}
            <div className="max-h-[400px] overflow-y-auto border rounded-lg">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-600">Aucun produit trouvé</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 p-2 overflow-y-scroll">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedProduct?.id === product.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <h4 className="font-semibold text-sm text-slate-900 mb-1">
                        {product.name}
                      </h4>
                      <Badge variant="outline" className="text-xs mb-2">
                        {product.category}
                      </Badge>
                      <p className="text-sm font-bold text-indigo-600">
                        {product.price.toLocaleString()} DA / {product.unit}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Stock: {product.stock}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity */}
            {selectedProduct && (
              <div className="space-y-2">
                <Label>Quantité</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Number(e.target.value))}
                    min="1"
                    className="w-32"
                  />
                  <span className="text-sm text-slate-600">
                    {selectedProduct.unit}
                  </span>
                  <div className="flex-1 text-right">
                    <span className="text-sm text-slate-600">Total: </span>
                    <span className="font-bold text-indigo-600">
                      {(itemQuantity * selectedProduct.price).toLocaleString()}{' '}
                      DA
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddItemDialogOpen(false);
                setSelectedProduct(null);
                setItemQuantity(1);
                setSearchTerm('');
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={addItemToDevis}
              disabled={!selectedProduct}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog - A4 Format */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Aperçu du Devis</DialogTitle>
            <DialogDescription>Format A4 - Prêt à imprimer</DialogDescription>
          </DialogHeader>

          {previewDevis && (
            <div
              ref={previewRef}
              className="bg-white p-12"
              style={{ width: '210mm', minHeight: '297mm' }}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h1 className="text-4xl font-bold text-indigo-600 mb-2">
                    DEVIS
                  </h1>
                  <p className="text-slate-600">#{previewDevis.id}</p>
                  <p className="text-sm text-slate-500">
                    Date:{' '}
                    {new Date(previewDevis.createdAt).toLocaleDateString(
                      'fr-FR'
                    )}
                  </p>
                  <p className="text-sm text-slate-500">
                    Valide jusqu'au:{' '}
                    {new Date(
                      new Date(previewDevis.createdAt).getTime() +
                        (previewDevis.validityDays || 30) * 24 * 60 * 60 * 1000
                    ).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Fournisseur Matériaux
                  </h2>
                  <p className="text-sm text-slate-600">123 Rue Principale</p>
                  <p className="text-sm text-slate-600">Alger, Algérie</p>
                  <p className="text-sm text-slate-600">Tel: +213 21 123 456</p>
                  <p className="text-sm text-slate-600">contact@materio.dz</p>
                </div>
              </div>

              {/* Client Info */}
              <div className="mb-8 p-6 bg-slate-50 rounded-lg">
                <h3 className="font-semibold text-slate-900 mb-3">Client</h3>
                <p className="font-bold text-lg text-slate-900">
                  {previewDevis.client}
                </p>
                {previewDevis.clientEmail && (
                  <p className="text-sm text-slate-600">
                    {previewDevis.clientEmail}
                  </p>
                )}
                {previewDevis.clientPhone && (
                  <p className="text-sm text-slate-600">
                    {previewDevis.clientPhone}
                  </p>
                )}
                {previewDevis.clientAddress && (
                  <p className="text-sm text-slate-600">
                    {previewDevis.clientAddress}
                  </p>
                )}
              </div>

              {/* Items Table */}
              <table className="w-full mb-8 border-collapse">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="text-left p-3 border">Article</th>
                    <th className="text-center p-3 border w-24">Quantité</th>
                    <th className="text-right p-3 border w-32">
                      Prix Unitaire
                    </th>
                    <th className="text-right p-3 border w-32">Total HT</th>
                  </tr>
                </thead>
                <tbody>
                  {(previewDevis.items || []).map(
                    (item: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 border">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-slate-500">
                              {item.unit}
                            </p>
                          </div>
                        </td>
                        <td className="text-center p-3 border">
                          {item.quantity}
                        </td>
                        <td className="text-right p-3 border">
                          {item.price.toLocaleString()} DA
                        </td>
                        <td className="text-right p-3 border font-semibold">
                          {(item.quantity * item.price).toLocaleString()} DA
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>

              {/* Totals */}
              <div className="flex justify-end mb-8">
                <div className="w-80 space-y-3">
                  <div className="flex justify-between p-3 bg-slate-50">
                    <span className="text-slate-700">Sous-total HT:</span>
                    <span className="font-semibold">
                      {(previewDevis.total / 1.19).toFixed(2).toLocaleString()}{' '}
                      DA
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-slate-50">
                    <span className="text-slate-700">TVA (19%):</span>
                    <span className="font-semibold">
                      {(previewDevis.total - previewDevis.total / 1.19)
                        .toFixed(2)
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                      DA
                    </span>
                  </div>
                  <div className="flex justify-between p-4 bg-indigo-600 text-white rounded-lg">
                    <span className="font-bold text-lg">Total TTC:</span>
                    <span className="font-bold text-2xl">
                      {previewDevis.total.toLocaleString()} DA
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {previewDevis.notes && (
                <div className="mb-8 p-6 bg-amber-50 border-l-4 border-amber-500 rounded">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    Notes et Conditions
                  </h3>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">
                    {previewDevis.notes}
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="border-t-2 border-slate-200 pt-6 mt-12">
                <div className="grid grid-cols-2 gap-8 text-sm text-slate-600">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Conditions de paiement
                    </h4>
                    <p>Paiement à 30 jours fin de mois</p>
                    <p>Virement bancaire ou espèces</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">
                      Informations légales
                    </h4>
                    <p>RC: 123456789</p>
                    <p>NIF: 987654321</p>
                    <p>AI: 2024000123</p>
                  </div>
                </div>
                <div className="text-center mt-8 pt-6 border-t border-slate-200">
                  <p className="text-xs text-slate-500">
                    Ce devis est valable pour une durée de{' '}
                    {previewDevis.validityDays || 30} jours à compter de sa date
                    d'émission
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Fermer
            </Button>
            <Button variant="outline" onClick={printDevis}>
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Download className="w-4 h-4 mr-2" />
              Télécharger PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
