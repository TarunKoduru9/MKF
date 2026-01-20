import { create } from 'zustand';

const useStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    cart: [],
    setUser: (user) => set({ user, isAuthenticated: !!user }),
    logout: () => set({ user: null, isAuthenticated: false }),
    addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((i) => i.id === item.id);
        if (existingItem) {
            return {
                cart: state.cart.map((i) =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                ),
            };
        }
        return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
    removeFromCart: (itemId) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== itemId),
    })),
    updateQuantity: (itemId, quantity) => set((state) => ({
        cart: state.cart.map((i) =>
            i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
    })),
    clearCart: () => set({ cart: [] }),
}));

export default useStore;
