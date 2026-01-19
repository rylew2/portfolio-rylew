import styled from '@emotion/styled';

export const StyledContent = styled.section`
  ul,
  ol {
    padding-left: 1em;
    margin-bottom: 1em;
  }

  // backtick tagged code in project / blog posts
  p code,
  li code {
    background: var(--code-bg);
    color: var(--code-text);
    font-weight: 600;
  }

  p a,
  li a {
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 0.15em;
  }

  time {
    text-align: center;
    display: block;
    margin-bottom: 8px;
    float: left;
    margin-left: 58px;
    color: var(--text-color-bright);
  }

  img {
    margin-bottom: 1em;
    display: block;
    /* object-fit: cover; */
    object-fit: contain;
  }
  ul ul,
  ol ol {
    margin-bottom: 0;
  }
  li {
    margin-bottom: 0.5em;
  }

  pre code {
    overflow: hidden;
    background: none;
  }

  pre {
    overflow-x: auto;
  }

  .token.property,
  .token.literal-property {
    color: #ffd166;
  }

  blockquote a {
    color: var(--callout-link);
  }

  blockquote a:hover {
    color: var(--text-color-white);
  }

  blockquote b {
    color: var(--callout-label);
  }

  .callout-icon {
    width: 25px;
    vertical-align: middle;
    margin-right: 0.25rem;
  }

  .callout-icon.demo {
    color: var(--callout-demo);
  }

  .callout-icon.source {
    color: var(--callout-source);
  }

  .callout-icon.presentation {
    color: var(--callout-presentation);
  }
`;
