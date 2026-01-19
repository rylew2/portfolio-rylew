import Link from 'next/link';
import React, { useContext } from 'react';
import { StyledMobileNav } from '../styles/nav.styles';
import { navLinks as mobileNavLinks } from './nav';
import { ThemeContext } from '..';
import ThemeToggle from '../theme-toggle';

const MobileNav = () => {
  const themeContext = useContext(ThemeContext);
  const { theme, toggleTheme } = themeContext;

  return (
    <StyledMobileNav>
      <div className="mobile-nav-container">
        <ul className="linkList">
          {mobileNavLinks.map((item, idx) => {
            return (
              <li key={idx} className="listItem">
                {item.link ? (
                  <Link href={item.link} className="link">
                    {item.title}
                  </Link>
                ) : (
                  <a
                    className="link"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.title}
                  </a>
                )}
              </li>
            );
          })}
          <li className="listItem">
            <ThemeToggle isDark={theme === 'dark'} onToggle={toggleTheme} />
          </li>
        </ul>
      </div>
    </StyledMobileNav>
  );
};

export default MobileNav;
