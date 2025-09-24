'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      handleMenuClose();
    } else {
      setIsMenuOpen(true);
      setShowSidebar(true);
    }
  };

  const handleMenuClose = () => {
    if (isMenuOpen) {
      setIsAnimating(true);
      // Allow slide-out animation to complete before hiding
      setTimeout(() => {
        setIsMenuOpen(false);
        setShowSidebar(false);
        setIsAnimating(false);
      }, 400);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="w-full flex justify-center">
        <div className="w-[1440px] h-14 px-10 py-2.5 flex items-center justify-between">
        {/* Left - Burger Menu */}
        <button 
          onClick={handleMenuToggle}
          className="p-2 hover:opacity-70 transition-opacity duration-200"
        >
          <Image 
            src={isScrolled ? "/menu.svg" : "/menu.svg"} 
            alt="Menu" 
            width={24} 
            height={24}
            className={`w-6 h-6 ${isScrolled ? 'brightness-0' : 'brightness-0 invert'}`}
          />
        </button>

        {/* Center - Logo */}
        <div className="flex items-center">
          <Image 
            src={isScrolled ? "/logo_black.svg" : "/logo_white.svg"}
            alt="Alibi Studios" 
            width={120} 
            height={40}
            className="h-10 w-auto"
          />
        </div>

        {/* Right - Contact */}
        <a 
          href="mailto:hello@alibistudios.com"
          className="p-2 hover:opacity-70 transition-opacity duration-200"
        >
          <Image 
            src="/contact.svg" 
            alt="Contact" 
            width={24} 
            height={24}
            className={`w-6 h-6 ${isScrolled ? 'brightness-0' : 'brightness-0 invert'}`}
          />
        </a>
        </div>
      </div>

      {/* Sidebar Menu Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleMenuClose}
          />
          {/* Sidebar */}
          <div className={`absolute top-0 left-0 bg-white transform ${
            isMenuOpen ? 'sidebar-slide-in' : 'sidebar-slide-out'
          }`} style={{
            display: 'flex',
            width: '428px',
            height: '1140px',
            padding: '24px 40px 40px 40px',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}>
            {/* Close Button */}
            <div style={{
              display: 'flex',
              height: '50px',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0
            }}>
              <button 
                onClick={handleMenuClose}
                className="w-8 h-7 p-[5px] inline-flex flex-col justify-start items-start gap-2.5"
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src="/x.svg" 
                  alt="Close menu" 
                  className="w-6 h-6"
                />
              </button>
            </div>
            
            {/* Spacer */}
            <div className="p-4 inline-flex justify-start items-center gap-2.5">
              <div className="justify-center"></div>
            </div>
            
            {/* Menu Items */}
             <div className="flex flex-col justify-start items-start">
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400
                 }}>Services<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Team<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5" style={{ opacity: 0.5 }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Our Work<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>- VFX<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>- Animation<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>- Immersive<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>- Gaming<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>- Media & Generative Art<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>- Film & Episodic<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Directors</div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Contact Us<br/></div>
               </div>
             </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;