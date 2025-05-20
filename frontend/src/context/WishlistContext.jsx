import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    // Load wishlist from localStorage on initialization
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (item) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        // Item already in wishlist, do nothing
        return prevItems;
      }
      return [...prevItems, item];
    });
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const isInWishlist = (itemId) => {
    return wishlistItems.some(item => item.id === itemId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const getWishlistItemsCount = () => {
    return wishlistItems.length;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        getWishlistItemsCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}; 