import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  ArrowUpDown,
  Grid,
  List,
  Package,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Checkbox } from "../components/ui/checkbox";
import { Separator } from "../components/ui/separator";
import { RouteContext } from "../components/Router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useTranslation } from "../hooks/useTranslation";
import { Dialog, DialogTrigger } from "../components/ui/dialog";
import ProductForm from "../components/vendor/ProductForm";
import { confirmDialog } from "../utils/alerts";

// Mock data for auto spare parts (acts like a backend)
// `group` is a normalized category key coming from homepage: engines | tires | electrical | tools
const mockProducts = [
  {
    id: "1",
    group: 'engines',
    name: {
      ar: "فلتر زيت محرك تويوتا كامري",
      en: "Toyota Camry Engine Oil Filter",
    },
    brand: { ar: "تويوتا", en: "Toyota" },
    category: { ar: "فلاتر", en: "Filters" },
    subCategory: { ar: "فلاتر الزيت", en: "Oil Filters" },
    price: 85,
    originalPrice: 120,
    rating: 4.5,
    reviewCount: 128,
    image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
    inStock: true,
    isNew: false,
    isOnSale: true,
    compatibility: [
      { ar: "تويوتا كامري 2015-2022", en: "Toyota Camry 2015-2022" },
      { ar: "تويوتا أفالون 2016-2021", en: "Toyota Avalon 2016-2021" },
    ],
    partNumber: "TOY-OF-2015",
    warranty: { ar: "6 أشهر", en: "6 months" },
    description: {
      ar: "فلتر زيت عالي الجودة للمحركات",
      en: "High quality oil filter for engines",
    },
  },
  {
    id: "2",
    group: 'tires',
    name: {
      ar: "إطار ميشلين بريميير 225/65R17",
      en: "Michelin Premier Tire 225/65R17",
    },
    brand: { ar: "ميشيلين", en: "Michelin" },
    category: { ar: "إطارات", en: "Tires" },
    subCategory: { ar: "إطارات سيارات", en: "Car Tires" },
    price: 450,
    originalPrice: 450,
    rating: 4.8,
    reviewCount: 256,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    inStock: true,
    isNew: true,
    isOnSale: false,
    compatibility: [
      { ar: "هوندا أكورد", en: "Honda Accord" },
      { ar: "نيسان التيما", en: "Nissan Altima" },
      { ar: "تويوتا كامري", en: "Toyota Camry" },
    ],
    partNumber: "MICH-PREM-225",
    warranty: { ar: "5 سنوات", en: "5 years" },
    description: {
      ar: "إطار متين وآمن للطرق الجافة والمبللة",
      en: "Durable and safe tire for dry and wet roads",
    },
  },
  {
    id: "3",
    group: 'electrical',
    name: { ar: "بطارية AC Delco 60 أمبير", en: "AC Delco 60 Amp Battery" },
    brand: { ar: "AC Delco", en: "AC Delco" },
    category: { ar: "بطاريات", en: "Batteries" },
    subCategory: { ar: "بطاريات سيارات", en: "Car Batteries" },
    price: 180,
    originalPrice: 220,
    rating: 4.3,
    reviewCount: 89,
    image: "https://images.unsplash.com/photo-1609592842852-f9a6d461e543?w=400",
    inStock: false,
    isNew: false,
    isOnSale: true,
    compatibility: [
      { ar: "معظم السيارات اليابانية", en: "Most Japanese cars" },
      { ar: "بعض السيارات الأمريكية", en: "Some American cars" },
    ],
    partNumber: "ACD-BAT-60A",
    warranty: { ar: "18 شهر", en: "18 months" },
    description: {
      ar: "بطارية موثوقة بأداء عالي",
      en: "High quality battery with excellent performance",
    },
  },
  {
    id: "4",
    group: 'electrical',
    name: {
      ar: "مكابح بريمبو سيراميك أمامية",
      en: "Brembo Ceramic Front Brake Discs",
    },
    brand: { ar: "بريمبو", en: "Brembo" },
    category: { ar: "مكابح", en: "Brakes" },
    subCategory: { ar: "أقراص المكابح", en: "Brake Discs" },
    price: 320,
    originalPrice: 320,
    rating: 4.7,
    reviewCount: 167,
    image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=400",
    inStock: true,
    isNew: false,
    isOnSale: false,
    compatibility: [
      { ar: "BMW سلسلة 3", en: "BMW Series 3" },
      { ar: "أودي A4", en: "Audi A4" },
      { ar: "مرسيدس C-Class", en: "Mercedes-Benz C-Class" },
    ],
    partNumber: "BREM-CER-FRONT",
    warranty: { ar: "2 سنة", en: "2 years" },
    description: {
      ar: "أقراص مكابح سيراميك عالية الأداء",
      en: "High performance ceramic brake discs",
    },
  },
  {
    id: "5",
    group: 'electrical',
    name: { ar: "مصابيح LED فيليبس للمقدمة", en: "Philips LED Headlights" },
    brand: { ar: "فيليبس", en: "Philips" },
    category: { ar: "إضاءة", en: "Lighting" },
    subCategory: { ar: "مصابيح أمامية", en: "Front Lights" },
    price: 95,
    originalPrice: 130,
    rating: 4.4,
    reviewCount: 203,
    image: "https://images.unsplash.com/photo-1580547333940-aab5ee2b0b8b?w=400",
    inStock: true,
    isNew: true,
    isOnSale: true,
    compatibility: [{ ar: "معظم السيارات الحديثة", en: "Most modern cars" }],
    partNumber: "PHIL-LED-H7",
    warranty: { ar: "3 سنوات", en: "3 years" },
    description: {
      ar: "مصابيح LED عالية السطوع وطويلة العمر",
      en: "High brightness and long-lasting LED headlights",
    },
  },
  {
    id: "6",
    group: 'engines',
    name: {
      ar: "زيت محرك موبيل 1 الاصطناعي",
      en: "Mobil 1 Synthetic Engine Oil",
    },
    brand: { ar: "موبيل", en: "Mobil" },
    category: { ar: "زيوت ومواد تشحيم", en: "Oils & Lubricants" },
    subCategory: { ar: "زيوت المحرك", en: "Engine Oil" },
    price: 65,
    originalPrice: 85,
    rating: 4.6,
    reviewCount: 445,
    image: "https://images.unsplash.com/photo-1571974599782-87624638275b?w=400",
    inStock: true,
    isNew: false,
    isOnSale: true,
    compatibility: [
      { ar: "جميع محركات البنزين الحديثة", en: "All modern gasoline engines" },
    ],
    partNumber: "MOB-SYN-5W30",
    warranty: { ar: "حسب الاستخدام", en: "As per usage" },
    description: {
      ar: "زيت محرك اصطناعي عالي الجودة",
      en: "High quality synthetic engine oil",
    },
  },
  // Added: Wooden Door
  {
    id: "wd-1",
    group: 'tools',
    name: { ar: "باب خشب", en: "Wooden Door" },
    brand: { ar: "عام", en: "Generic" },
    category: { ar: "أبواب", en: "Doors" },
    subCategory: { ar: "باب خشبي", en: "Wood Door" },
    price: 950,
    originalPrice: 1100,
    rating: 4.6,
    reviewCount: 87,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400",
    inStock: true,
    isNew: true,
    isOnSale: true,
    compatibility: [
      { ar: "مقاس قياسي", en: "Standard size" },
    ],
    partNumber: "WD-STD-90x210",
    warranty: { ar: "سنة", en: "1 year" },
    description: {
      ar: "باب خشب طبيعي بتشطيب عالي وجودة ممتازة للاستخدام الداخلي.",
      en: "Natural wood door with premium finish for interior use.",
    },
  },
  // Added: Mesh Window
  {
    id: "mw-1",
    group: 'tools',
    name: { ar: "شباك سلك", en: "Mesh Window" },
    brand: { ar: "عام", en: "Generic" },
    category: { ar: "نوافذ", en: "Windows" },
    subCategory: { ar: "شباك سلك", en: "Mesh Window" },
    price: 350,
    originalPrice: 420,
    rating: 4.4,
    reviewCount: 54,
    image: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=400",
    inStock: true,
    isNew: false,
    isOnSale: true,
    compatibility: [
      { ar: "مقاوم للحشرات", en: "Insect resistant" },
    ],
    partNumber: "MW-80x120",
    warranty: { ar: "6 أشهر", en: "6 months" },
    description: {
      ar: "شباك سلك متين يسمح بالتهوية ويمنع دخول الحشرات.",
      en: "Durable mesh window allowing airflow and blocking insects.",
    },
  },
  // Added: Aluminum Window
  {
    id: "aw-1",
    group: 'tools',
    name: { ar: "شباك الوميتال", en: "Aluminum Window" },
    brand: { ar: "الوميتال", en: "Alumetal" },
    category: { ar: "نوافذ", en: "Windows" },
    subCategory: { ar: "شباك الوميتال", en: "Aluminum Window" },
    price: 650,
    originalPrice: 650,
    rating: 4.7,
    reviewCount: 133,
    image: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=400",
    inStock: true,
    isNew: true,
    isOnSale: false,
    compatibility: [
      { ar: "مقاوم للصدأ", en: "Rust resistant" },
    ],
    partNumber: "AW-100x120",
    warranty: { ar: "سنتان", en: "2 years" },
    description: {
      ar: "شباك الوميتال قوي وخفيف مع عزل جيد.",
      en: "Strong, lightweight aluminum window with good insulation.",
    },
  },
];

const categories = [
  { id: "filters", name: { ar: "فلاتر", en: "Filters" }, count: 45 },
  { id: "tires", name: { ar: "إطارات", en: "Tires" }, count: 28 },
  { id: "batteries", name: { ar: "بطاريات", en: "Batteries" }, count: 15 },
  { id: "brakes", name: { ar: "مكابح", en: "Brakes" }, count: 32 },
  { id: "lighting", name: { ar: "إضاءة", en: "Lighting" }, count: 67 },
  {
    id: "oils",
    name: { ar: "زيوت ومواد تشحيم", en: "Oils & Lubricants" },
    count: 23,
  },
];

const brands = [
  { ar: "تويوتا", en: "Toyota" },
  { ar: "هوندا", en: "Honda" },
  { ar: "نيسان", en: "Nissan" },
  { ar: "فورد", en: "Ford" },
  { ar: "شيفروليه", en: "Chevrolet" },
  { ar: "ميشيلين", en: "Michelin" },
  { ar: "بريجستون", en: "Bridgestone" },
  { ar: "بوش", en: "Bosch" },
  { ar: "AC Delco", en: "AC Delco" },
  { ar: "موبيل", en: "Mobil" },
  { ar: "كاسترول", en: "Castrol" },
  { ar: "فيليبس", en: "Philips" },
  { ar: "بريمبو", en: "Brembo" },
];

interface ProductListingProps {
  setCurrentPage: (page: string) => void;
  setSelectedProduct: (product: any) => void;
  isInWishlist?: (id: string) => boolean;
}

export default function ProductListing({
  setCurrentPage,
  setSelectedProduct,
  isInWishlist,
  ...rest
}: ProductListingProps & Partial<RouteContext>) {
  const { t, locale } = useTranslation();
  const currency = locale === "ar" ? "ر.س" : "SAR";
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState(rest?.searchFilters?.term || "");
  const [selectedGroup, setSelectedGroup] = useState<string>(rest?.searchFilters?.partCategory || '');
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [openBrands, setOpenBrands] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [openFlags, setOpenFlags] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const isVendor = !!(rest as any)?.user && (rest as any)?.user?.role === 'vendor';
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Load vendor-added products from localStorage and merge with defaults
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const raw = window.localStorage.getItem('user_products');
      if (!raw) return;
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) {
        setProducts([...list, ...mockProducts]);
      }
    } catch {}
  }, []);

  // Apply incoming normalized group from homepage (engines | tires | electrical | tools)
  useEffect(() => {
    if (rest?.searchFilters) {
      const { partCategory } = rest.searchFilters;
      if (partCategory) {
        setSelectedGroup(partCategory);
        // Reset localized category filter when group is set to avoid conflicts
        setSelectedCategory("");
      }
    }
  }, [rest?.searchFilters]);

  useEffect(() => {
    let filtered = products;

    // Search filter (case-insensitive)
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name[locale]?.toLowerCase().includes(q) ||
          product.brand[locale]?.toLowerCase().includes(q) ||
          product.category[locale]?.toLowerCase().includes(q)
      );
    }

    // Group filter from homepage (keep newly added building items always visible)
    if (selectedGroup) {
      const alwaysInclude = new Set(["wd-1", "mw-1", "aw-1"]);
      filtered = filtered.filter((product) => product.group === selectedGroup || alwaysInclude.has(product.id));
    }

    // Localized Category filter (UI-side within listing page)
    if (!selectedGroup && selectedCategory) {
      filtered = filtered.filter(
        (product) => product.category[locale] === selectedCategory
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand[locale])
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Sale filter
    if (onSaleOnly) {
      filtered = filtered.filter((product) => product.isOnSale);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredProducts(filtered);
  }, [
    searchTerm,
    selectedGroup,
    selectedCategory,
    selectedBrands,
    priceRange,
    sortBy,
    inStockOnly,
    onSaleOnly,
    products,
    locale,
  ]);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setCurrentPage("product-details");
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={() => { if (!isVendor) handleProductClick(product); }}
    >
      <CardContent className="p-4">
        <div className="relative mb-4">
          <ImageWithFallback
            src={product.image}
            alt={product.name[locale]}
            className="w-full h-48 object-cover rounded-lg"
          />
          {product.isNew && (
            <Badge className="absolute top-2 right-2 bg-green-500">
              {t("new")}
            </Badge>
          )}
          {product.isOnSale && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              {t("sale")}
            </Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium">{t("outOfStock")}</span>
            </div>
          )}
          <div className="absolute bottom-2 right-2 opacity-100 transition-opacity flex gap-2">
            {!isVendor && (
              <Button
                variant="ghost"
                size="icon"
                className={`h-9 w-9 p-0 bg-white/95 border border-gray-200 shadow-sm hover:bg-white ring-1 ring-black/5 ${isInWishlist && isInWishlist(product.id) ? 'text-red-500 border-red-200 ring-red-200' : 'text-gray-700'}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (isInWishlist && !isInWishlist(product.id)) {
                    // Add to wishlist
                    rest.addToWishlist && rest.addToWishlist({
                      id: product.id,
                      name: product.name[locale],
                      price: product.price,
                      brand: product.brand[locale],
                      originalPrice: product.originalPrice,
                      image: product.image,
                      inStock: product.inStock
                    });
                    
                    Swal.fire({
                      title: locale === 'en' ? 'Added to wishlist' : 'تمت الإضافة إلى المفضلة',
                      icon: 'success',
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 3000
                    });
                  } else if (isInWishlist && isInWishlist(product.id)) {
                    // Remove from wishlist
                    rest.removeFromWishlist && rest.removeFromWishlist(product.id);
                    
                    Swal.fire({
                      title: locale === 'en' ? 'Removed from wishlist' : 'تمت الإزالة من المفضلة',
                      icon: 'info',
                      toast: true,
                      position: 'top-end',
                      showConfirmButton: false,
                      timer: 3000
                    });
                  }
                }}
              >
                <Heart className={`h-5 w-5 ${isInWishlist && isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>
            )}
            {isVendor && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 p-0 bg-white/95 border border-gray-200 shadow-sm hover:bg-white ring-1 ring-black/5 text-gray-700"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingProduct(product); }}
                  title={locale==='ar'?'تعديل':'Edit'}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 p-0 bg-white/95 border border-gray-200 shadow-sm hover:bg-white ring-1 ring-black/5 text-red-600"
                  onClick={async (e) => { 
                    e.preventDefault(); e.stopPropagation();
                    const ok = await confirmDialog(locale==='ar'? 'هل تريد حذف هذا المنتج؟':'Delete this product?', locale==='ar'?'حذف':'Delete', locale==='ar'?'إلغاء':'Cancel', locale==='ar');
                    if (!ok) return;
                    setProducts(prev => prev.filter((p:any)=> p.id !== product.id));
                    try {
                      const raw = window.localStorage.getItem('user_products');
                      const list = raw ? JSON.parse(raw) : [];
                      const filtered = Array.isArray(list) ? list.filter((x:any)=> x.id !== product.id) : [];
                      window.localStorage.setItem('user_products', JSON.stringify(filtered));
                    } catch {}
                  }}
                  title={locale==='ar'?'حذف':'Delete'}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium text-sm line-clamp-2">
            {product.name[locale]}
          </h3>
          <p className="text-sm text-muted-foreground">
            {product.brand[locale]}
          </p>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground mr-1">
              ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-primary">
                {product.price} {currency}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice} {currency}
                </span>
              )}
            </div>
            {!isVendor && (
              <Button
                size="sm"
                className="h-8"
                disabled={!product.inStock}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!product.inStock) return;
                  rest.addToCart && rest.addToCart({
                    id: product.id,
                    name: product.name[locale],
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                    inStock: product.inStock,
                  });
                  Swal.fire({
                    title: locale === 'en' ? 'Added to cart' : 'تمت الإضافة إلى السلة',
                    icon: 'success',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                  });
                }}
              >
                <ShoppingCart className="h-3 w-3 ml-1" />
                {t("add")}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: any }) => (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => { if (!isVendor) handleProductClick(product); }}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative">
            <ImageWithFallback
              src={product.image}
              alt={product.name[locale]}
              className="w-24 h-24 object-cover rounded-lg"
            />
            {product.isNew && (
              <Badge className="absolute -top-1 -right-1 bg-green-500 text-xs">
                {t("new")}
              </Badge>
            )}
            {product.isOnSale && (
              <Badge className="absolute -top-1 -left-1 bg-red-500 text-xs">
                {t("sale")}
              </Badge>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{product.name[locale]}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.brand[locale]} | {product.category[locale]}
                </p>
                <p className="text-xs text-muted-foreground">
                  رقم القطعة: {product.partNumber}
                </p>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-primary">
                    {product.price} {currency}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {product.originalPrice} {currency}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 justify-end">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground mr-1">
                    ({product.reviewCount})
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    product.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.inStock ? t("inStock") : t("outOfStock")}
                </span>
                <span className="mr-2 text-muted-foreground">
                  {t("warranty")}: {product.warranty[locale]}
                </span>
              </div>
              {!isVendor && (
                <Button size="sm" disabled={!product.inStock}>
                  <ShoppingCart className="h-4 w-4 ml-1" />
                  {t("addToCart")}
                </Button>
              )}
              {isVendor && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={(e)=> { e.preventDefault(); e.stopPropagation(); setEditingProduct(product); }}>
                    <Pencil className="h-4 w-4 ml-1" /> {locale==='ar'?'تعديل':'Edit'}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={async (e)=> { e.preventDefault(); e.stopPropagation(); const ok = await confirmDialog(locale==='ar'? 'هل تريد حذف هذا المنتج؟':'Delete this product?', locale==='ar'?'حذف':'Delete', locale==='ar'?'إلغاء':'Cancel', locale==='ar'); if (!ok) return; setProducts(prev=> prev.filter((p:any)=> p.id !== product.id)); try { const raw = window.localStorage.getItem('user_products'); const list = raw ? JSON.parse(raw) : []; const filtered = Array.isArray(list) ? list.filter((x:any)=> x.id !== product.id) : []; window.localStorage.setItem('user_products', JSON.stringify(filtered)); } catch {} }}>
                    <Trash2 className="h-4 w-4 ml-1" /> {locale==='ar'?'حذف':'Delete'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="products" setCurrentPage={setCurrentPage} {...(rest as any)} />

      <div className="container mx-auto px-4 py-6">
        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-gray-300 text-gray-900 bg-white hover:bg-gray-100"
            >
              <Filter className="h-4 w-4 ml-2" />
              {t("filter")}
            </Button>
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("sortBy")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">{t("relevance")}</SelectItem>
                <SelectItem value="price-low">{t("priceLow")}</SelectItem>
                <SelectItem value="price-high">{t("priceHigh")}</SelectItem>
                <SelectItem value="rating">{t("highestRating")}</SelectItem>
                <SelectItem value="newest">{t("newest")}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
            {isVendor && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 ml-2" /> {locale==='ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                  </Button>
                </DialogTrigger>
                <ProductForm
                  onSave={(data: any) => {
                    const newProduct = {
                      id: data?.id || `v-${Date.now()}`,
                      group: 'tools',
                      name: { ar: data?.nameAr || '', en: data?.nameEn || '' },
                      brand: { ar: 'عام', en: 'Generic' },
                      category: { ar: data?.category || 'أبواب', en: data?.category === 'نوافذ' ? 'Windows' : 'Doors' },
                      subCategory: { ar: data?.subCategory?.ar || data?.subCategoryAr || '', en: data?.subCategory?.en || data?.subCategoryEn || '' },
                      price: Number(data?.price || 0),
                      originalPrice: Number(data?.originalPrice || data?.price || 0),
                      rating: 0,
                      reviewCount: 0,
                      image: data?.image || (Array.isArray(data?.images) && data.images[0]) || '',
                      images: Array.isArray(data?.images) ? data.images : [],
                      inStock: Boolean(data?.inStock ?? (Number(data?.stock || 0) > 0)),
                      isNew: !!data?.isNew,
                      isOnSale: !!data?.isOnSale,
                      compatibility: Array.isArray(data?.compatibility) ? data.compatibility.map((c:any)=> ({ ar: c, en: c })) : [],
                      partNumber: data?.partNumber || '',
                      warranty: { ar: 'سنة', en: '1 year' },
                      description: { ar: data?.descriptionAr || '', en: data?.descriptionEn || '' },
                    } as any;
                    try {
                      const raw = window.localStorage.getItem('user_products');
                      const list = raw ? JSON.parse(raw) : [];
                      window.localStorage.setItem('user_products', JSON.stringify([newProduct, ...list]));
                    } catch {}
                    setProducts((prev) => [newProduct, ...prev]);
                    setIsAddDialogOpen(false);
                  }}
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </Dialog>
            )}
          </div>

          </div>

          {/* Vendor Edit Dialog */}
          {isVendor && (
            <Dialog open={!!editingProduct} onOpenChange={(open) => { if (!open) setEditingProduct(null); }}>
              {editingProduct && (
                <ProductForm
                  product={{
                    id: editingProduct.id,
                    nameAr: editingProduct?.name?.ar || '',
                    nameEn: editingProduct?.name?.en || '',
                    category: editingProduct?.category?.ar || 'أبواب',
                    subCategoryAr: editingProduct?.subCategory?.ar || '',
                    subCategoryEn: editingProduct?.subCategory?.en || '',
                    price: editingProduct?.price,
                    originalPrice: editingProduct?.originalPrice,
                    stock: (editingProduct as any)?.stock ?? (editingProduct?.inStock ? 10 : 0),
                    inStock: editingProduct?.inStock,
                    partNumber: editingProduct?.partNumber || '',
                    descriptionAr: editingProduct?.description?.ar || '',
                    descriptionEn: editingProduct?.description?.en || '',
                    image: editingProduct?.image || '',
                    images: (editingProduct as any)?.images || (editingProduct?.image ? [editingProduct.image] : []),
                    isNew: editingProduct?.isNew || false,
                    isOnSale: editingProduct?.isOnSale || false,
                    isActive: (editingProduct as any)?.status === 'active',
                  }}
                  onSave={(data: any) => {
                    const updated = {
                      id: data?.id || editingProduct.id,
                      group: editingProduct.group || 'tools',
                      name: { ar: data?.nameAr || '', en: data?.nameEn || '' },
                      brand: { ar: 'عام', en: 'Generic' },
                      category: { ar: data?.category || 'أبواب', en: data?.category === 'نوافذ' ? 'Windows' : 'Doors' },
                      subCategory: { ar: data?.subCategory?.ar || data?.subCategoryAr || '', en: data?.subCategory?.en || data?.subCategoryEn || '' },
                      price: Number(data?.price || 0),
                      originalPrice: Number(data?.originalPrice || data?.price || 0),
                      rating: editingProduct?.rating ?? 0,
                      reviewCount: editingProduct?.reviewCount ?? 0,
                      image: data?.image || (Array.isArray(data?.images) && data.images[0]) || '',
                      images: Array.isArray(data?.images) ? data.images : [],
                      inStock: Boolean(data?.inStock ?? (Number(data?.stock || 0) > 0)),
                      isNew: !!data?.isNew,
                      isOnSale: !!data?.isOnSale,
                      compatibility: Array.isArray(data?.compatibility) ? data.compatibility.map((c:any)=> ({ ar: c, en: c })) : [],
                      partNumber: data?.partNumber || '',
                      warranty: editingProduct?.warranty || { ar: 'سنة', en: '1 year' },
                      description: { ar: data?.descriptionAr || '', en: data?.descriptionEn || '' },
                    } as any;
                    setProducts((prev) => prev.map((p:any) => p.id === updated.id ? updated : p));
                    try {
                      const raw = window.localStorage.getItem('user_products');
                      const list = raw ? JSON.parse(raw) : [];
                      const exists = Array.isArray(list) && list.some((x:any) => x.id === updated.id);
                      const newList = exists ? list.map((x:any) => x.id === updated.id ? updated : x) : [updated, ...list];
                      window.localStorage.setItem('user_products', JSON.stringify(newList));
                    } catch {}
                    setEditingProduct(null);
                  }}
                  onCancel={() => setEditingProduct(null)}
                />
              )}
            </Dialog>
          )}

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            <div
              className={`lg:block ${showFilters ? "block" : "hidden"} lg:w-52 w-full lg:relative lg:sticky lg:top-24 absolute lg:bg-transparent bg-background lg:shadow-none shadow-lg lg:z-auto z-10 lg:p-0 p-2 lg:rounded-none rounded-lg`}
            >
              <Card className="p-3 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t("categories")}</h3>
                    <button
                      type="button"
                      onClick={() => setOpenCategories(!openCategories)}
                      className="p-1 rounded hover:bg-muted"
                      aria-label="toggle-categories"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${openCategories ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {openCategories && (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    <div
                      className={`cursor-pointer p-1.5 rounded-md text-sm ${selectedCategory === "" ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                      onClick={() => setSelectedCategory("")}
                    >
                      {t("allCategories")}
                    </div>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`cursor-pointer p-1.5 rounded-md text-sm ${selectedCategory === category.name[locale] ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}
                        onClick={() => setSelectedCategory(category.name[locale])}
                      >
                        {category.name[locale]}
                      </div>
                    ))}
                  </div>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t("brands")}</h3>
                    <button
                      type="button"
                      onClick={() => setOpenBrands(!openBrands)}
                      className="p-1 rounded hover:bg-muted"
                      aria-label="toggle-brands"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${openBrands ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {openBrands && (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto">
                    {(showAllBrands ? brands : brands.slice(0, 6)).map((brand) => (
                      <div key={brand.ar} className="flex items-center space-x-2 space-x-reverse">
                        <Checkbox
                          id={brand.ar}
                          checked={selectedBrands.includes(brand.ar)}
                          onCheckedChange={(checked) => handleBrandChange(brand.ar, checked as boolean)}
                        />
                        <label htmlFor={brand.ar} className="text-sm cursor-pointer">
                          {brand[locale]}
                        </label>
                      </div>
                    ))}
                    {brands.length > 6 && (
                      <button
                        type="button"
                        className="mt-1 text-xs text-primary hover:underline"
                        onClick={() => setShowAllBrands(!showAllBrands)}
                      >
                        {showAllBrands ? t("showLess") : t("showMore")}
                      </button>
                    )}
                  </div>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t("priceRange")}</h3>
                    <button
                      type="button"
                      onClick={() => setOpenPrice(!openPrice)}
                      className="p-1 rounded hover:bg-muted"
                      aria-label="toggle-price"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${openPrice ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {openPrice && (
                  <div className="space-y-3">
                    <Slider value={priceRange} onValueChange={setPriceRange} max={1000} step={10} className="w-full" />
                    <div className="flex justify-between text-sm">
                      <span>{priceRange[0]} {currency}</span>
                      <span>{priceRange[1]} {currency}</span>
                    </div>
                  </div>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">{t("filter")}</h3>
                    <button
                      type="button"
                      onClick={() => setOpenFlags(!openFlags)}
                      className="p-1 rounded hover:bg-muted"
                      aria-label="toggle-flags"
                    >
                      <ChevronDown className={`h-4 w-4 transition-transform ${openFlags ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                  {openFlags && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox id="inStock" checked={inStockOnly} onCheckedChange={(checked) => setInStockOnly(checked === true)} />
                      <label htmlFor="inStock" className="text-sm cursor-pointer">{t("inStockOnly")}</label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Checkbox id="onSale" checked={onSaleOnly} onCheckedChange={(checked) => setOnSaleOnly(checked === true)} />
                      <label htmlFor="onSale" className="text-sm cursor-pointer">{t("offersOnly")}</label>
                    </div>
                  </div>
                  )}
                </div>
              </Card>
            </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div
              className="flex justify-between items-center mb-4"
              dir={locale === "ar" ? "rtl" : "ltr"}
            >
              <h2 className="text-lg font-medium">
                {t("products")} ({filteredProducts.length} {t("productsCount")})
              </h2>
            </div>

            {filteredProducts.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">{t("noProductsFound")}</h3>
                <p className="text-muted-foreground">
                  {t("tryAdjustingFilters")}
                </p>
              </Card>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-4"
                }
              >
                {filteredProducts.map((product) =>
                  viewMode === "grid" ? (
                    <ProductCard key={product.id} product={product} />
                  ) : (
                    <ProductListItem key={product.id} product={product} />
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}
