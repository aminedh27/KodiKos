'use client';
import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Separator } from '@/components/ui/separator';
import {
  Package,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  Minus,
  MoreVertical,
  AlertTriangle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  History,
  Edit,
  Trash2,
  PackagePlus,
  PackageMinus,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  searchProducts,
  updateQuantity,
  recordStockMovement,
} from '@/app/services/products';

type StockMovement = {
  id: string;
  productId: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  date: string;
  reason?: string;
};

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStock, setFilterStock] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [adjustmentQuantity, setAdjustmentQuantity] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'in' | 'out'>('in');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, filterCategory, filterStock]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await searchProducts('');
      const data = await res;
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  }

  function filterProducts() {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === filterCategory);
    }

    // Stock level filter
    if (filterStock === 'low') {
      filtered = filtered.filter((p) => p.stock <= 10);
    } else if (filterStock === 'out') {
      filtered = filtered.filter((p) => p.stock === 0);
    } else if (filterStock === 'available') {
      filtered = filtered.filter((p) => p.stock > 10);
    }

    setFilteredProducts(filtered);
  }

  async function updateStock(id: string, delta: number, reason?: string) {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    const newStock = Math.max(
      0,
      (typeof prod.quantity === 'number' ? prod.quantity : prod.stock) + delta
    );

    try {
      const updated = await updateQuantity(id, newStock);
      setProducts((p) => p.map((x) => (x.id === id ? (updated as any) : x)));

      await recordStockMovement({
        productId: id,
        type: delta > 0 ? 'in' : 'out',
        quantity: Math.abs(delta),
        date: new Date().toISOString(),
        reason,
      });
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Erreur lors de la mise à jour du stock');
    }
  }

  async function handleBulkAdjustment() {
    if (!selectedProduct || !adjustmentQuantity) return;

    const quantity = parseInt(adjustmentQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Veuillez entrer une quantité valide');
      return;
    }

    const delta = adjustmentType === 'in' ? quantity : -quantity;
    await updateStock(selectedProduct.id, delta, adjustmentReason || undefined);

    setAdjustmentDialogOpen(false);
    setAdjustmentQuantity('');
    setAdjustmentReason('');
    setSelectedProduct(null);
  }

  function getStockStatus(stock: number) {
    if (stock === 0)
      return {
        label: 'Rupture',
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: AlertTriangle,
      };
    if (stock <= 10)
      return {
        label: 'Stock faible',
        color: 'bg-amber-100 text-amber-700 border-amber-300',
        icon: AlertCircle,
      };
    return {
      label: 'En stock',
      color: 'bg-green-100 text-green-700 border-green-300',
      icon: CheckCircle2,
    };
  }

  const categories = Array.from(new Set(products.map((p) => p.category)));
  const lowStockCount = products.filter((p) => p.quantity <= 10).length;
  const outOfStockCount = products.filter((p) => p.quantity === 0).length;
  const totalValue = products.reduce(
    (sum, p) => sum + Number(p.price) * Number(p.quantity),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-2" />
          <p className="text-slate-600">Chargement des stocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Produits
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  {products.length}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-indigo-100">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Valeur Stock
                </p>
                <h3 className="text-2xl font-bold text-slate-900 mt-2">
                  {(totalValue / 1000000).toFixed(1)}M DA
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-emerald-100">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={lowStockCount > 0 ? 'border-amber-200 bg-amber-50/50' : ''}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Stock Faible
                </p>
                <h3 className="text-3xl font-bold text-amber-700 mt-2">
                  {lowStockCount}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-amber-100">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={outOfStockCount > 0 ? 'border-red-200 bg-red-50/50' : ''}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Rupture Stock
                </p>
                <h3 className="text-3xl font-bold text-red-700 mt-2">
                  {outOfStockCount}
                </h3>
              </div>
              <div className="p-3 rounded-xl bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
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
              <CardTitle className="text-xl">Gestion du Stock</CardTitle>
              <CardDescription>
                Suivez et ajustez vos niveaux de stock
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchProducts}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Rapport PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStock} onValueChange={setFilterStock}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Niveau stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="available">En stock</SelectItem>
                <SelectItem value="low">Stock faible</SelectItem>
                <SelectItem value="out">Rupture stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {filteredProducts.length} produit
              {filteredProducts.length !== 1 ? 's' : ''} trouvé
              {filteredProducts.length !== 1 ? 's' : ''}
            </p>
            {(searchTerm ||
              filterCategory !== 'all' ||
              filterStock !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterStock('all');
                }}
              >
                Réinitialiser filtres
              </Button>
            )}
          </div>

          {/* Stock Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold">Produit</TableHead>
                  <TableHead className="font-semibold">Catégorie</TableHead>
                  <TableHead className="font-semibold text-center">
                    Stock Actuel
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Statut
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    Valeur
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    Actions Rapides
                  </TableHead>
                  <TableHead className="font-semibold text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-600">Aucun produit trouvé</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Essayez de modifier vos filtres
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const status = getStockStatus(product.stock);
                    const StatusIcon = status.icon;

                    return (
                      <TableRow
                        key={product.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium text-slate-900">
                              {product.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {product.unit}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-slate-900">
                              {product.quantity}
                            </span>
                            <span className="text-xs text-slate-500">
                              {product.unit}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={`${status.color} border`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-semibold text-slate-900">
                              {product.price * product.quantity} DA
                            </p>
                            <p className="text-xs text-slate-500">
                              {product.price.toLocaleString()} DA/u
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 hover:bg-green-50 hover:border-green-300"
                              onClick={() =>
                                updateStock(
                                  product.id,
                                  1,
                                  'Ajustement rapide +1'
                                )
                              }
                            >
                              <Plus className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-300"
                              onClick={() =>
                                updateStock(
                                  product.id,
                                  -1,
                                  'Ajustement rapide -1'
                                )
                              }
                              disabled={product.stock === 0}
                            >
                              <Minus className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
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
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setAdjustmentType('in');
                                  setAdjustmentDialogOpen(true);
                                }}
                              >
                                <PackagePlus className="w-4 h-4 mr-2 text-green-600" />
                                Entrée de stock
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setAdjustmentType('out');
                                  setAdjustmentDialogOpen(true);
                                }}
                                disabled={product.stock === 0}
                              >
                                <PackageMinus className="w-4 h-4 mr-2 text-red-600" />
                                Sortie de stock
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <History className="w-4 h-4 mr-2" />
                                Historique
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Stock Adjustment Dialog */}
      <Dialog
        open={adjustmentDialogOpen}
        onOpenChange={setAdjustmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adjustmentType === 'in' ? 'Entrée de Stock' : 'Sortie de Stock'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct && (
                <>
                  {selectedProduct.name} - Stock actuel: {selectedProduct.stock}{' '}
                  {selectedProduct.unit}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="Entrez la quantité"
                value={adjustmentQuantity}
                onChange={(e) => setAdjustmentQuantity(e.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Motif (optionnel)</Label>
              <Input
                id="reason"
                placeholder="Ex: Livraison fournisseur, Vente, Inventaire..."
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
              />
            </div>
            {selectedProduct && adjustmentQuantity && (
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Aperçu:
                </p>
                <p className="text-sm text-slate-600">
                  Nouveau stock:{' '}
                  <span className="font-bold">
                    {adjustmentType === 'in'
                      ? selectedProduct.stock +
                        parseInt(adjustmentQuantity || '0')
                      : Math.max(
                          0,
                          selectedProduct.stock -
                            parseInt(adjustmentQuantity || '0')
                        )}{' '}
                    {selectedProduct.unit}
                  </span>
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAdjustmentDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              onClick={handleBulkAdjustment}
              className={
                adjustmentType === 'in'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }
            >
              {adjustmentType === 'in' ? (
                <PackagePlus className="w-4 h-4 mr-2" />
              ) : (
                <PackageMinus className="w-4 h-4 mr-2" />
              )}
              Valider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
