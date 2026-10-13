import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

// Cart lives entirely client-side (context + localStorage). Items are keyed
// by productId+size so the same product in different sizes are separate lines.
const CartContext = createContext(null);
const STORAGE_KEY = "athr.cart";

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const lineKey = (productId, size) => `${productId}::${size}`;

function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const key = lineKey(action.item.productId, action.item.size);
      const existing = state.find((l) => lineKey(l.productId, l.size) === key);
      if (existing) {
        return state.map((l) =>
          lineKey(l.productId, l.size) === key
            ? { ...l, qty: Math.min(99, l.qty + action.item.qty) }
            : l,
        );
      }
      return [...state, action.item];
    }
    case "SET_QTY": {
      const key = lineKey(action.productId, action.size);
      if (action.qty <= 0) {
        return state.filter((l) => lineKey(l.productId, l.size) !== key);
      }
      return state.map((l) =>
        lineKey(l.productId, l.size) === key
          ? { ...l, qty: Math.min(99, action.qty) }
          : l,
      );
    }
    case "REMOVE": {
      const key = lineKey(action.productId, action.size);
      return state.filter((l) => lineKey(l.productId, l.size) !== key);
    }
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const count = items.reduce((n, l) => n + l.qty, 0);
    const subtotal = items.reduce((n, l) => n + l.priceEGP * l.qty, 0);
    return {
      items,
      count,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (item) => dispatch({ type: "ADD", item }),
      setQty: (productId, size, qty) =>
        dispatch({ type: "SET_QTY", productId, size, qty }),
      removeItem: (productId, size) =>
        dispatch({ type: "REMOVE", productId, size }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [items, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
