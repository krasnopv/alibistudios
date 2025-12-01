'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { useMailto } from '@/hooks/useMailto';

const Header = () => {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [hasHero, setHasHero] = useState(true);
  const [menuData, setMenuData] = useState<{
    title?: string;
    items?: Array<{
      _key: string;
      label: string;
      linkType: 'page' | 'service' | 'custom' | 'expander';
      url?: string;
      page?: { slug?: string };
      service?: { slug?: string };
      subItems?: Array<{
        _key: string;
        label: string;
        linkType: 'page' | 'service' | 'custom';
        url?: string;
        page?: { slug?: string };
        service?: { slug?: string };
      }>;
    }>;
  } | null>(null);
  const [expandedMenuItemKey, setExpandedMenuItemKey] = useState<string | null>(null);
  const email = 'production@alibistudios.co.uk';
  const { handleMailtoClick, copied } = useMailto(email);

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
    // Fetch sidebar menu configuration from Sanity
    const fetchMenu = async () => {
      try {
        const response = await fetch('/api/menu');
        if (!response.ok) {
          console.error('Error fetching menu:', response.status, response.statusText);
          return;
        }
        const data = await response.json();
        setMenuData(data);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    // Prevent body scroll when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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

  useEffect(() => {
    // Handle services section scrolling when page loads with #services hash
    const scrollToServicesSection = () => {
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
        return true;
      }
      return false;
    };

    const handleServicesHash = () => {
      if (window.location.hash === '#services') {
        // Try to scroll immediately first
        if (!scrollToServicesSection()) {
          // If services section not found, wait for content to load
          let attempts = 0;
          const maxAttempts = 20; // Maximum 4 seconds of checking (20 * 200ms)
          
          const checkForServicesSection = () => {
            attempts++;
            if (scrollToServicesSection()) {
              return; // Success, stop checking
            }
            
            if (attempts < maxAttempts) {
              // If still not found and haven't exceeded max attempts, check again
              setTimeout(checkForServicesSection, 200);
            }
          };
          
          // Start checking after initial delay
          setTimeout(checkForServicesSection, 300);
        }
      }
    };

    // Check on mount
    handleServicesHash();

    // Listen for hash changes
    window.addEventListener('hashchange', handleServicesHash);
    
    // Also listen for route changes (for Next.js navigation)
    const handleRouteChange = () => {
      if (window.location.hash === '#services') {
        if (!scrollToServicesSection()) {
          let attempts = 0;
          const maxAttempts = 20;
          
          const checkForServicesSection = () => {
            attempts++;
            if (scrollToServicesSection()) {
              return;
            }
            
            if (attempts < maxAttempts) {
              setTimeout(checkForServicesSection, 200);
            }
          };
          
          setTimeout(checkForServicesSection, 300);
        }
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);
    
    // Also listen for DOM mutations to catch when content loads
    const observer = new MutationObserver(() => {
      if (window.location.hash === '#services') {
        scrollToServicesSection();
      }
    });
    
    // Observe the entire document for changes
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    return () => {
      window.removeEventListener('hashchange', handleServicesHash);
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

  const handleContactUsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleMenuClose();
    // Scroll to footer after menu closes
    setTimeout(() => {
      const footer = document.getElementById('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 400);
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

  const handleServicesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    handleMenuClose();
    
    // Check if we're on the homepage
    if (window.location.pathname === '/') {
      // If on homepage, just scroll to services section
      const servicesSection = document.getElementById('services');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on different page, navigate to homepage with services hash
      router.push('/#services');
    }
  };

  const resolvePageHref = (slug?: string) => {
    if (!slug) return '/';
    if (slug === 'home') return '/';
    return `/${slug}`;
  };

  const resolveServiceHref = (slug?: string) => {
    if (!slug) return '/services';
    return `/services/${slug}`;
  };

  const renderMenuLabel = (label: string) => (
    <div
      className="relative justify-center text-[20px] md:text-[28px]"
      style={{
        color: '#000',
        fontFamily: 'Plus Jakarta Sans',
        fontStyle: 'normal',
        fontWeight: 400,
      }}
    >
      {label}
      <br />
    </div>
  );


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
        <a 
          href={`mailto:${email}`}
          onClick={handleMailtoClick}
          className="p-2 hover:opacity-70 transition-opacity duration-200 cursor-pointer"
          title={copied ? 'Email copied to clipboard!' : `Click to copy ${email}`}
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
          className={`absolute top-0 left-0 bg-white transform w-full md:w-[428px] h-full z-20 ${
            isMenuOpen ? 'sidebar-slide-in' : 'sidebar-slide-out'
          }`} 
          style={{
            display: 'flex',
            padding: '24px 40px 40px 40px',
            flexDirection: 'column',
            alignItems: 'flex-end',
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: '100vh'
          }}
          onClick={(e) => e.stopPropagation()}
          onWheel={(e) => {
            // Allow scrolling within sidebar, prevent body scroll
            e.stopPropagation();
          }}
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
             <div className="flex flex-col justify-start items-start w-full">
              {menuData?.items?.map((item) => {
                const key = item._key;

                if (item.linkType === 'expander') {
                  const isExpanded = expandedMenuItemKey === key;
                  return (
                    <div key={key} className="w-full">
               <button 
                        className="w-full inline-flex justify-start items-center gap-2.5 menu-item-hover"
                 style={{ cursor: 'pointer' }}
                        onClick={() =>
                          setExpandedMenuItemKey(isExpanded ? null : key)
                        }
               >
                        <div
                          className="relative justify-center text-[20px] md:text-[28px] inline-flex items-center gap-8"
                          style={{
                   color: '#000',
                   fontFamily: 'Plus Jakarta Sans',
                   fontStyle: 'normal',
                   fontWeight: 400,
                          }}
                        >
                          {item.label}
                          <span
                            className="text-[18px] md:text-[24px]"
                            style={{
                       color: '#000',
                       fontFamily: 'Plus Jakarta Sans',
                       fontStyle: 'normal',
                       fontWeight: 300,
                              textDecoration: 'none',
                            }}
                          >
                            {isExpanded ? '−' : '+'}
                          </span>
                          <br />
               </div>
               </button>
               <AnimatePresence>
                        {isExpanded && item.subItems && item.subItems.length > 0 && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     transition={{ duration: 0.3, ease: 'easeInOut' }}
                     style={{ overflow: 'hidden' }}
                   >
                     <div className="flex flex-col">
                              {item.subItems.map((sub) => {
                                const subKey = sub._key;
                                const label = `- ${sub.label}`;

                                if (sub.linkType === 'custom' && sub.url) {
                                  if (sub.url === '#films') {
                                    return (
                                      <Link
                                        key={subKey}
                                        href="/#films"
                                        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleFilmsClick}
                                      >
                                        {renderMenuLabel(label)}
                                      </Link>
                                    );
                                  }
                                  if (sub.url === '#services') {
                                    return (
                                      <Link
                                        key={subKey}
                                        href="/#services"
                                        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleServicesClick}
                                      >
                                        {renderMenuLabel(label)}
                                      </Link>
                                    );
                                  }
                                  if (sub.url === '#footer') {
                                    return (
                                      <a
                                        key={subKey}
                                        href="#footer"
                                        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleContactUsClick}
                                      >
                                        {renderMenuLabel(label)}
                                      </a>
                                    );
                                  }

                                  if (sub.url.startsWith('/')) {
                                    return (
                                      <Link
                                        key={subKey}
                                        href={sub.url}
                                        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                                        style={{ cursor: 'pointer' }}
                                        onClick={handleMenuItemClick}
                                      >
                                        {renderMenuLabel(label)}
                                      </Link>
                                    );
                                  }

                                  return (
                                    <a
                                      key={subKey}
                                      href={sub.url}
                                      className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                                      style={{ cursor: 'pointer' }}
                                      onClick={handleMenuItemClick}
                                    >
                                      {renderMenuLabel(label)}
                                    </a>
                                  );
                                }

                                if (sub.linkType === 'page') {
                                  const href = resolvePageHref(sub.page?.slug);
                                  return (
                                    <Link
                                      key={subKey}
                                      href={href}
                                      className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                                      style={{ cursor: 'pointer' }}
                                      onClick={handleMenuItemClick}
                                    >
                                      {renderMenuLabel(label)}
                 </Link>
                                  );
                                }

                                if (sub.linkType === 'service') {
                                  const href = resolveServiceHref(sub.service?.slug);
                                  return (
                                    <Link
                                      key={subKey}
                                      href={href}
                                      className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                                      style={{ cursor: 'pointer' }}
                                      onClick={handleMenuItemClick}
                                    >
                                      {renderMenuLabel(label)}
               </Link>
                                  );
                                }

                                return null;
                              })}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
                    </div>
                  );
                }

                if (item.linkType === 'custom' && item.url) {
                  if (item.url === '#films') {
                    return (
                      <Link
                        key={key}
                        href="/#films"
                        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                        style={{ cursor: 'pointer' }}
                        onClick={handleFilmsClick}
                      >
                        {renderMenuLabel(item.label)}
               </Link>
                    );
                  }
                  if (item.url === '#services') {
                    return (
                      <Link
                        key={key}
                        href="/#services"
                        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                        style={{ cursor: 'pointer' }}
                        onClick={handleServicesClick}
                      >
                        {renderMenuLabel(item.label)}
               </Link>
                    );
                  }
                  if (item.url === '#footer') {
                    return (
                      <a
                        key={key}
                        href="#footer"
                        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                        style={{ cursor: 'pointer' }}
                        onClick={handleContactUsClick}
                      >
                        {renderMenuLabel(item.label)}
                      </a>
                    );
                  }

                  if (item.url.startsWith('/')) {
                    return (
                      <Link
                        key={key}
                        href={item.url}
                        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                        style={{ cursor: 'pointer' }}
                        onClick={handleMenuItemClick}
                      >
                        {renderMenuLabel(item.label)}
               </Link>
                    );
                  }

                  return (
               <a 
                      key={key}
                      href={item.url}
                 className="inline-flex justify-start items-center gap-2.5 menu-item-hover" 
                 style={{ cursor: 'pointer' }}
                      onClick={handleMenuItemClick}
                    >
                      {renderMenuLabel(item.label)}
                    </a>
                  );
                }

                if (item.linkType === 'page') {
                  const href = resolvePageHref(item.page?.slug);
                  return (
                    <Link
                      key={key}
                      href={href}
                      className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                      style={{ cursor: 'pointer' }}
                      onClick={handleMenuItemClick}
                    >
                      {renderMenuLabel(item.label)}
                    </Link>
                  );
                }

                if (item.linkType === 'service') {
                  const href = resolveServiceHref(item.service?.slug);
                  return (
                    <Link
                      key={key}
                      href={href}
                      className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
                      style={{ cursor: 'pointer' }}
                      onClick={handleMenuItemClick}
                    >
                      {renderMenuLabel(item.label)}
                    </Link>
                  );
                }

                return null;
              })}
             </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;