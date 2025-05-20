import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleRemoveItem = (id) => {
    removeFromWishlist(id);
  };

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  const handleGoToProduct = (item) => {
    // Navigate based on product category
    if (item.category === 'game') {
      navigate(`/store/${item.platform}/product/${item.id}`);
    } else if (item.category === 'accessories') {
      navigate(`/store/accessories/${item.subcategory}/product/${item.id}`);
    } else {
      navigate(`/store/${item.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-br from-gray-900 via-purple-900/10 to-black py-8 px-6">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400 flex items-center gap-3">
            <Heart className="text-amber-400" />
            My Wishlist
          </h1>
          <p className="text-gray-300 mt-2">Items you've saved for later</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {wishlistItems.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-12 text-center shadow-xl">
            <Heart className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-300 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Start adding items to your wishlist while shopping</p>
            <button
              onClick={() => navigate('/store')}
              className="inline-flex items-center px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg transition-colors shadow-lg"
            >
              <ShoppingCart className="mr-2" size={18} />
              Browse Store
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-300">{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist</p>
              <button
                onClick={clearWishlist}
                className="text-red-400 hover:text-red-300 flex items-center gap-2 text-sm"
              >
                <Trash2 size={16} />
                Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden shadow-xl group hover:border-purple-600 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleGoToProduct(item)}
                        className="bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg mr-2 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-xl font-bold text-amber-200 mb-2 truncate">{item.title}</h3>
                    <p className="text-gray-400 mb-2 line-clamp-2 h-12">{item.description}</p>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-bold text-amber-400">${item.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 rounded-full bg-red-900/30 hover:bg-red-900/50 text-red-400 transition-colors"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="p-2 rounded-full bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 transition-colors"
                          aria-label="Add to cart"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage; 