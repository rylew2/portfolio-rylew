import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { HTMLAttributes } from 'react';

interface IStyledHamburger extends HTMLAttributes<HTMLButtonElement> {
  menuOpen: boolean;
}

const fadeDown = keyframes`
    0% {
        transform: translateY(-10px);
        opacity: .3;
    }
    100% {
        transform: translateY(0px);
        opacity: 1;
    }
    
`;

export const NavSection = styled.header`
  background: var(--nav-bg) !important;
  background-image: var(--nav-bg) !important;
  background-size: cover;
  background-repeat: repeat;
  padding-top: 1em;
  padding-bottom: 1em;
  margin-bottom: 3em;

  position: relative;
  z-index: 10;

  .navLeft-title {
    color: var(--nav-foreground);
    &:hover {
      color: var(--text-color-bright);
    }
  }

  .no-underline {
    color: var(--nav-foreground);

    &:hover {
      color: var(--nav-link-hover);
    }
  }

  .navRight {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .navWrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .navHomeLink {
    display: inline-flex;
    align-items: center;
    text-decoration: none;

    &:hover {
    }
  }

  .navLinkList {
    display: none;
    list-style: none;
  }

  .navLinkItem {
    margin-right: 0.5em;
    font-weight: bold;

    &:last-child {
      margin-right: 0;
    }
    .navLinkAnchor {
      color: var(--nav-foreground);
    }
    .navLinkAnchor:hover {
      color: var(--nav-link-hover);
    }
  }

  .navLink {
    text-decoration: none;

    &:hover {
    }
  }

  .no-underline {
    display: flex;
    align-items: center;
  }

  .themeToggle {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--nav-foreground);

    &:focus-visible {
      outline: 2px solid var(--prim-color);
      outline-offset: 2px;
    }

    svg {
      height: 1.1rem;
      width: 1.1rem;
      stroke: currentColor;
    }
  }

  .themeToggle-track {
    height: 2.3rem;
    width: 4.2rem;
    border-radius: 999px;
    background: var(--surface-muted);
    border: 1px solid rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.35rem;
    position: relative;
    gap: 0.25rem;
    box-shadow:
      inset 0 0 0 1px rgba(0, 0, 0, 0.12),
      0 6px 16px rgba(0, 0, 0, 0.2);
  }

  .themeToggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-bright);
  }

  .themeToggle-icon--sun {
    color: #f7c948;
  }

  .themeToggle-thumb {
    position: absolute;
    top: 0.25rem;
    left: 0.25rem;
    height: 1.8rem;
    width: 1.8rem;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      transform var(--transition-duration) var(--transition-timing-function),
      background-color var(--transition-duration) var(--transition-timing-function);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }

  .themeToggle-thumb svg {
    height: 1rem;
    width: 1rem;
  }

  .themeToggle-thumb .themeToggle-icon--moon {
    display: none;
  }

  html[data-theme='dark'] & .themeToggle-track {
    background: #10141c;
    border-color: rgba(125, 177, 255, 0.35);
  }

  html[data-theme='dark'] & .themeToggle-thumb {
    transform: translateX(1.85rem);
    background: #253147;
    border-color: #2e3c57;
  }

  html[data-theme='dark'] & .themeToggle-thumb .themeToggle-icon--sun {
    display: none;
  }

  html[data-theme='dark'] & .themeToggle-thumb .themeToggle-icon--moon {
    display: inline-flex;
  }

  @media (min-width: 759px) {
    margin-bottom: 3em;

    .navLinkList {
      display: flex;
    }
  }
`;

export const StyledMobileNav = styled.section`
  background: var(--page-bg);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  animation: ${fadeDown} 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  .mobile-nav-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
  }

  .linkList {
    list-style-type: none;
  }
  .listItem {
    text-align: center;
    margin-bottom: 1em;
  }

  .link {
    font-size: 1.2em;
  }

  .themeToggle {
    background: transparent;
    border: none;
    color: var(--text-color);
    height: 2.5rem;
    width: 4.4rem;
    padding: 0;
    border-radius: 999px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .themeToggle-track {
    height: 2.5rem;
    width: 4.4rem;
    border-radius: 999px;
    background: var(--surface-muted);
    border: 1px solid rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.4rem;
    position: relative;
  }

  .themeToggle-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-bright);
  }

  .themeToggle-icon--sun {
    color: #f7c948;
  }

  .themeToggle-thumb {
    position: absolute;
    top: 0.3rem;
    left: 0.3rem;
    height: 1.9rem;
    width: 1.9rem;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.08);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition:
      transform var(--transition-duration) var(--transition-timing-function),
      background-color var(--transition-duration) var(--transition-timing-function);
  }

  .themeToggle-thumb svg {
    height: 1rem;
    width: 1rem;
  }

  .themeToggle-thumb .themeToggle-icon--moon {
    display: none;
  }

  html[data-theme='dark'] & .themeToggle-track {
    background: #10141c;
    border-color: rgba(125, 177, 255, 0.35);
  }

  html[data-theme='dark'] & .themeToggle-thumb {
    transform: translateX(1.9rem);
    background: #253147;
    border-color: #2e3c57;
  }

  html[data-theme='dark'] & .themeToggle-thumb .themeToggle-icon--sun {
    display: none;
  }

  html[data-theme='dark'] & .themeToggle-thumb .themeToggle-icon--moon {
    display: inline-flex;
  }
`;

export const StyledHamburger = styled.button<IStyledHamburger>`
  height: 2em;
  width: 2em;
  background: inherit;
  display: block;
  padding: 0.5em;
  border: 1px solid var(--nav-foreground);
  position: relative;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &::before,
  &::after {
    content: '';
    background: var(--nav-foreground);
    height: 2px;
    width: 100%;
    position: absolute;
    display: block;
    right: 0;
    transition: all 0.25s;
  }

  &:active,
  &:focus {
    outline-color: var(--nav-foreground);
  }

  &::before {
    top: ${({ menuOpen }) => (menuOpen ? '12px' : '8px')};
    transform: ${({ menuOpen }) => (menuOpen ? 'rotate(40deg)' : null)};
  }

  &::after {
    width: ${({ menuOpen }) => (menuOpen ? '100%' : '80%')};
    bottom: ${({ menuOpen }) => (menuOpen ? '12px' : '8px')};
    transform: ${({ menuOpen }) => (menuOpen ? 'rotate(-40deg)' : null)};
  }

  @media all and (min-width: 759px) {
    display: none;
  }
`;
