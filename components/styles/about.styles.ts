import styled from '@emotion/styled'

export const StyledAbout = styled.section`
    .avatarImage {
        margin-right: 2em;
        float: left;
        shape-outside: circle();

        img {
            border-radius: 100%;
        }
    }

    @media (min-width: 759px) {
        .avatarImage {
            margin-right: 4em;
        }
    }

    @media (min-width: 1400px) {
        .avatarImage {
            img {
                width: 210px;
            }
        }
    }
`
