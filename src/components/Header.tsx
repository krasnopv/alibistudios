'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAssetPath } from '@/lib/assets';

const Header = () => {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasHero, setHasHero] = useState(true);
  const [featuredServices, setFeaturedServices] = useState<Array<{_id: string; title: string; slug: string}>>([]);

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

  useEffect(() => {
    // Fetch featured services
    const fetchFeaturedServices = async () => {
      try {
        const response = await fetch('/api/homepage-services');
        const data = await response.json();
        setFeaturedServices(data);
      } catch (error) {
        console.error('Error fetching featured services:', error);
      }
    };

    fetchFeaturedServices();
  }, []);

  useEffect(() => {
    // Handle films section scrolling when page loads with #films hash
    const scrollToFilmsSection = () => {
      const filmsSection = document.getElementById('films');
      if (filmsSection) {
        filmsSection.scrollIntoView({ behavior: 'smooth' });
        return true;
      }
      return false;
    };

    const handleFilmsHash = () => {
      if (window.location.hash === '#films') {
        // Try to scroll immediately first
        if (!scrollToFilmsSection()) {
          // If films section not found, wait for content to load
          let attempts = 0;
          const maxAttempts = 20; // Maximum 4 seconds of checking (20 * 200ms)
          
          const checkForFilmsSection = () => {
            attempts++;
            if (scrollToFilmsSection()) {
              return; // Success, stop checking
            }
            
            if (attempts < maxAttempts) {
              // If still not found and haven't exceeded max attempts, check again
              setTimeout(checkForFilmsSection, 200);
            }
          };
          
          // Start checking after initial delay
          setTimeout(checkForFilmsSection, 300);
        }
      }
    };

    // Check on mount
    handleFilmsHash();

    // Listen for hash changes
    window.addEventListener('hashchange', handleFilmsHash);
    
    // Also listen for route changes (for Next.js navigation)
    const handleRouteChange = () => {
      if (window.location.hash === '#films') {
        if (!scrollToFilmsSection()) {
          let attempts = 0;
          const maxAttempts = 20;
          
          const checkForFilmsSection = () => {
            attempts++;
            if (scrollToFilmsSection()) {
              return;
            }
            
            if (attempts < maxAttempts) {
              setTimeout(checkForFilmsSection, 200);
            }
          };
          
          setTimeout(checkForFilmsSection, 300);
        }
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Also listen for DOM mutations to catch when content loads
    const observer = new MutationObserver(() => {
      if (window.location.hash === '#films') {
        scrollToFilmsSection();
      }
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => {
      window.removeEventListener('hashchange', handleFilmsHash);
      window.removeEventListener('popstate', handleRouteChange);
      observer.disconnect();
    };
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
      // Start slide-out animation immediately
      setIsMenuOpen(false);
      // Hide sidebar after animation completes
      setTimeout(() => {
        setShowSidebar(false);
      }, 400);
    }
  };

  const handleMenuItemClick = () => {
    handleMenuClose();
  };

  const handleFilmsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMenuClose();
    
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      // If on homepage, just scroll to films section
      const filmsSection = document.getElementById('films');
      if (filmsSection) {
        filmsSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on different page, navigate to homepage with films hash
      router.push('/#films');
    }
  };

  const scrollToFooter = () => {
    const footer = document.querySelector('footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
    // Close sidebar after scrolling
    handleMenuClose();
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: hasHero 
            ? `rgba(255, 255, 255, ${scrollProgress * 0.8})`
            : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: hasHero 
            ? `blur(${scrollProgress * 12}px)`
            : 'blur(12px)',
          // boxShadow: hasHero 
          //   ? (scrollProgress > 0 ? `0 4px 6px -1px rgba(0, 0, 0, ${scrollProgress * 0.1})` : 'none')
          //   : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 py-2.5">
        <div className="flex items-center justify-between w-full">
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
              width={93} 
              height={35}
              className="w-auto transition-all duration-300"
              style={{
                filter: (hasHero && scrollProgress > 0.8) || !hasHero ? 'none' : `brightness(0) invert(1)`
              }}
            />
          </Link>
        </div>

        {/* Right - Contact */}
        <button 
          onClick={scrollToFooter}
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
        </button>
        </div>
      </div>
    </header>

    {/* Sidebar Menu Overlay - Outside header for full screen coverage */}
    {showSidebar && (
      <div className="fixed inset-0 z-50">
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-white/80 transition-opacity duration-300 z-10 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={handleMenuClose}
        />
        {/* Sidebar */}
        <div 
          className={`absolute top-0 left-0 bg-white transform w-full md:w-[428px] h-screen md:h-[1140px] z-20 ${
            isMenuOpen ? 'sidebar-slide-in' : 'sidebar-slide-out'
          }`} 
          style={{
            display: 'flex',
            padding: '24px 40px 40px 40px',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
          onClick={(e) => e.stopPropagation()}
        >
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
               <Link href="/services" className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }} onClick={handleMenuItemClick}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400
                 }}>Services<br/></div>
               </Link>
               <Link href="/team" className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }} onClick={handleMenuItemClick}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Team<br/></div>
               </Link>
               <div className="inline-flex justify-start items-center gap-2.5" style={{ opacity: 0.5, cursor: 'pointer' }}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Our Work<br/></div>
               </div>
               {featuredServices.map((service) => (
                 <Link key={service._id} href={`/services/${service.slug}`} className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }} onClick={handleMenuItemClick}>
                   <div className="justify-center" style={{
                     color: '#000',
                     fontFamily: 'Plus Jakarta Sans',
                     fontSize: '28px',
                     fontStyle: 'normal',
                     fontWeight: 400,
                   }}>- {service.title}<br/></div>
                 </Link>
               ))}
               <Link href="/#films" className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }} onClick={handleFilmsClick}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>- Film & Episodic<br/></div>
               </Link>
               <Link href="/directors" className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }} onClick={handleMenuItemClick}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Directors</div>
               </Link>
               <Link href="/studios" className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }} onClick={handleMenuItemClick}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Studios<br/></div>
               </Link>
               <Link href="/tax-rebate" className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }} onClick={handleMenuItemClick}>
                 <div className="justify-center" style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontSize: '28px',
                   fontStyle: 'normal',
                   fontWeight: 400,
                 }}>Tax Rebate<br/></div>
               </Link>
               <div className="inline-flex justify-start items-center gap-2.5 menu-item-hover" style={{ cursor: 'pointer' }} onClick={() => { scrollToFooter(); handleMenuItemClick(); }}>
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
    </>
  );
};

export default Header;