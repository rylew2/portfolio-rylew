import styled from '@emotion/styled';
export const StyledAbout = styled.section`
  /* The intro is a two-column row rather than a floated avatar. A float would
     wrap the sections below the intro around the image as well. */
  .aboutIntro {
    display: flex;
    align-items: flex-start;
    gap: 1.75em;
  }

  .avatarImage {
    flex: 0 0 auto;
    border-radius: 50%;
    width: 200px;
    height: 200px;

    img {
      border-radius: 50%;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  .introText {
    flex: 1 1 auto;

    p {
      margin-top: 0;
    }
  }

  .positioning {
    font-weight: 600;
    font-size: 1.1em;
    color: var(--prim-color);
    margin-bottom: 0.6em;
  }

  .aboutSection {
    margin-top: 2.5em;

    h2 {
      font-size: 1.25em;
      margin-bottom: 0.4em;
      padding-bottom: 0.3em;
      border-bottom: 2px solid var(--border-color);
    }
  }

  .resumeLink {
    display: inline-block;
    padding: 0.4em 0.9em;
    border: 1px solid var(--border-color);
    color: var(--prim-color);
    font-weight: 600;
    text-decoration: none;

    &:hover {
      border-color: var(--prim-color);
    }
  }

  .timeline,
  .credentials {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
  }

  .timeline li,
  .credentials li {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.2em 0.75em;
    padding: 0.7em 0;
    border-bottom: 1px solid var(--border-color);
  }

  .timeline li:last-child,
  .credentials li:last-child {
    border-bottom: none;
  }

  .entryPrimary {
    font-weight: 600;
  }

  .entrySecondary,
  .entryMeta {
    color: var(--text-color-bright);
  }

  .entryMeta {
    margin-left: auto;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }

  .experienceHighlights {
    flex-basis: 100%;
    margin: 0.15em 0 0;
    padding-left: 1.25em;

    li {
      padding: 0.15em 0;
    }
  }

  .skillGroups {
    margin: 0;
  }

  .skillGroup {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.4em 1em;
    padding: 0.6em 0;
    border-bottom: 1px solid var(--border-color);

    &:last-child {
      border-bottom: none;
    }

    dt {
      flex: 0 0 9em;
      font-weight: 600;
    }

    dd {
      flex: 1 1 12em;
      margin: 0;
    }
  }

  /* Matches the tag chips elsewhere on the site, minus the link behaviour. */
  .skillPills {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.4em;
    padding-left: 0;
    margin: 0;

    li {
      font-size: 0.85em;
      padding: 0.25em 0.55em;
      background: var(--chip-bg);
      border: 1px solid var(--chip-border);
      color: var(--chip-text);
    }
  }

  @media (max-width: 759px) {
    .aboutIntro {
      flex-direction: column;
      align-items: center;
      gap: 1em;
      text-align: left;
    }

    .avatarImage {
      width: 150px;
      height: 150px;
    }

    /* Stacked rows read better than a squeezed two-column layout, so the date
       column drops below the entry instead of being pushed to the right edge. */
    .timeline li,
    .credentials li {
      flex-direction: column;
      gap: 0.15em;
    }

    .entryMeta {
      margin-left: 0;
    }

    .experienceHighlights {
      padding-left: 1.1em;
    }

    .skillGroup dt {
      flex-basis: 100%;
    }
  }
`;
