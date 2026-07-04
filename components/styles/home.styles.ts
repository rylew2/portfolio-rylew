import styled from '@emotion/styled';

export const StyledIndexPage = styled.section`
  h1 {
    word-spacing: -10px;
  }

  @media (min-width: 1024px) {
    h1 {
      word-spacing: -20px;
    }
  }

  .work-filter {
    display: flex;
    justify-content: center;
    gap: 0.5em;
    margin-bottom: 1.5em;

    button {
      background: var(--chip-bg);
      color: var(--chip-text);
      border: 1px solid var(--chip-border);
      border-radius: 999px;
      padding: 0.35em 1em;
      font-family: inherit;
      font-size: 0.9em;
      font-weight: 500;
      cursor: pointer;
      transition:
        background-color var(--transition-duration)
          var(--transition-timing-function),
        color var(--transition-duration) var(--transition-timing-function);

      &:hover {
        border-color: var(--prim-color);
        color: var(--prim-color);
      }

      &.active {
        background: var(--prim-color);
        border-color: var(--prim-color);
        /* --page-bg flips with the theme, so this stays high-contrast on the
           primary color in both modes (near-white on dark blue in light mode,
           near-black on light blue in dark mode) */
        color: var(--page-bg);
      }

      &:focus-visible {
        outline: 2px solid var(--prim-color);
        outline-offset: 2px;
      }
    }
  }
`;
