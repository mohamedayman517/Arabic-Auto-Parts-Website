import { Home, Package, ShoppingCart, User, Truck, FileText, HelpCircle, Store, BarChart3, Settings, Users, TrendingUp, Target, Shield, Tag, Globe, Percent, Phone } from 'lucide-react';

// Define RouteConfig interface
interface RouteConfig {
  component: React.ComponentType<any>;
  title: string;
  icon: React.ComponentType<any>;
  requiresAuth?: boolean;
  allowedRoles?: string[];
}

// Import page components
import Homepage from '../pages/Homepage';
import ProductListing from '../pages/ProductListing';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import UserProfile from '../pages/UserProfile';
import TrackOrder from '../pages/TrackOrder';
import MyOrders from '../pages/MyOrders';
import About from '../pages/About';
import FAQ from '../pages/FAQ';
import Projects from '../pages/Projects';
import ProjectsBuilder from '../pages/ProjectsBuilder';
import ProjectDetails from '../pages/ProjectDetails';
import Support from '../pages/Support';
import Checkout from '../pages/Checkout';
import Offers from '../pages/Offers';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';

// Import vendor dashboard components
import VendorDashboard from '../pages/vendor/VendorDashboard';
import VendorProducts from '../pages/vendor/VendorProducts';
import VendorOrders from '../pages/vendor/VendorOrders';
import VendorAnalytics from '../pages/vendor/VendorAnalytics';
import VendorSettings from '../pages/vendor/VendorSettings';

// Import marketer dashboard components
import MarketerDashboard from '../pages/marketer/MarketerDashboard';

// Import admin dashboard components
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminVendors from '../pages/admin/AdminVendors';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminReports from '../pages/admin/AdminReports';
import AdminSettings from '../pages/admin/AdminSettings';

export const routes: Record<string, RouteConfig> = {
  // Public routes
  home: { component: Homepage, title: 'الرئيسية', icon: Home },
  products: { component: ProductListing, title: 'المنتجات', icon: Package },
  'product-details': { component: ProductDetails, title: 'تفاصيل المنتج', icon: Package },
  cart: { component: Cart, title: 'السلة', icon: ShoppingCart },
  checkout: { component: Checkout, title: 'إتمام الطلب', icon: ShoppingCart },
  login: { component: Login, title: 'تسجيل الدخول', icon: User },
  register: { component: Register, title: 'إنشاء حساب', icon: User },
  'forgot-password': { component: ForgotPassword, title: 'إعادة تعيين كلمة المرور', icon: User },
  offers: { component: Offers, title: 'العروض والخصومات', icon: Percent },
  about: { component: About, title: 'من نحن', icon: Globe },
  faq: { component: FAQ, title: 'الأسئلة الشائعة', icon: HelpCircle },
  projects: { component: Projects, title: 'المشاريع', icon: Tag },
  'projects-builder': { component: ProjectsBuilder, title: 'إضافة مشروع', icon: Tag },
  'project-details': { component: ProjectDetails, title: 'تفاصيل المشروع', icon: Tag },
  support: { component: Support, title: 'الدعم الفني', icon: Phone },

  // User routes (require authentication)
  profile: { component: UserProfile, title: 'الملف الشخصي', icon: User, requiresAuth: true },
  'track-order': { component: TrackOrder, title: 'تتبع الطلب', icon: Truck, requiresAuth: true },
  'my-orders': { component: MyOrders, title: 'طلباتي', icon: FileText, requiresAuth: true },

  // Vendor routes (require vendor role)
  'vendor-dashboard': { component: VendorDashboard, title: 'لوحة التحكم', icon: BarChart3, requiresAuth: true, allowedRoles: ['vendor'] },
  'vendor-products': { component: VendorProducts, title: 'منتجاتي', icon: Package, requiresAuth: true, allowedRoles: ['vendor'] },
  'vendor-orders': { component: VendorOrders, title: 'الطلبات', icon: FileText, requiresAuth: true, allowedRoles: ['vendor'] },
  'vendor-analytics': { component: VendorAnalytics, title: 'التحليلات', icon: TrendingUp, requiresAuth: true, allowedRoles: ['vendor'] },
  'vendor-settings': { component: VendorSettings, title: 'الإعدادات', icon: Settings, requiresAuth: true, allowedRoles: ['vendor'] },

  // Marketer routes (require marketer role)
  'marketer-dashboard': { component: MarketerDashboard, title: 'لوحة التحكم التسويقية', icon: Target, requiresAuth: true, allowedRoles: ['marketer'] },

  // Admin routes (require admin role)
  'admin-dashboard': { component: AdminDashboard, title: 'لوحة التحكم الإدارية', icon: Shield, requiresAuth: true, allowedRoles: ['admin'] },
  'admin-users': { component: AdminUsers, title: 'إدارة المستخدمين', icon: Users, requiresAuth: true, allowedRoles: ['admin'] },
  'admin-vendors': { component: AdminVendors, title: 'إدارة المتاجر', icon: Store, requiresAuth: true, allowedRoles: ['admin'] },
  'admin-products': { component: AdminProducts, title: 'إدارة المنتجات', icon: Package, requiresAuth: true, allowedRoles: ['admin'] },
  'admin-reports': { component: AdminReports, title: 'Reports & Analytics', icon: BarChart3, requiresAuth: true, allowedRoles: ['admin'] },
  'admin-settings': { component: AdminSettings, title: 'System Settings', icon: Settings, requiresAuth: true, allowedRoles: ['admin'] },
};