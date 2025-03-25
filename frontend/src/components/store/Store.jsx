import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlaystation, FaSteam, FaXbox, FaGooglePlay } from 'react-icons/fa';
import { SiEpicgames, SiNintendo } from 'react-icons/si';

const Store = () => {
  const platforms = [
    {
      id: 'playstation',
      name: 'PlayStation',
      icon: <FaPlaystation className="w-12 h-12" />,
      color: 'bg-blue-600'
    },
    {
      id: 'steam',
      name: 'Steam',
      icon: <FaSteam className="w-12 h-12" />,
      color: 'bg-gray-700'
    },
    {
      id: 'xbox',
      name: 'Xbox',
      icon: <FaXbox className="w-12 h-12" />,
      color: 'bg-green-600'
    },
    {
      id: 'epic-games',
      name: 'Epic Games',
      icon: <SiEpicgames className="w-12 h-12" />,
      color: 'bg-black'
    },
    {
      id: 'nintendo',
      name: 'Nintendo',
      icon: <SiNintendo className="w-12 h-12" />,
      color: 'bg-red-600'
    },
    {
      id: 'google-play',
      name: 'Google Play',
      icon: <FaGooglePlay className="w-12 h-12" />,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFF7D1] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#563A9C] mb-12 text-center tracking-tight">
          Gaming Gift Cards Store
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((platform) => (
            <Link
              key={platform.id}
              to={`/store/${platform.id}`}
              className="group"
            >
              <div className={`
                ${platform.color} 
                rounded-2xl 
                shadow-2xl 
                overflow-hidden 
                transition-all 
                duration-300 
                transform 
                hover:-translate-y-4 
                hover:shadow-4xl 
                text-white 
                hover:scale-105
              `}>
                <div className="p-8 text-center">
                  <div className="flex items-center justify-center mb-6 opacity-90 group-hover:opacity-100 transition-opacity">
                    {React.cloneElement(platform.icon, {
                      className: "w-20 h-20 group-hover:scale-110 transition-transform"
                    })}
                  </div>
                  <h2 className="text-3xl font-bold mb-3 text-[#FFF7D1] group-hover:text-white transition-colors">
                    {platform.name}
                  </h2>
                  <p className="text-[#FFF7D1] text-opacity-80 group-hover:text-opacity-100 transition-opacity">
                    Browse {platform.name} Gift Cards
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Store; 