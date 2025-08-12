"use client";

import { useState, useEffect } from "react";
import { routes } from "./routes";
import Homepage from "../pages/Homepage";
import { useTranslation } from "../hooks/useTranslation";

export type UserRole = "customer" | "vendor" | "marketer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
}

// Shared cart item type for front-only testing
export type CartItem = {
  id: string;
  name: string;
  price: number;
  brand?: string;
  originalPrice?: number;
  image?: string;
  partNumber?: string;
  quantity: number;
  inStock?: boolean;
  maxQuantity?: number;
};

// Wishlist item type for front-only testing
export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  brand?: string;
  originalPrice?: number;
  image?: string;
  partNumber?: string;
  inStock?: boolean;
};

export interface RouteContext {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  // Simple back navigation support
  prevPage: string | null;
  goBack: () => void;
  selectedProduct?: any;
  setSelectedProduct: (product: any) => void;
  searchFilters: SearchFilters | null;
  setSearchFilters: (filters: SearchFilters | null) => void;
  returnTo: string | null;
  setReturnTo: (page: string | null) => void;
  // Cart state/actions
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  // Wishlist state/actions
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

export interface SearchFilters {
  term: string;
  carType?: string;
  model?: string;
  partCategory?: string; // engine | tires | electrical | tools
}

export default function Router() {
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        return url.searchParams.get("page") || "home";
      } catch {
        return "home";
      }
    }
    return "home";
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem('mock_current_user');
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.id && parsed.name && parsed.email && parsed.role) {
        const cleanName = typeof parsed.name === 'string' ? parsed.name.replace(/\s*User$/i, '').trim() : parsed.name;
        return { ...parsed, name: cleanName } as User;
      }
    } catch {}
    return null;
  });
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(
    null
  );
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [returnTo, setReturnTo] = useState<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "فلتر زيت محرك تويوتا كامري",
      price: 85,
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=200",
      partNumber: "TOY-OF-2015",
      quantity: 2,
      inStock: true,
      maxQuantity: 10,
    },
    {
      id: "2",
      name: "إطار ميشلين بريمير 225/65R17",
      price: 450,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200",
      partNumber: "MICH-PREM-225",
      quantity: 1,
      inStock: true,
      maxQuantity: 8,
    },
  ]);
  
  // Initialize wishlist state
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx !== -1) {
        const copy = [...prev];
        const maxQ = item.maxQuantity ?? 99;
        copy[idx] = {
          ...copy[idx],
          quantity: Math.min(maxQ, copy[idx].quantity + item.quantity),
        };
        return copy;
      }
      return [...prev, item];
    });
  };

  const updateCartQty = (id: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: Math.max(1, qty) } : p))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCartItems([]);

  // Wishlist functions
  const addToWishlist = (item: WishlistItem) => {
    setWishlistItems((prev) => {
      // Check if item already exists in wishlist
      if (prev.some((p) => p.id === item.id)) {
        return prev; // Item already exists, don't add it again
      }
      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((p) => p.id !== id));
  };

  const isInWishlist = (id: string) => {
    return wishlistItems.some((item) => item.id === id);
  };

  // Navigation wrapper: track previous page then navigate
  const navigate = (page: string) => {
    setPrevPage((prev) => {
      const p = currentPage || prev || 'home';
      try { if (typeof window !== 'undefined') localStorage.setItem('mock_prev_page', p); } catch {}
      return p;
    });
    setCurrentPage(page);
  };

  const context: RouteContext = {
    currentPage,
    setCurrentPage: navigate,
    user,
    setUser,
    prevPage,
    goBack: () => {
      if (prevPage) {
        setCurrentPage(prevPage);
      } else {
        setCurrentPage('home');
      }
    },
    selectedProduct,
    setSelectedProduct,
    searchFilters,
    setSearchFilters,
    returnTo,
    setReturnTo,
    cartItems,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  };

  const currentRoute = routes[currentPage as keyof typeof routes];
  const CurrentPageComponent = currentRoute?.component || Homepage;

  const { locale } = useTranslation();
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Scroll to top on page change (ensure start at top, not footer)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if ("scrollRestoration" in window.history) {
          window.history.scrollRestoration = "manual" as any;
        }
      } catch {}

      // Scroll instantly to top now and on next tick to avoid layout race
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 0);
    }
  }, [currentPage]);

  // Initialize prevPage from localStorage
  useEffect(() => {
    try {
      const prev = localStorage.getItem('mock_prev_page');
      if (prev) setPrevPage(prev);
    } catch {}
  }, []);

  // Mark as mounted to avoid SSR/CSR mismatch on URL-dependent initial state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Restore session from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("mock_current_user");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.id && parsed.name && parsed.email && parsed.role) {
          const cleanName = typeof parsed.name === 'string' ? parsed.name.replace(/\s*User$/i, '').trim() : parsed.name;
          setUser({ ...parsed, name: cleanName } as User);
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist session when user changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (user) {
        localStorage.setItem("mock_current_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("mock_current_user");
      }
    } catch {
      // ignore
    }
  }, [user]);

  // Keep current page in URL (?page=...) so it persists across locale switches
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const url = new URL(window.location.href);
        if (currentPage) {
          url.searchParams.set("page", currentPage);
        } else {
          url.searchParams.delete("page");
        }
        window.history.replaceState({}, "", url.toString());
      } catch {
        // no-op
      }
    }
  }, [currentPage]);

  // Auth/role guard: enforce access to protected routes
  useEffect(() => {
    const route = routes[currentPage as keyof typeof routes];
    if (!route) return;
    const needsAuth = !!route.requiresAuth;
    const allowed = (route.allowedRoles as any) as (UserRole[] | undefined);

    if (needsAuth && !user) {
      // Save intended page and redirect to login
      setReturnTo(currentPage);
      setCurrentPage("login");
      return;
    }
    if (needsAuth && user && allowed && allowed.length > 0) {
      if (!allowed.includes(user.role)) {
        // Not allowed; send to home
        setCurrentPage("home");
      }
    }
  }, [currentPage, user]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background" dir={dir} suppressHydrationWarning>
      <CurrentPageComponent {...context} />
    </div>
  );
}

export { routes };
