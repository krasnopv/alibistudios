'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetPath } from '@/lib/assets';
import { navigateToHashHref, normalizeHashHref, parseHashHref, scrollToHashSection } from '@/lib/hashScroll';
import { useMailto } from '@/hooks/useMailto';
import { useContactEmail } from '@/hooks/useContactEmail';

/** Sidebar menuSubItem (Sanity): links, nested expanders, optional parentService grouping */
type MenuSubItemLocal = {
  _key: string;
  label: string;
  linkType: 'page' | 'service' | 'custom' | 'expander';
  url?: string;
  page?: { slug?: string };
  service?: { slug?: string };
  parentService?: { title?: string; slug?: string } | null;
  subItems?: MenuSubItemLocal[];
};

const Header = () => {
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
      subItems?: MenuSubItemLocal[];
    }>;
  } | null>(null);
  const [expandedMenuItemKey, setExpandedMenuItemKey] = useState<string | null>(null);
  /** Open nested expanders under a top-level menu item; key `${topKey}/${ancestor...}/${expandKey}` */
  const [nestedExpandedKeys, setNestedExpandedKeys] = useState<string[]>([]);
  const { email } = useContactEmail();
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

  const handleHashLinkClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    navigateToHashHref(href, { onBeforeNavigate: handleMenuClose });
  };

  const handleMenuToggle = () => {
    if (isMenuOpen) {
      handleMenuClose();
    } else {
      setIsMenuOpen(true);
      setShowSidebar(true);
    }
  };

  const handleMenuItemClick = () => {
    handleMenuClose();
  };

  const handleMenuClose = () => {
    if (isMenuOpen) {
      setNestedExpandedKeys([]);
      // Start slide-out animation immediately
      setIsMenuOpen(false);
      // Hide sidebar after animation completes
      setTimeout(() => {
        setShowSidebar(false);
      }, 400);
    }
  };

  const toggleNestedExpandedKey = (fullKey: string) => {
    setNestedExpandedKeys((prev) =>
      prev.includes(fullKey) ? prev.filter((k) => k !== fullKey) : [...prev, fullKey]
    );
  };

  /** Stable id for nested +/−: top menu item key + ancestor expander _keys + this expander's _key. */
  const nestedExpanderStableKey = (topMenuItemKey: string, pathSegmentsIncludingSelf: readonly string[]) =>
    [topMenuItemKey, ...pathSegmentsIncludingSelf].join('/');

  const handleContactUsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleMenuClose();
    setTimeout(() => {
      scrollToHashSection('footer');
      const path = window.location.pathname;
      window.history.pushState(null, '', `${path}#footer`);
    }, 400);
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

  const renderHashMenuLink = (key: string, label: string, url: string) => {
    const href = normalizeHashHref(url);

    if (url === '#footer') {
      return (
        <a
          key={key}
          href="#footer"
          className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
          style={{ cursor: 'pointer' }}
          onClick={handleContactUsClick}
        >
          {renderMenuLabel(label)}
        </a>
      );
    }

    return (
      <Link
        key={key}
        href={href}
        className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
        style={{ cursor: 'pointer' }}
        onClick={(e) => handleHashLinkClick(e, href)}
      >
        {renderMenuLabel(label)}
      </Link>
    );
  };

  const renderSubMenuLink = (sub: MenuSubItemLocal) => {
    const subKey = sub._key;
    const label = sub.label;

    if (sub.linkType === 'custom' && sub.url) {
      if (parseHashHref(normalizeHashHref(sub.url))) {
        return renderHashMenuLink(subKey, label, sub.url);
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
  };

  /** One sub row: nested expander or leaf link (supports grouping via renderGroupedExpanderSubItems). */
  function renderNestedSubMenuRow(
    topMenuItemKey: string,
    ancestorExpandPath: readonly string[],
    sub: MenuSubItemLocal
  ): ReactNode {
    if (sub.linkType === 'expander') {
      const nk = nestedExpanderStableKey(topMenuItemKey, [...ancestorExpandPath, sub._key]);
      const isExpanded = nestedExpandedKeys.includes(nk);
      const nested = sub.subItems ?? [];

      return (
        <div key={sub._key} className="w-full">
          <button
            type="button"
            className="w-full inline-flex justify-start items-center gap-2.5 menu-item-hover"
            style={{ cursor: 'pointer' }}
            onClick={() => toggleNestedExpandedKey(nk)}
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
              <span className="menu-label-text">{sub.label}</span>
              <span
                className="text-[18px] md:text-[24px] menu-expander-symbol"
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
            {isExpanded && nested.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ overflow: 'hidden' }}
              >
                <div className="flex flex-col pl-6">
                  {renderGroupedExpanderSubItems(topMenuItemKey, [...ancestorExpandPath, sub._key], nested)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return renderSubMenuLink(sub);
  }

  /**
   * Groups sub-items by parentService (slug). Supports nested expanders via renderNestedSubMenuRow.
   */
  function renderGroupedExpanderSubItems(
    topMenuItemKey: string,
    ancestorExpandPath: readonly string[],
    subItems: MenuSubItemLocal[]
  ): ReactNode[] {
    const byParentSlug = new Map<string, MenuSubItemLocal[]>();
    for (const sub of subItems) {
      const slug = sub.parentService?.slug;
      if (!slug) continue;
      const list = byParentSlug.get(slug);
      if (list) list.push(sub);
      else byParentSlug.set(slug, [sub]);
    }

    const explicitParentBySlug = new Map<string, MenuSubItemLocal | null>();
    for (const slug of byParentSlug.keys()) {
      const hit = subItems.find(
        (s) =>
          !s.parentService?.slug &&
          s.linkType === 'service' &&
          s.service?.slug === slug
      );
      explicitParentBySlug.set(slug, hit ?? null);
    }

    const skipUngroupedKeys = new Set<string>();
    for (const row of explicitParentBySlug.values()) {
      if (row) skipUngroupedKeys.add(row._key);
    }

    const renderedParentSlug = new Set<string>();
    const out: ReactNode[] = [];

    for (const sub of subItems) {
      const slug = sub.parentService?.slug;
      if (!slug) {
        if (skipUngroupedKeys.has(sub._key)) continue;
        const node = renderNestedSubMenuRow(topMenuItemKey, ancestorExpandPath, sub);
        if (node) out.push(node);
        continue;
      }

      if (renderedParentSlug.has(slug)) continue;
      renderedParentSlug.add(slug);

      const explicitParent = explicitParentBySlug.get(slug) ?? null;
      const children = byParentSlug.get(slug) ?? [];

      const parentRow =
        explicitParent != null ? (
          renderNestedSubMenuRow(topMenuItemKey, ancestorExpandPath, explicitParent)
        ) : (
          <Link
            key={`parent-synthetic-${slug}-${topMenuItemKey}`}
            href={resolveServiceHref(slug)}
            className="inline-flex justify-start items-center gap-2.5 menu-item-hover"
            style={{ cursor: 'pointer' }}
            onClick={handleMenuItemClick}
          >
            {renderMenuLabel(sub.parentService!.title?.trim() || slug)}
          </Link>
        );

      out.push(
        <div key={`parent-group-${slug}-${topMenuItemKey}`} className="flex flex-col w-full">
          {parentRow}
          <div className="flex flex-col pl-6">
            {children.map((child) => renderNestedSubMenuRow(topMenuItemKey, ancestorExpandPath, child))}
          </div>
        </div>
      );
    }

    return out;
  }

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
          className={`absolute top-0 left-0 bg-white transform w-full md:w-[450px] h-full z-20 ${
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
                          <span className="menu-label-text">{item.label}</span>
                          <span
                            className="text-[18px] md:text-[24px] menu-expander-symbol"
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
                     <div className="flex flex-col pl-6">
                              {renderGroupedExpanderSubItems(
                                key,
                                [],
                                item.subItems as MenuSubItemLocal[]
                              )}
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
                    </div>
                  );
                }

                if (item.linkType === 'custom' && item.url) {
                  if (parseHashHref(normalizeHashHref(item.url))) {
                    return renderHashMenuLink(key, item.label, item.url);
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