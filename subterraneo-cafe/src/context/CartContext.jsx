import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (product, selectedOptions = {}) => {
    const itemKey = `${product.id}_${JSON.stringify(selectedOptions)}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.itemKey === itemKey);
      if (existing) {
        return prev.map((i) =>
          i.itemKey === itemKey ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          itemKey,
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          selectedOptions,
          qty: 1,
        },
      ];
    });
  };

  const removeFromCart = (itemKey) => {
    setCartItems((prev) => prev.filter((i) => i.itemKey !== itemKey));
  };

  const updateQty = (itemKey, qty) => {
    if (qty <= 0) return removeFromCart(itemKey);
    setCartItems((prev) =>
      prev.map((i) => (i.itemKey === itemKey ? { ...i, qty } : i))
    );
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};