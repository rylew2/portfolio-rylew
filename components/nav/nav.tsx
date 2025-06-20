import Link from 'next/link';
import React, { useContext } from 'react';
import { MenuContext } from '..';
import SiteConfig from '../../config/index.json';
import { Container } from '../container';
import Logo from '../logo';
import { NavSection, StyledHamburger } from '../styles/nav.styles';

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

  const { toggleMenuOpen, menuOpen } = menuContext;

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
            <StyledHamburger
              menuOpen={menuOpen}
              onClick={toggleMenuOpen}
            ></StyledHamburger>

            <ul className="navLinkList">
              {navLinks.map((item, idx) => {
                return (
                  <li key={idx} className="navLinkItem">
                    {item.link ? (
                      <Link href={item.link} className="navLinkAnchor">
                        {item.title}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener norefferer"
                        className="navLinkAnchor"
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
      </Container>
    </NavSection>
  );
};

export default Nav;
