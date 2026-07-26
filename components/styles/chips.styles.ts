import styled from '@emotion/styled';
import { IContainer } from '../container';

export const StyledChip = styled.div<IContainer>`
  /* display: flex; */
  float: right;
  margin-right: 54px;
  height: 40px;

  ul {
    list-style-type: none;
    // margin: auto;
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
  }

  li {
    margin-right: 0.5em;
    font-size: 0.8em;
    /* background: #202020; */
    background: var(--chip-bg);
    border: 1px solid var(--chip-border);
    margin-bottom: 0.5em;
    transition:
      transform 0.15s,
      color 0.15s;

    a {
      color: var(--chip-text);
      padding: 0.35em 0.5em;
      display: inline-block;
    }
    a:hover {
      color: var(--chip-text-hover);
      text-decoration: none;
    }
    a {
      text-decoration: none;
    }
  }

  li:hover {
    box-shadow: 0 0 4px 2px var(--chip-shadow);
  }

  /* Tags are coloured by category rather than individually, so adding a tag to
     an existing category needs no style change. The category comes from
     config/tags.json via getTagCategory. */
  li.language {
    background: var(--tag-language-bg);
    border-color: var(--tag-language-border);

    a,
    a:hover {
      color: var(--tag-language-text);
    }
  }

  li.framework {
    background: var(--tag-framework-bg);
    border-color: var(--tag-framework-border);

    a,
    a:hover {
      color: var(--tag-framework-text);
    }
  }

  li.ml {
    background: var(--tag-ml-bg);
    border-color: var(--tag-ml-border);

    a,
    a:hover {
      color: var(--tag-ml-text);
    }
  }

  li.practice {
    background: var(--tag-practice-bg);
    border-color: var(--tag-practice-border);

    a,
    a:hover {
      color: var(--tag-practice-text);
    }
  }

  li.domain {
    background: var(--tag-domain-bg);
    border-color: var(--tag-domain-border);

    a,
    a:hover {
      color: var(--tag-domain-text);
    }
  }
`;
