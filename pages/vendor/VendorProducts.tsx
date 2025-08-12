import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Package, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogTrigger } from '../../components/ui/dialog';
import { RouteContext } from '../../components/Router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductForm from '../../components/vendor/ProductForm';
import ProductItem from '../../components/vendor/ProductItem';
import { mockVendorProducts, productCategories, productBrands } from '../../data/vendorMockData';
import { useTranslation } from '../../hooks/useTranslation';

interface VendorProductsProps extends RouteContext {}

export default function VendorProducts({ setCurrentPage, setSelectedProduct }: VendorProductsProps) {
  const { locale } = useTranslation();
  const [products, setProducts] = useState(mockVendorProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockVendorProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Filter products based on search and filters
  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.includes(searchTerm) ||
        product.partNumber.includes(searchTerm) ||
        product.brand.includes(searchTerm)
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(product => product.status === selectedStatus);
    }

    if (selectedBrand && selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    setFilteredProducts(filtered);
  };

  // Update filters when dependencies change
  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedStatus, selectedBrand, products]);

  const handleAddProduct = (productData: any) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      sales: 0,
      views: 0,
      image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setProducts([...products, newProduct]);
    setIsAddDialogOpen(false);
  };

  const handleEditProduct = (productData: any) => {
    setProducts(products.map(p => p.id === productData.id ? productData : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm(locale === 'en' ? 'Are you sure you want to delete this product?' : 'هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
  };

  const getStatsCards = () => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status === 'active').length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const draftProducts = products.filter(p => p.status === 'draft').length;

    return [
      { title: locale === 'en' ? 'Total Products' : 'إجمالي المنتجات', value: totalProducts, icon: Package, color: 'text-blue-500' },
      { title: locale === 'en' ? 'Active Products' : 'المنتجات النشطة', value: activeProducts, icon: Package, color: 'text-green-500' },
      { title: locale === 'en' ? 'Out of Stock' : 'نفد المخزون', value: outOfStock, icon: AlertCircle, color: 'text-red-500' },
      { title: locale === 'en' ? 'Drafts' : 'المسودات', value: draftProducts, icon: Package, color: 'text-yellow-500' }
    ];
  };

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="vendor-products" setCurrentPage={setCurrentPage} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{locale === 'en' ? 'Product Management' : 'إدارة المنتجات'}</h1>
            <p className="text-muted-foreground">{locale === 'en' ? 'Manage your products and track sales' : 'إدارة منتجاتك ومتابعة المبيعات'}</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 ml-2" />
                {locale === 'en' ? 'Add New Product' : 'إضافة منتج جديد'}
              </Button>
            </DialogTrigger>
            <ProductForm 
              onSave={handleAddProduct}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {getStatsCards().map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                  <div className={`h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={locale === 'en' ? 'Search products...' : 'ابحث عن المنتجات...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={locale === 'en' ? 'Category' : 'الفئة'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'en' ? 'All Categories' : 'جميع الفئات'}</SelectItem>
                    {productCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder={locale === 'en' ? 'Brand' : 'العلامة التجارية'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'en' ? 'All Brands' : 'جميع العلامات'}</SelectItem>
                    {productBrands.map(brand => (
                      <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={locale === 'en' ? 'Status' : 'الحالة'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{locale === 'en' ? 'All Statuses' : 'جميع الحالات'}</SelectItem>
                    <SelectItem value="active">{locale === 'en' ? 'Active' : 'نشط'}</SelectItem>
                    <SelectItem value="draft">{locale === 'en' ? 'Draft' : 'مسودة'}</SelectItem>
                    <SelectItem value="out_of_stock">{locale === 'en' ? 'Out of Stock' : 'نفد المخزون'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <Card>
          <CardHeader>
            <CardTitle>{locale === 'en' ? 'Products' : 'المنتجات'} ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">{locale === 'en' ? 'No products' : 'لا توجد منتجات'}</h3>
                <p className="text-muted-foreground">{locale === 'en' ? 'Start by adding your first product' : 'ابدأ بإضافة منتجك الأول'}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    onEdit={setEditingProduct}
                    onDelete={handleDeleteProduct}
                    onView={handleViewProduct}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Edit Product Dialog */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <ProductForm 
              product={editingProduct}
              onSave={handleEditProduct}
              onCancel={() => setEditingProduct(null)}
            />
          </Dialog>
        )}
      </div>
      
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}