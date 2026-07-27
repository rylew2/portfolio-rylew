import styled from '@emotion/styled';

export const StyledHomeHeading = styled.section`
  h1 {
    color: var(--header-title);
  }

  .role {
    color: var(--text-color-dark);
    font-weight: 600;
    margin: 0.5rem 0;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 1.5rem;
  }

  .hero-actions a {
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    color: var(--text-color);
    font-weight: 600;
    padding: 0.6rem 1rem;
    text-decoration: none;
  }

  .hero-actions a:first-of-type {
    background: var(--header-title);
    border-color: var(--header-title);
    color: var(--page-bg);
  }

  .hero-actions a:hover {
    color: var(--header-title);
  }

  .hero-actions a:first-of-type:hover {
    color: var(--page-bg);
  }

  .hero-actions a:focus-visible {
    outline: 3px solid var(--header-title);
    outline-offset: 3px;
  }

  @media (max-width: 559px) {
    .hero-actions a {
      flex: 1 1 100%;
      text-align: center;
    }
  }

  @media (min-width: 1024px) {
    .header-container {
      max-width: 70%;
    }
    .description {
      font-size: 1.2em;
    }
  }

  @media (min-width: 1336px) {
    .header-container {
      max-width: 80%;
    }
  }
`;

export const StyledPageHeading = styled.section`
  text-align: center;
  h1 {
    color: var(--header-title);
  }

  h2:hover {
    color: var(--header-title);
  }

  &.page h1 {
    max-width: 80%;
    text-align: center;
    margin: 0 auto 1rem;
  }

  .about-header {
    font-size: 1.75em;
    text-align: center;
    margin: 1.5em 0;
  }

  /* @media screen and (min-width: 560px) {
    font-size: 2.5em;
  } */

  @media (max-width: 769px) {
    &.page h1 {
      font-size: 2.2em;
    }
  }
`;
