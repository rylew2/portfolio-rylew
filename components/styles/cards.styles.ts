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
    /* Bounds the .card-link overlay to this card. */
    position: relative;
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

    /* The hit area is the whole card, so the focus ring belongs on the card
       rather than around the title text. Outline follows border-radius. */
    &:has(.card-link:focus-visible) {
      outline: 2px solid var(--prim-color);
      outline-offset: 2px;
    }
  }

  /* The title link stretches to cover the entire card, making the padding,
     date and description clickable. The demo buttons opt back out below. */
  .card-link::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  /* Paired with the card-level ring above; without it both would show. */
  .card-link:focus-visible {
    outline: none;
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
    /* Sits above the stretched .card-link overlay so these external links stay
       clickable instead of being swallowed by the card-wide hit area. */
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 0.3em;
    margin-bottom: 0.5em;

    time {
      margin-right: auto;
    }

    /* Anchors styled as buttons, not anchors wrapping buttons -- see the note
       in cards.tsx. min-height keeps the hit area at the 24px target-size
       minimum now that the anchor is the control rather than a collapsed
       inline box around one. */
    a.card-action {
      display: inline-flex;
      align-items: center;
      min-height: 24px;
      background: var(--button-bg);
      border: 1px solid var(--border-color);
      border-radius: 5px;
      padding: 4px 10px;
      font-size: 0.8em;
      font-weight: bold;
      line-height: 1.2;
      color: var(--button-text);
      text-decoration: none;

      &:hover {
        background: var(--button-bg-hover);
        cursor: pointer;
        color: var(--button-text-hover);
      }

      &:focus-visible {
        outline: 2px solid var(--prim-color);
        outline-offset: 2px;
      }
    }

    /* Each action carries its own colour so a row of cards can be scanned for
       "has a live demo" without reading the labels. Hover fills with the
       darker -text shade rather than the border hue, which would fail AA. */
    a.demo {
      background: var(--action-demo-bg);
      border-color: var(--action-demo-border);
      color: var(--action-demo-text);

      &:hover {
        background: var(--action-demo-text);
        color: var(--action-text-hover);
      }
    }

    a.source {
      background: var(--action-source-bg);
      border-color: var(--action-source-border);
      color: var(--action-source-text);

      &:hover {
        background: var(--action-source-text);
        color: var(--action-text-hover);
      }
    }

    a.presentation {
      background: var(--action-presentation-bg);
      border-color: var(--action-presentation-border);
      color: var(--action-presentation-text);

      &:hover {
        background: var(--action-presentation-text);
        color: var(--action-text-hover);
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
