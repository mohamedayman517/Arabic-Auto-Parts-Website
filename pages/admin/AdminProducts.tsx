import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import type { RouteContext } from '../../components/Router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Package, Search, Filter, Plus, Edit, Trash2, Store, Tag, ArrowRight, CheckCircle, Ban } from 'lucide-react';

// Local mock store for products (localStorage)
interface ProductRow {
  id: number;
  name: string;
  sku: string;
  vendor: string;
  price: number;
  status: 'active' | 'pending' | 'suspended';
  stock: number;
  notes?: string;
  createdAt: string;
}

const STORAGE_KEY = 'admin_products_mock';

function readProducts(): ProductRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seed: ProductRow[] = [
    { id: 1, name: 'فلتر زيت محرك', sku: 'OF-TOY-2015', vendor: 'متجر الجودة', price: 85, status: 'active', stock: 50, createdAt: '2024-01-10' },
    { id: 2, name: 'إطار 225/65R17', sku: 'TY-225-65R17', vendor: 'قطع غيار بلس', price: 450, status: 'pending', stock: 12, createdAt: '2024-01-12' },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function writeProducts(rows: ProductRow[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(rows)); } catch {}
}

export default function AdminProducts({ setCurrentPage, ...context }: Partial<RouteContext>) {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | ProductRow['status']>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ProductRow>>({ name: '', sku: '', vendor: '', price: 0, status: 'pending', stock: 0, notes: '' });

  useEffect(() => { setRows(readProducts()); }, []);
  const reload = () => setRows(readProducts());

  const filtered = rows.filter(r => {
    const s = search.trim().toLowerCase();
    const matches = !s || r.name.toLowerCase().includes(s) || r.sku.toLowerCase().includes(s) || r.vendor.toLowerCase().includes(s);
    const statusOk = status === 'all' || r.status === status;
    return matches && statusOk;
  });

  const openCreate = () => { setEditId(null); setForm({ name: '', sku: '', vendor: '', price: 0, status: 'pending', stock: 0, notes: '' }); setFormOpen(true); };
  const openEdit = (r: ProductRow) => { setEditId(r.id); setForm({ ...r }); setFormOpen(true); };

  const submit = () => {
    if (!form.name || !form.sku) return;
    const data = readProducts();
    if (editId) {
      const idx = data.findIndex(x => x.id === editId);
      if (idx !== -1) {
        data[idx] = { ...(data[idx]), ...form, id: editId, price: Number(form.price||0), stock: Number(form.stock||0) } as ProductRow;
      }
    } else {
      const id = Date.now();
      data.push({
        id,
        name: String(form.name),
        sku: String(form.sku),
        vendor: String(form.vendor||''),
        price: Number(form.price||0),
        status: (form.status as ProductRow['status']) || 'pending',
        stock: Number(form.stock||0),
        notes: String(form.notes||''),
        createdAt: new Date().toISOString().slice(0,10),
      });
    }
    writeProducts(data);
    setFormOpen(false); setEditId(null); reload();
  };

  const setRowStatus = (r: ProductRow, s: ProductRow['status']) => { const d = readProducts(); const i = d.findIndex(x=>x.id===r.id); if (i!==-1){ d[i].status=s; writeProducts(d); reload(); } };
  const removeRow = (r: ProductRow) => { const d = readProducts().filter(x=>x.id!==r.id); writeProducts(d); reload(); };

  return (
    <div className="min-h-screen bg-background">
      <Header {...context} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Button variant="outline" onClick={() => setCurrentPage && setCurrentPage('admin-dashboard')} className="mr-4">
              <ArrowRight className="ml-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          <h1 className="mb-2">Manage Products</h1>
          <p className="text-muted-foreground">Browse and manage products, status, and stock.</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5" />Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name, SKU, or store" value={search} onChange={e=>setSearch(e.target.value)} className="pr-10" />
              </div>
              <Select value={status} onValueChange={(v:any)=>setStatus(v)}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" />Add Product</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Package className="mr-2 h-5 w-5" />Products ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filtered.map(r => (
                <div key={r.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"><Tag className="h-6 w-6 text-primary" /></div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <h3 className="font-medium">{r.name}</h3>
                        <Badge variant={r.status==='active'?'default': r.status==='pending'? 'secondary':'destructive'}>
                          {r.status==='active'?'Active': r.status==='pending'? 'Pending':'Suspended'}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-muted-foreground">
                        <div className="flex items-center"><Tag className="mr-1 h-3 w-3" />{r.sku}</div>
                        <div className="flex items-center"><Store className="mr-1 h-3 w-3" />{r.vendor}</div>
                        <span>Price: {r.price} SAR</span>
                        <span>Stock: {r.stock}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    {r.status==='active' ? (
                      <Button size="sm" variant="outline" onClick={()=>setRowStatus(r,'suspended')}><Ban className="h-4 w-4" /></Button>
                    ) : (
                      <Button size="sm" variant="outline" onClick={()=>setRowStatus(r,'active')}><CheckCircle className="h-4 w-4" /></Button>
                    )}
                    <Button size="sm" variant="outline" onClick={()=>openEdit(r)}><Edit className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={()=>removeRow(r)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length===0 && (
              <div className="text-center py-8 text-muted-foreground">No matching results</div>
            )}
          </CardContent>
        </Card>

        <Dialog open={formOpen} onOpenChange={(o)=>{ setFormOpen(o); if(!o) setEditId(null); }}>
          <DialogContent className="max-w-lg bg-white/95 backdrop-blur-sm border border-white/20">
            <DialogHeader><DialogTitle>{editId? 'Edit Product' : 'Add Product'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Product name</Label>
                <Input value={form.name||''} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
              </div>
              <div>
                <Label>SKU</Label>
                <Input value={form.sku||''} onChange={e=>setForm(f=>({...f, sku:e.target.value}))} />
              </div>
              <div>
                <Label>Store</Label>
                <Input value={form.vendor||''} onChange={e=>setForm(f=>({...f, vendor:e.target.value}))} />
              </div>
              <div>
                <Label>Price</Label>
                <Input type="number" value={String(form.price||0)} onChange={e=>setForm(f=>({...f, price: Number(e.target.value||0)}))} />
              </div>
              <div>
                <Label>Status</Label>
                <Select value={(form.status as any)||'pending'} onValueChange={(v:any)=>setForm(f=>({...f, status:v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" value={String(form.stock||0)} onChange={e=>setForm(f=>({...f, stock: Number(e.target.value||0)}))} />
              </div>
              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea value={form.notes||''} onChange={e=>setForm(f=>({...f, notes:e.target.value}))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={()=>setFormOpen(false)}>Cancel</Button>
              <Button onClick={submit}>{editId? 'Save' : 'Add'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
