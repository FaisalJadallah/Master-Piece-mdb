import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    // Check if the item already has an isPhysical property
    if (item.isPhysical !== undefined) {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id);
        if (existingItem) {
          return prevItems.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
        return [...prevItems, { ...item, quantity: 1 }];
      });
      return;
    }
    
    // Determine if the item is a physical product based on its category or title
    let isPhysical = false;
    
    // Check by category first (most reliable)
    if (item.category === 'accessories') {
      isPhysical = true;
    } 
    // Check by subcategory if available
    else if (item.subcategory && ['headphones', 'keyboards', 'mouse', 'controllers', 'chairs', 'monitors', 'other'].includes(item.subcategory)) {
      isPhysical = true;
    }
    // Fallback to keyword detection in title
    else {
      const accessoryKeywords = [
        'headset', 'keyboard', 'mouse', 'controller', 'chair', 'monitor', 
        'accessory', 'accessories', 'console', 'hardware', 'physical', 
        'headphone', 'gaming chair', 'mousepad', 'gaming gear'
      ];
      
      isPhysical = accessoryKeywords.some(keyword => 
        item.title && item.title.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Digital products keywords (to exclude)
      const digitalKeywords = [
        'gift card', 'download', 'digital', 'code', 'steam key', 
        'xbox key', 'playstation key', 'dlc', 'expansion', 'subscription'
      ];
      
      // If it matches digital keywords, override the physical detection
      if (digitalKeywords.some(keyword => 
        item.title && item.title.toLowerCase().includes(keyword.toLowerCase())
      )) {
        isPhysical = false;
      }
    }
    
    console.log(`Adding item to cart: ${item.title}, isPhysical: ${isPhysical}`);
    
    const itemWithType = {
      ...item,
      isPhysical: isPhysical
    };
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...itemWithType, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  // Check if cart contains any physical items that require shipping
  const hasPhysicalItems = () => {
    return cartItems.some(item => item.isPhysical === true);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        hasPhysicalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 