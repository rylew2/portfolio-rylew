import styled from '@emotion/styled';

export const StyledCards = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5em;

  @media all and (min-width: 560px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media all and (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  article.article {
    display: flex;
    flex-direction: column;
    background: var(--surface);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    overflow: hidden;
    transition:
      transform var(--animation-duration) var(--transition-timing-function),
      box-shadow var(--animation-duration) var(--transition-timing-function);

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    &:hover .card-image img {
      transform: scale(1.04);
    }
  }

  .card-image {
    display: block;
    aspect-ratio: 45 / 22;
    background: var(--surface-muted);
    border-bottom: 1px solid var(--border-color);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      margin: 0;
      transition: transform var(--animation-duration)
        var(--transition-timing-function);
    }
  }

  .card-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0.9em 1em 1.1em;

    p {
      margin-bottom: 0;
    }
  }

  .card-demo-link {
    display: flex;
    align-items: center;
    gap: 0.3em;
    margin-bottom: 0.5em;

    time {
      margin-right: auto;
    }

    button {
      background: var(--button-bg);
      border: 1px solid var(--border-color);
      border-radius: 5px;
      padding: 4px 10px;
      font-weight: bold;
      color: var(--button-text);
      &:hover {
        background: var(--button-bg-hover);
        cursor: pointer;
        color: var(--button-text-hover);
      }
    }
  }

  h2 {
    font-size: 1.17em;
    margin-bottom: 0.3em;
    color: var(--header-title);
  }

  p {
    color: var(--text-color);
  }

  time {
    color: var(--text-color-dark);
    font-size: 0.9em;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }

    &:hover h2 {
      text-decoration: underline;
      color: var(--prim-color);
    }
  }
`;
