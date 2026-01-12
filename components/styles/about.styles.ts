import styled from '@emotion/styled';
export const StyledAbout = styled.section`
  .avatarImage {
    float: left;
    shape-outside: circle(50%);
    border-radius: 50%;
    width: 200px;
    height: 200px;
    margin-right: 1em;
    margin-bottom: 1em; // Ensure there's space below the image when text wraps under it

    img {
      border-radius: 50%;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  @media (max-width: 759px) {
    .avatarImage {
      width: 150px; // Smaller size for narrow screens
      height: 150px;
      margin-right: 1em;
    }
  }
`;
