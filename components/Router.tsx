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

export interface RouteContext {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  user: User | null;
  setUser: (user: User | null) => void;
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
  const [user, setUser] = useState<User | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(
    null
  );
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

  const context: RouteContext = {
    currentPage,
    setCurrentPage,
    user,
    setUser,
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
  };

  const currentRoute = routes[currentPage as keyof typeof routes];
  const CurrentPageComponent = currentRoute?.component || Homepage;

  const { locale } = useTranslation();
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Scroll to top on page change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage]);

  // Mark as mounted to avoid SSR/CSR mismatch on URL-dependent initial state
  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background" dir={dir} suppressHydrationWarning>
      <CurrentPageComponent {...context} />
    </div>
  );
}

export { routes };
