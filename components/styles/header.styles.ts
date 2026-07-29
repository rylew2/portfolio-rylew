import styled from '@emotion/styled';

export const StyledHomeHeading = styled.section`
  h1 {
    color: var(--header-title);
  }

  .identity {
    margin-bottom: 0.75rem;
    color: var(--text-color);
    font-weight: 600;
  }

  .description {
    max-width: 42rem;
  }

  .hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .hero-actions a {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    padding: 0.65rem 1rem;
    border: 1px solid var(--prim-color);
    border-radius: 5px;
    color: var(--prim-color);
    font-weight: bold;
    line-height: 1.2;
    text-decoration: none;

    &:hover {
      background: var(--surface-muted);
      color: var(--link-hover);
    }

    &:focus-visible {
      outline: 2px solid var(--prim-color);
      outline-offset: 2px;
    }
  }

  .hero-actions .primary {
    background: var(--prim-color);
    color: var(--surface);

    &:hover {
      background: var(--link-hover);
      color: var(--surface);
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
