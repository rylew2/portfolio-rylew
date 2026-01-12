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
    background: #dedede;
    font-weight: 600;
  }

  time {
    text-align: center;
    display: block;
    margin-bottom: 8px;
    float: left;
    margin-left: 58px;
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
`;
