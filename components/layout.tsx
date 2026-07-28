import React, { useState, createContext, ReactNode, useEffect } from 'react';
import Head from 'next/head';
import SiteConfig from '../config/index.json';

import { StyledMain } from './styles/layout.styles';
import Header from './header/header';
import Footer from './footer/footer';
import Nav from './nav/nav';
import MobileNav from './nav/mobile-nav';
import { ChatWidget } from './chat';

interface ILayout {
  children: ReactNode;
  canonicalPath: string;
  pageTitle: string;
  pageDescription?: string;
  ogType?: 'website' | 'article';
}

interface MenuContextType {
  menuOpen: boolean;
  toggleMenuOpen: () => void;
}

export const MenuContext = createContext<MenuContextType>({
  menuOpen: false,
  toggleMenuOpen: () => {},
});

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

const Layout = ({
  children,
  canonicalPath,
  pageTitle,
  pageDescription,
  ogType = 'website',
}: ILayout) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const canonicalUrl = new URL(canonicalPath, SiteConfig.site.siteUrl);
  canonicalUrl.search = '';
  canonicalUrl.hash = '';

  const canonicalHref = canonicalUrl.toString();
  const description = pageDescription || SiteConfig.site.siteDescription;
  const socialImage = new URL(
    SiteConfig.site.siteImage,
    SiteConfig.site.siteUrl
  ).toString();

  const toggleMenuOpen = () => {
    menuOpen ? setMenuOpen(false) : setMenuOpen(true);
  };

  const toggleTheme = () => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try {
        window.localStorage.setItem('theme', next);
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedTheme = window.localStorage.getItem(
      'theme'
    ) as ThemeMode | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme ?? (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('pre').forEach((node) => {
      node.setAttribute('tabindex', '0');
    });
  }, [canonicalPath]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MenuContext.Provider value={{ menuOpen, toggleMenuOpen }}>
        <Head>
          <title>
            {pageTitle === SiteConfig.site.siteTitle
              ? SiteConfig.site.siteTitle
              : `${pageTitle} | ${SiteConfig.site.siteTitle}`}
          </title>
          <meta
            name="keywords"
            content={SiteConfig.site.keywords}
            key="keywords"
          />
          <meta name="description" key="description" content={description} />
          <link rel="canonical" href={canonicalHref} key="canonical" />

          {/* og tags */}
          <meta property="og:title" content={pageTitle} key="ogtitle" />
          <meta property="og:description" content={description} key="ogdesc" />
          <meta property="og:url" content={canonicalHref} key="ogurl" />
          <meta property="og:type" content={ogType} key="ogtype" />
          <meta property="og:image" content={socialImage} key="ogimage" />
          <meta
            property="og:site_name"
            content={SiteConfig.site.siteName}
            key="ogsitename"
          />

          {/* Twitter Cards */}
          <meta name="twitter:card" content="summary" key="twcard" />
          <meta
            name="twitter:creator"
            content={SiteConfig.author.twitterHandle}
            key="twhandle"
          />
          <meta name="twitter:title" content={pageTitle} key="twtitle" />
          <meta
            name="twitter:description"
            content={description}
            key="twdescription"
          />
          <meta name="twitter:image" content={socialImage} key="twimage" />

          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Nav />
        <Header pathname={canonicalPath} title={pageTitle} />
        {/* tabIndex lets the skip link actually move focus here, not just
            scroll. main:focus drops the ring -- see layout.css. */}
        <StyledMain id="main" tabIndex={-1}>
          {children}
        </StyledMain>
        <Footer />
        {/* Rendered last and positioned over the page rather than replacing
            it, so the content above stays in the DOM while the menu is open. */}
        {menuOpen && <MobileNav />}
        <ChatWidget />
      </MenuContext.Provider>
    </ThemeContext.Provider>
  );
};

export { Layout };
