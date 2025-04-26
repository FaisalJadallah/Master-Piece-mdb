import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlaystation, FaSteam, FaXbox, FaGooglePlay, FaHeadphones, FaKeyboard, FaMouse } from 'react-icons/fa';
import { SiEpicgames, SiNintendo } from 'react-icons/si';

const Store = () => {
  const platforms = [
    {
      id: 'playstation',
      name: 'PlayStation',
      icon: <FaPlaystation />,
      color: 'bg-blue-700'
    },
    {
      id: 'steam',
      name: 'Steam',
      icon: <FaSteam />,
      color: 'bg-gray-800'
    },
    {
      id: 'xbox',
      name: 'Xbox',
      icon: <FaXbox />,
      color: 'bg-green-700'
    },
    {
      id: 'epic-games',
      name: 'Epic Games',
      icon: <SiEpicgames />,
      color: 'bg-black'
    },
    {
      id: 'nintendo',
      name: 'Nintendo',
      icon: <SiNintendo />,
      color: 'bg-red-700'
    },
    {
      id: 'google-play',
      name: 'Google Play',
      icon: <FaGooglePlay />,
      color: 'bg-green-600'
    }
  ];

  const accessories = [
    {
      id: 'headphones',
      name: 'Gaming Headsets',
      icon: <FaHeadphones />,
      color: 'bg-purple-700'
    },
    {
      id: 'keyboards',
      name: 'Gaming Keyboards',
      icon: <FaKeyboard />,
      color: 'bg-indigo-700'
    },
    {
      id: 'mouse',
      name: 'Gaming Mouse',
      icon: <FaMouse />,
      color: 'bg-pink-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e1e2f] to-[#2c2c3e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#FFF7D1] mb-12">
          Gaming Gift Cards Store
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {platforms.map((platform) => (
            <Link
              key={platform.id}
              to={`/store/${platform.id}`}
              className="group"
            >
              <div className={`
                ${platform.color} 
                rounded-2xl 
                shadow-lg 
                p-8 
                text-center 
                transition-transform 
                duration-300 
                hover:-translate-y-3 
                hover:shadow-2xl 
                text-[#FFF7D1]
                hover:bg-opacity-90
              `}>
                <div className="flex justify-center items-center mb-6">
                  {React.cloneElement(platform.icon, {
                    className: "w-16 h-16 text-[#FFF7D1] group-hover:scale-110 transition-transform duration-300"
                  })}
                </div>
                <h2 className="text-2xl font-bold mb-2">{platform.name}</h2>
                <p className="text-sm text-[#FFF7D1] text-opacity-80 group-hover:text-opacity-100">
                  Browse {platform.name} Gift Cards
                </p>
              </div>
            </Link>
          ))}
        </div>

        <h2 className="text-4xl font-extrabold text-center text-[#FFF7D1] mb-12">
          Gaming Accessories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {accessories.map((accessory) => (
            <Link
              key={accessory.id}
              to={`/store/accessories/${accessory.id}`}
              className="group"
            >
              <div className={`
                ${accessory.color} 
                rounded-2xl 
                shadow-lg 
                p-8 
                text-center 
                transition-transform 
                duration-300 
                hover:-translate-y-3 
                hover:shadow-2xl 
                text-[#FFF7D1]
                hover:bg-opacity-90
              `}>
                <div className="flex justify-center items-center mb-6">
                  {React.cloneElement(accessory.icon, {
                    className: "w-16 h-16 text-[#FFF7D1] group-hover:scale-110 transition-transform duration-300"
                  })}
                </div>
                <h2 className="text-2xl font-bold mb-2">{accessory.name}</h2>
                <p className="text-sm text-[#FFF7D1] text-opacity-80 group-hover:text-opacity-100">
                  Browse {accessory.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store;
