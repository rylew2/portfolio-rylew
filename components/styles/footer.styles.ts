import { css } from "@emotion/core";
import styled from "@emotion/styled";
import { Codepen, GitHub, Twitter } from "react-feather";

export const StyledFooterSection = styled.footer`
  background: url("cork-wallet.png");

  .footer-container {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 20px 0px;
  }

  .footerSocialLinks {
    display: flex;
    margin: auto;
    margin-bottom: 1em;
  }

  .footerSocialLink {
    display: block;
    margin-right: 0.5em;
  }

  .about-site {
    text-align: center;
    max-width: 400px;
    font-size: 0.9em;
    margin-right: auto;
    margin-left: auto;
  }
`;

const IconStyles = css`
  height: 1.2em;
  width: 1.2em;
`;

export const GitHubIcon = styled(GitHub)`
  ${IconStyles}
`;
export const TwitterIcon = styled(Twitter)`
  ${IconStyles}
`;
export const CodepenIcon = styled(Codepen)`
  ${IconStyles}
`;
