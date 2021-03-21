// import { facebook } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Container } from "../container";
import { StyledFooterSection } from "../styles/footer.styles";
import { FooterIcon } from "./footerIcon";

const Footer = () => (
  <>
    <StyledFooterSection>
      <Container className="footer-container">
        {/* <FontAwesomeIcon icon={facebook} /> */}
        <div className="footer-copyright">©{new Date().getFullYear()}</div>

        <ul className="footerSocialLinks">
          <li className="footerSocialLink">

            <a
              className="footerLink"
              href="https://www.linkedin.com/in/ryan-lewis-378657a/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="linkedin"
            >
              <div className="footerIcon linkedin">
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </div>
            </a>
          </li>
          <li className="footerSocialLink">
            <a
              className="footerLink"
              href="https://www.linkedin.com/in/ryan-lewis-378657a/"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="github"
            >
              <div className="footerIcon github">
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </div>
            </a>
          </li>

          <li className="footerSocialLink envelope">
            <a
              className="footerLink"
              href="mailto:ryanlewis312@gmail.com"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="email"
            >
              <div className="footerIcon email envelope">
                <FontAwesomeIcon icon={faEnvelope} size="lg" />
              </div>
            </a>
          </li>
        </ul>
      </Container>
    </StyledFooterSection>
  </>
);

export default Footer;
