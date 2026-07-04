import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { MenuContext, ThemeContext } from '..';
import SiteConfig from '../../config/index.json';
import { Container } from '../container';
import Logo from '../logo';
import { NavSection, StyledHamburger } from '../styles/nav.styles';
import ThemeToggle from '../theme-toggle';

export const navLinks = [
  { title: 'Projects', link: '/projects' },
  { title: 'Books', link: '/books' },
  { title: 'About', link: '/about' },
  {
    title: 'Source',
    href: 'https://github.com/rylew2/portfolio-rylew',
  },
];

const Nav = () => {
  const menuContext = useContext(MenuContext);
  const themeContext = useContext(ThemeContext);
  const router = useRouter();

  const { toggleMenuOpen, menuOpen } = menuContext;
  const { theme, toggleTheme } = themeContext;

  const isActive = (link: string) =>
    router.pathname === link || router.pathname.startsWith(`${link}/`);

  return (
    <NavSection>
      <Container>
        <nav className="navWrapper">
          <div className="navLeft">
            <Link href="/" className="no-underline">
              <Logo />
              <span className="navLeft-title">{SiteConfig.author.name}</span>
            </Link>
          </div>

          <div className="navRight">
            <ul className="navLinkList">
              {navLinks.map((item, idx) => {
                return (
                  <li key={idx} className="navLinkItem">
                    {item.link ? (
                      <Link
                        href={item.link}
                        className={`navLinkAnchor${
                          isActive(item.link) ? ' active' : ''
                        }`}
                        aria-current={isActive(item.link) ? 'page' : undefined}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="navLinkAnchor"
                      >
                        {item.title}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            <ThemeToggle isDark={theme === 'dark'} onToggle={toggleTheme} />
            <StyledHamburger
              menuOpen={menuOpen}
              onClick={toggleMenuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            ></StyledHamburger>
          </div>
        </nav>
      </Container>
    </NavSection>
  );
};

export default Nav;
