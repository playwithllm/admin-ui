import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
interface AuthState {
  isAuthenticated: boolean;
  // Add other auth-related properties if needed
}
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeCartItem: (id: string) => void;
  getCartCount: () => number;
  authState: AuthState; // Include AuthState in the context type
  total: number;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeCartItem: () => {},
  getCartCount: () => 0,
  authState: { isAuthenticated: false },
  total: 0,
  clearCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {}
});
export const useCart = () => useContext(CartContext);
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false }); // Manage authentication state
  const [total, setTotal] = useState<number>(0);
  const addToCart = (item: CartItem) => {
    console.log('Adding item to cart:', item);
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  useEffect(()=>{
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  }, [cartItems]);

  const removeCartItem = (id: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== id)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    removeCartItem(id);
  };

  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeCartItem,
    getCartCount,
    authState,
    total,
    clearCart,
    updateQuantity,
    removeItem
  }), [cartItems, authState]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
