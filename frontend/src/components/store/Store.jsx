import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlaystation, FaSteam, FaXbox, FaHeadphones, FaKeyboard, FaMouse } from 'react-icons/fa';

const Store = () => {
  const platforms = [
    {
      id: 'playstation',
      name: 'PlayStation',
      icon: <FaPlaystation />,
      color: 'from-blue-700 to-blue-900',
      borderColor: 'border-blue-500'
    },
    {
      id: 'steam',
      name: 'Steam',
      icon: <FaSteam />,
      color: 'from-gray-700 to-gray-900',
      borderColor: 'border-gray-500'
    },
    {
      id: 'xbox',
      name: 'Xbox',
      icon: <FaXbox />,
      color: 'from-green-700 to-green-900',
      borderColor: 'border-green-500'
    }
  ];

  const accessories = [
    {
      id: 'headphones',
      name: 'Gaming Headsets',
      icon: <FaHeadphones />,
      color: 'from-purple-600 to-purple-800',
      borderColor: 'border-purple-500'
    },
    {
      id: 'keyboards',
      name: 'Gaming Keyboards',
      icon: <FaKeyboard />,
      color: 'from-indigo-600 to-indigo-800',
      borderColor: 'border-indigo-500'
    },
    {
      id: 'mouse',
      name: 'Gaming Mouse',
      icon: <FaMouse />,
      color: 'from-pink-600 to-pink-800',
      borderColor: 'border-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 to-black py-20">
        <div className="absolute inset-0 bg-[url('/src/assets/Home/hex-pattern.png')] bg-repeat opacity-10"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Gaming Store
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto my-6"></div>
            <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
              Premium gaming gift cards and accessories for the ultimate gaming experience
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Gift Cards Section */}
        <div className="mb-16">
          <div className="flex items-center mb-10">
            <div className="h-10 w-1 bg-yellow-500 mr-4"></div>
            <h2 className="text-3xl font-bold text-white">Gift Cards</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {platforms.map((platform) => (
              <Link
                key={platform.id}
                to={`/store/${platform.id}`}
                className="group"
              >
                <div className={`
                  bg-gradient-to-br ${platform.color} 
                  rounded-xl 
                  shadow-lg 
                  p-8 
                  text-center 
                  transition-all 
                  duration-300 
                  hover:scale-105
                  hover:shadow-2xl 
                  text-white
                  border border-opacity-20 ${platform.borderColor}
                  relative overflow-hidden
                `}>
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                  <div className="absolute inset-0 bg-[url('/src/assets/Home/circuit-pattern.png')] bg-repeat opacity-10"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center items-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-black bg-opacity-30 flex items-center justify-center">
                        {React.cloneElement(platform.icon, {
                          className: "w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300"
                        })}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">{platform.name}</h2>
                    <p className="text-sm text-gray-200 mb-4">
                      Browse {platform.name} Gift Cards
                    </p>
                    <div className="inline-block px-4 py-2 bg-black bg-opacity-30 rounded-full text-sm font-medium group-hover:bg-opacity-50 transition-all">
                      Shop Now
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Accessories Section */}
        <div>
          <div className="flex items-center mb-10">
            <div className="h-10 w-1 bg-yellow-500 mr-4"></div>
            <h2 className="text-3xl font-bold text-white">Gaming Accessories</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessories.map((accessory) => (
              <Link
                key={accessory.id}
                to={`/store/accessories/${accessory.id}`}
                className="group"
              >
                <div className={`
                  bg-gradient-to-br ${accessory.color} 
                  rounded-xl 
                  shadow-lg 
                  p-8 
                  text-center 
                  transition-all 
                  duration-300 
                  hover:scale-105 
                  hover:shadow-2xl 
                  text-white
                  border border-opacity-20 ${accessory.borderColor}
                  relative overflow-hidden
                `}>
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                  <div className="absolute inset-0 bg-[url('/src/assets/Home/circuit-pattern.png')] bg-repeat opacity-10"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center items-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-black bg-opacity-30 flex items-center justify-center">
                        {React.cloneElement(accessory.icon, {
                          className: "w-10 h-10 text-white group-hover:scale-110 transition-transform duration-300"
                        })}
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-3">{accessory.name}</h2>
                    <p className="text-sm text-gray-200 mb-4">
                      High-quality gaming gear
                    </p>
                    <div className="inline-block px-4 py-2 bg-black bg-opacity-30 rounded-full text-sm font-medium group-hover:bg-opacity-50 transition-all">
                      Shop Now
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Store;
