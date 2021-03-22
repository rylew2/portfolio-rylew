import styled from "@emotion/styled";

export const StyledContent = styled.section`
  ul,
  ol {
    padding-left: 1em;
    margin-bottom: 1em;
  }

  code {
  }

  time {
    text-align: center;
    display: block;
    margin-bottom: 8px;
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
  }
`;
