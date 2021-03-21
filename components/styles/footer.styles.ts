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

  .linkedin:hover,
  .github:hover,
  .envelope:hover {
    color: hsl(0, 0%, 100%);
  }

  /* Facebook*/
  .facebook {
    color: hsl(221, 44%, 41%);
    border-color: hsl(221, 44%, 41%);
    background: #f8f8fb;
  }

  .facebook:hover {
    background-color: hsl(221, 44%, 41%);
  }

  /*End Facebook*/

  /* LinkedIn*/
  .linkedin {
    /* color: #0e78aa; */
    color: #154475;
    border-color: hsl(199, 85%, 36%);
    /* background: white; */
  }

  .linkedin:hover {
    background-color: hsl(199, 85%, 36%);
  }
  /* End LinkedIn*/

  /* Github */
  .github {
    color: #000000;
    border-color: hsl(221, 44%, 41%);
    /* background: white; */
  }

  .github:hover {
    background-color: #4078c0;
  }
  /* Github */

  /* Mail */
  .envelope {
    color: #9e9e9e;
    /* background: white; */
    border-color: hsl(221, 44%, 41%);
  }

  .envelope:hover {
    background-color: hsla(231, 8%, 50%, 1);
  }
  /* Mail */

  .screen-reader {
    position: absolute;
    left: -9999px;
    top: -9999px;
  }

  .shadow .tab {
    background: none;
  }

  .shadow .circle {
    box-shadow: 1px 1px 3px hsla(0, 0%, 0%, 0.4);
  }

  .shadow .linkedin,
  .shadow .github,
  .shadow .envelope {
    border-color: hsl(0, 0%, 100%) !important;
    border: none;
    padding: 0px;
    height: 21px;
    width: 23px;
  }


  .footerSocialLinks {
    display: flex;
    margin: auto;
    margin-bottom: 1em;
    top: 50%;
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
