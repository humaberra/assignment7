import { create } from "zustand";
const STORAGE_KEY = "cart-items";

// Safely read the saved cart: missing, invalid JSON or wrong shape -> empty cart.
function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "number" &&
        typeof item.title === "string" &&
        typeof item.price === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0
    );
  } catch {
    return [];
  }
}

export const useCartStore = create((set) => ({
  items: loadItems(),
  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { id: product.id, title: product.title, price: product.price, quantity: 1 },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

  setQuantity: (id, quantity) =>
    set((state) => {
      if (quantity < 1) {
        return { items: state.items.filter((item) => item.id !== id) };
      }
      return {
        items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      };
    }),

  clear: () => set({ items: [] }),
}));

// Selectors for derived values (computed, never stored). They return numbers (primitives).
export const selectItemCount = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
// Persistence from OUTSIDE React: runs on every store change, saves only when items changed.
useCartStore.subscribe((state, prevState) => {
  if (state.items === prevState.items) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // ignore storage errors
  }
});