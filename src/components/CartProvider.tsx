"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProductById, type Product } from "@/lib/products";

export type CartItem = {
  productId: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readStored() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("synhairbyg-cart");
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Hydrate the cart from localStorage only on the client (SSR-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readStored());
  }, []);

  useEffect(() => {
    window.localStorage.setItem("synhairbyg-cart", JSON.stringify(items));
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + qty } : i,
        );
      }
      return [...prev, { productId: product.id, qty }];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.productId !== productId)
        : prev.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    let count = 0;
    let subtotal = 0;
    for (const item of items) {
      const product = getProductById(item.productId);
      if (!product) continue;
      count += item.qty;
      subtotal += product.price * item.qty;
    }
    return { count, subtotal };
  }, [items]);

  // Delivery is chosen at checkout (PAXI), so we don't guess a fee here.
  const shipping = 0;
  const total = subtotal + shipping;

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    shipping,
    total,
    isOpen,
    openCart,
    closeCart,
    addItem,
    updateQty,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}