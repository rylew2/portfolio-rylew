import Link from 'next/link';
import React, { useContext, useEffect, useRef } from 'react';
import { MenuContext } from '..';
import { StyledHamburger, StyledMobileNav } from '../styles/nav.styles';
import { navLinks as mobileNavLinks } from './nav';

const FOCUSABLE = 'a[href], button:not([disabled])';

/**
 * Full-screen menu for narrow viewports.
 *
 * It renders *over* the page rather than in place of it. Swapping it for the
 * page content used to unmount <main>, the <h1> and the footer, which left
 * screen reader users with nothing to read and no landmark to return to.
 *
 * Because aria-modal hides everything behind the overlay from assistive tech,
 * including the nav bar's hamburger, the menu carries its own close button.
 */
const MobileNav = () => {
  const { toggleMenuOpen } = useContext(MenuContext);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    return () => {
      body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, []);

  // The hamburger is display:none from 759px up, so crossing the breakpoint
  // with the menu open would strand the overlay with no visible way out.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 759px)');
    const closeOnDesktop = () => {
      if (query.matches) toggleMenuOpen();
    };
    query.addEventListener('change', closeOnDesktop);
    return () => query.removeEventListener('change', closeOnDesktop);
  }, [toggleMenuOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      toggleMenuOpen();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <StyledMobileNav
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={handleKeyDown}
    >
      <nav aria-label="Site">
        <div className="mobile-nav-bar">
          <StyledHamburger
            menuOpen
            onClick={toggleMenuOpen}
            aria-label="Close menu"
            aria-expanded
            aria-controls="mobile-menu"
          />
        </div>

        <div className="mobile-nav-container">
          <ul className="linkList">
            {mobileNavLinks.map((item, idx) => {
              return (
                <li key={idx} className="listItem">
                  {item.link ? (
                    <Link
                      href={item.link}
                      className="link"
                      onClick={toggleMenuOpen}
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <a
                      className="link"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={toggleMenuOpen}
                    >
                      {item.title}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </StyledMobileNav>
  );
};

export default MobileNav;
