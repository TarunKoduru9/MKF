import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
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
        }),
        {
            name: 'mkf-store',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cart: state.cart, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);

export default useStore;
