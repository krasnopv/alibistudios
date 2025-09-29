'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetPath } from '@/lib/assets';

const Header = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasHero, setHasHero] = useState(true);

  useEffect(() => {
    // Check if Hero section exists
    const checkForHero = () => {
      const heroElement = document.getElementById('hero');
      setHasHero(!!heroElement);
    };

    // Check on mount and when DOM changes
    checkForHero();
    const observer = new MutationObserver(checkForHero);
    observer.observe(document.body, { childList: true, subtree: true });

    const handleScroll = () => {
      if (hasHero) {
        const heroHeight = window.innerHeight; // Hero section height (100vh)
        const scrollY = window.scrollY;
        const progress = Math.min(scrollY / heroHeight, 1); // 0 to 1
        setScrollProgress(progress);
      } else {
        // If no hero, always show solid header
        setScrollProgress(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [hasHero]);

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
      // Start slide-out animation immediately
      setIsMenuOpen(false);
      // Hide sidebar after animation completes
      setTimeout(() => {
        setShowSidebar(false);
      }, 400);
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: hasHero 
          ? `rgba(255, 255, 255, ${scrollProgress * 0.95})`
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: hasHero 
          ? `blur(${scrollProgress * 12}px)`
          : 'blur(12px)',
        boxShadow: hasHero 
          ? (scrollProgress > 0 ? `0 4px 6px -1px rgba(0, 0, 0, ${scrollProgress * 0.1})` : 'none')
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="w-full flex justify-center">
        <div className="container h-14 py-2.5 px-4 sm:px-6 lg:px-8">
          <div className="row flex items-center justify-between">
        {/* Left - Burger Menu */}
        <button 
          onClick={handleMenuToggle}
          className="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer"
        >
          <Image 
            src={getAssetPath('menu.svg')} 
            alt="Menu" 
            width={24} 
            height={24}
            className="w-6 h-6 transition-all duration-300"
            style={{
              filter: (hasHero && scrollProgress > 0.8) || !hasHero ? 'none' : `brightness(0) invert(1)`
            }}
          />
        </button>

        {/* Center - Logo */}
        <div className="flex items-center">
          <Link href="/" className="cursor-pointer">
            <Image 
              src={getAssetPath((hasHero && scrollProgress > 0.8) || !hasHero ? 'logo_black.svg' : 'logo_white.svg')}
              alt="Alibi Studios" 
              width={120} 
              height={40}
              className="h-10 w-auto transition-all duration-300"
              style={{
                filter: (hasHero && scrollProgress > 0.8) || !hasHero ? 'none' : `brightness(0) invert(1)`
              }}
            />
          </Link>
        </div>

        {/* Right - Contact */}
        <a 
          href="mailto:hello@alibistudios.com"
          className="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer"
        >
          <Image 
            src={getAssetPath('contact.svg')} 
            alt="Contact" 
            width={24} 
            height={24}
            className="w-6 h-6 transition-all duration-300"
            style={{
              filter: (hasHero && scrollProgress > 0.8) || !hasHero ? 'none' : `brightness(0) invert(1)`
            }}
          />
        </a>
          </div>
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
                  src={getAssetPath('x.svg')} 
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
               <a href="/services" className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400
                 }}>Services<br/></div>
               </a>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Team<br/></div>
               </div>
               <div className="inline-flex justify-start items-center gap-2.5" style={{ opacity: 0.5, cursor: 'pointer' }}>
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
               <a href="/directors" className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Directors</div>
               </a>
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