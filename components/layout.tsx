import React, { useState, createContext, ReactNode, useEffect } from 'react';
import Head from 'next/head';
import SiteConfig from '../config/index.json';

import { StyledMain } from './styles/layout.styles';
import Header from './header/header';
import Footer from './footer/footer';
import Nav from './nav/nav';
import MobileNav from './nav/mobile-nav';

interface ILayout {
  children: ReactNode;
  pathname: string;
  pageTitle: string;
  pageDescription?: string;
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
  pathname,
  pageTitle,
  pageDescription,
}: ILayout) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>('light');

  const toggleMenuOpen = () => {
    menuOpen ? setMenuOpen(false) : setMenuOpen(true);
  };

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedTheme = window.localStorage.getItem('theme') as ThemeMode | null;
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme ?? (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('theme', theme);
    } catch {
      // Ignore storage errors (private mode, blocked storage, etc.)
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('pre').forEach((node) => {
      node.setAttribute('tabindex', '0');
    });
  }, [pathname]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MenuContext.Provider value={{ menuOpen, toggleMenuOpen }}>
        <Head>
          <title>{`${pageTitle} | ${SiteConfig.site.siteTitle}`}</title>
          <meta
            name="keywords"
            content={SiteConfig.site.keywords}
            key="keywords"
          />
          <meta
            name="description"
            key="description"
            content={pageDescription || SiteConfig.site.siteDescription}
          />

          {/* og tags */}
          <meta property="og:title" content={pageTitle} key="ogtitle" />
          <meta
            property="og:description"
            content={pageDescription || SiteConfig.site.siteDescription}
            key="ogdesc"
          />
          <meta
            property="og:url"
            content={SiteConfig.site.siteUrl}
            key="ogurl"
          />
          <meta
            property="og:image"
            content={SiteConfig.site.siteImage}
            key="ogimage"
          />
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

          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Nav />
        {menuOpen ? (
          <MobileNav />
        ) : (
          <>
            <Header pathname={pathname} title={pageTitle} />
            <StyledMain>{children}</StyledMain>
            <Footer />
          </>
        )}
      </MenuContext.Provider>
    </ThemeContext.Provider>
  );
};

export { Layout };
