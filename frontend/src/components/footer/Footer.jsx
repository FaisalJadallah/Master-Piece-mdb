import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Custom icon components to replace react-icons
  const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
    </svg>
  );
  
  const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
    </svg>
  );
  
  const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
  
  const DiscordIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.593 10.971c-.542 0-.989.475-.989 1.055 0 .578.456 1.055 1.002 1.055.575 0 1.018-.477 1.018-1.055.014-.58-.443-1.055-1.031-1.055zm3.722 0c-.545 0-.989.475-.989 1.055 0 .578.456 1.055 1.003 1.055.574 0 1.017-.477 1.017-1.055s-.443-1.055-1.031-1.055z" />
      <path d="M20.317 4.37C18.787 3.682 17.147 3.2 15.432 3c-.213.377-.463.897-.634 1.304-1.85-.278-3.687-.278-5.503 0-.17-.407-.433-.927-.648-1.304C6.934 3.199 5.29 3.683 3.76 4.37 1.54 7.733.755 11.006.938 14.238c1.524 1.154 3.342 2.201 5.554 2.732.446-.618.84-1.274 1.183-1.964-.65-.245-1.269-.54-1.856-.878.156-.114.309-.233.456-.353 3.59 1.674 7.48 1.674 11.025 0 .149.123.304.243.456.353-.589.337-1.21.631-1.857.879.342.689.736 1.345 1.183 1.964 2.214-.531 4.033-1.578 5.557-2.732.213-3.749-.744-6.994-2.322-9.869zm-4.103 8.123c-1.074 0-1.957-.991-1.957-2.21s.865-2.21 1.957-2.21c1.093 0 1.971.991 1.957 2.21.001 1.217-.864 2.21-1.957 2.21zm-7.223 0c-1.075 0-1.957-.991-1.957-2.21s.865-2.21 1.957-2.21c1.092 0 1.97.991 1.957 2.21 0 1.217-.865 2.21-1.957 2.21z" />
    </svg>
  );
  
  const TwitchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z" />
    </svg>
  );
  
  const YoutubeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
  );
  
  const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
    </svg>
  );
  
  const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z" />
    </svg>
  );
  
  const HeadsetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1c-4.971 0-9 4.029-9 9v7c0 1.66 1.34 3 3 3h3v-8h-4v-2c0-3.866 3.134-7 7-7s7 3.134 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.971-4.029-9-9-9z" />
    </svg>
  );

  return (
    <footer className="bg-[#1F1633] text-[#FFF7D1] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#563A9C] via-[#8A4FFF] to-[#563A9C]"></div>
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-[#8A4FFF]/10 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[#8A4FFF]/10 blur-xl"></div>
      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto pt-16 pb-12 px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: About */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-[#8A4FFF] text-[#FFF7D1] flex items-center justify-center rounded-lg mr-3">
                <span className="font-bold text-xl">G</span>
              </div>
              <h2 className="text-2xl font-bold">
                <span className="text-white">Gaming</span>
                <span className="text-[#FFCC00]">Hive</span>
              </h2>
            </div>
            <p className="text-sm text-[#FFF7D1]/80 mb-6">
              Your ultimate destination for games, gift cards, and competitive tournaments. Join our community of passionate gamers today!
            </p>
            <div className="flex gap-4 text-[#8A4FFF]">
              <a href="#facebook" className="hover:text-[#FFCC00] transition-colors">
                <FacebookIcon />
              </a>
              <a href="#twitter" className="hover:text-[#FFCC00] transition-colors">
                <TwitterIcon />
              </a>
              <a href="#instagram" className="hover:text-[#FFCC00] transition-colors">
                <InstagramIcon />
              </a>
              <a href="#discord" className="hover:text-[#FFCC00] transition-colors">
                <DiscordIcon />
              </a>
              <a href="#twitch" className="hover:text-[#FFCC00] transition-colors">
                <TwitchIcon />
              </a>
              <a href="#youtube" className="hover:text-[#FFCC00] transition-colors">
                <YoutubeIcon />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-[#8A4FFF]/30 pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>Home
                </a>
              </li>
              <li>
                <a href="/tournaments" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>Tournaments
                </a>
              </li>
              <li>
                <a href="/store" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>Store
                </a>
              </li>
              <li>
                <a href="/news" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>News
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>About Us
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>Profile
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Products */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-[#8A4FFF]/30 pb-2">Gift Cards</h3>
            <ul className="space-y-3">
              <li>
                <a href="/store/gift-cards/playstation" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>PlayStation Cards
                </a>
              </li>
              <li>
                <a href="/store/gift-cards/xbox" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>Xbox Cards
                </a>
              </li>
              <li>
                <a href="/store/gift-cards/steam" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>Steam Cards
                </a>
              </li>
              <li>
                <a href="/store/gift-cards/nintendo" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>Nintendo Cards
                </a>
              </li>
              <li>
                <a href="/store/merchandise" className="hover:text-[#FFCC00] transition-colors flex items-center text-[#FFF7D1]/90">
                  <span className="w-1.5 h-1.5 bg-[#8A4FFF] rounded-full mr-2"></span>Merchandise
                </a>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact */}
          <div className="relative">
            <h3 className="text-lg font-semibold mb-6 border-b border-[#8A4FFF]/30 pb-2">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mt-1 mr-3 text-[#8A4FFF]"><MapIcon /></span>
                <span className="text-[#FFF7D1]/90">123 Gamer Street, Digital City, GA 30033</span>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-[#8A4FFF]"><EmailIcon /></span>
                <a href="mailto:info@gaminghive.com" className="hover:text-[#FFCC00] transition-colors text-[#FFF7D1]/90">info@gaminghive.com</a>
              </li>
              <li className="flex items-center">
                <span className="mr-3 text-[#8A4FFF]"><HeadsetIcon /></span>
                <a href="tel:+11234567890" className="hover:text-[#FFCC00] transition-colors text-[#FFF7D1]/90">+1 (123) 456-7890</a>
              </li>
            </ul>
            
           
          </div>
        </div>
        
     
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-[#8A4FFF]/20 bg-[#17111F]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-[#FFF7D1]/60 mb-4 md:mb-0">
            © {currentYear} <span className="text-[#FFCC00]">GamingHive</span>. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-[#FFF7D1]/60">
            <a href="/privacy-policy" className="hover:text-[#FFCC00] transition-colors">Privacy Policy</a>
            <a href="/terms-of-service" className="hover:text-[#FFCC00] transition-colors">Terms of Service</a>
            <a href="/faq" className="hover:text-[#FFCC00] transition-colors">FAQ</a>
            <a href="/support" className="hover:text-[#FFCC00] transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;