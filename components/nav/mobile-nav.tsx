import Link from 'next/link';
import React, { useContext } from 'react';
import { StyledMobileNav } from '../styles/nav.styles';
import { navLinks as mobileNavLinks } from './nav';
import { ThemeContext } from '..';

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
            <button
              type="button"
              className="themeToggle"
              onClick={toggleTheme}
              aria-pressed={theme === 'dark'}
              aria-label="Toggle dark mode"
            >
              <span className="sr-only">Toggle dark mode</span>
              <span className="themeToggle-track" aria-hidden="true">
                <span className="themeToggle-icon themeToggle-icon--sun">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
                  </svg>
                </span>
                <span className="themeToggle-thumb">
                  <svg
                    className="themeToggle-icon themeToggle-icon--sun"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="1.8"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
                  </svg>
                  <svg
                    className="themeToggle-icon themeToggle-icon--moon"
                    viewBox="0 0 324.694 324.694"
                    fill="currentColor"
                  >
                    <path d="M291.396 287.685c-.646-3.021-3.045-5.356-6.077-5.925-58.351-11.019-104.084-55.646-116.517-113.696-12.433-58.06 11.013-117.502 59.735-151.451 2.531-1.761 3.759-4.876 3.115-7.894-.647-3.018-3.046-5.355-6.078-5.933-21.053-3.976-42.939-3.691-64.052.824-42.397 9.078-78.725 34.122-102.286 70.528-23.559 36.397-31.535 79.792-22.454 122.189 15.926 74.377 82.62 128.361 158.579 128.367h.017c11.396 0 22.88-1.221 34.129-3.625 21.267-4.554 41.042-13.129 58.772-25.484 2.538-1.768 3.762-4.884 3.117-7.9ZM226.294 306.07c-10.197 2.18-20.597 3.288-30.916 3.288h-.013c-68.777-.008-129.161-48.891-143.581-116.244-8.224-38.391-1.004-77.68 20.33-110.642 21.333-32.96 54.227-55.646 92.621-63.861 10.181-2.187 20.58-3.288 30.9-3.288 3.119 0 6.245.097 9.365.299-43.655 38.534-63.604 97.721-51.202 155.652 12.41 57.93 54.851 103.759 110.463 121.029-11.885 6.294-24.598 10.906-37.967 13.767Z" />
                  </svg>
                </span>
                <span className="themeToggle-icon themeToggle-icon--moon">
                  <svg
                    viewBox="0 0 324.694 324.694"
                    fill="currentColor"
                  >
                    <path d="M291.396 287.685c-.646-3.021-3.045-5.356-6.077-5.925-58.351-11.019-104.084-55.646-116.517-113.696-12.433-58.06 11.013-117.502 59.735-151.451 2.531-1.761 3.759-4.876 3.115-7.894-.647-3.018-3.046-5.355-6.078-5.933-21.053-3.976-42.939-3.691-64.052.824-42.397 9.078-78.725 34.122-102.286 70.528-23.559 36.397-31.535 79.792-22.454 122.189 15.926 74.377 82.62 128.361 158.579 128.367h.017c11.396 0 22.88-1.221 34.129-3.625 21.267-4.554 41.042-13.129 58.772-25.484 2.538-1.768 3.762-4.884 3.117-7.9ZM226.294 306.07c-10.197 2.18-20.597 3.288-30.916 3.288h-.013c-68.777-.008-129.161-48.891-143.581-116.244-8.224-38.391-1.004-77.68 20.33-110.642 21.333-32.96 54.227-55.646 92.621-63.861 10.181-2.187 20.58-3.288 30.9-3.288 3.119 0 6.245.097 9.365.299-43.655 38.534-63.604 97.721-51.202 155.652 12.41 57.93 54.851 103.759 110.463 121.029-11.885 6.294-24.598 10.906-37.967 13.767Z" />
                  </svg>
                </span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </StyledMobileNav>
  );
};

export default MobileNav;
