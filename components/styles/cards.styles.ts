import styled from '@emotion/styled';

export const StyledCards = styled.section`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  h2 {
    color: var(--header-title);
  }
  p {
    color: var(--text-color-dark);
  }

  .card-demo-link {
    margin: 10px 10px;

    a {
      float: right;
      margin-left: 1px;
    }

    button {
      background: var(--button-bg) !important;
      background-image: var(--button-bg) !important;
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

  article.article {
    margin: 0 0 2%;
    overflow: hidden;

    &:hover h2 {
      /* color: #fff; */
      color: var(--text-color-black);
    }
    &:hover p {
      color: var(--text-color-bright);
    }

    img {
      transition: all var(--animation-duration)
        var(--transition-timing-function);
      /* object-fit: cover; */
      object-fit: contain;
    }

    &:hover img {
      transform: scale(1.1);
    }

    @media all and (min-width: 560px) {
      margin-right: 0.5em;
      flex: 0 1 48%;

      &:last-child {
        margin-right: 0;
      }
    }

    @media all and (min-width: 1024px) {
      flex: 0 1 32.5%;
      img {
        /* height: 180px; */
      }
    }
  }

  @media all and (min-width: 560px) {
    justify-content: space-between;
    flex-direction: row;
  }

  time {
    color: var(--text-color-bright);
    font-size: 0.9em;
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }

    &:hover h2 {
      text-decoration: underline;
      color: var(--text-color-white);
    }
  }

  h2 {
    font-size: 1.17em;
    margin-bottom: 0.3em;
  }

  img {
    width: 100%;
    /* object-fit: cover; */
    object-fit: contain;
    margin-bottom: 0.4em;
    transform: scale(1);
    transition: 5s all;
  }

  @media all and (min-width: 560px) {
    justify-content: flex-start;
    flex-direction: row;
  }
`;
