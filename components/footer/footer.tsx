// import { facebook } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Container } from '../container'
import { StyledFooterSection } from '../styles/footer.styles'
import { IconProp } from '@fortawesome/fontawesome-svg-core'

const Footer = () => (
    <>
        <StyledFooterSection>
            <div className="snowFooter"></div>
            <Container className="footer-container">
                <div className="footer-copyright">
                    ©{new Date().getFullYear()}
                </div>

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
                                <FontAwesomeIcon
                                    icon={faLinkedin as IconProp}
                                    size="lg"
                                />
                            </div>
                        </a>
                    </li>
                    <li className="footerSocialLink">
                        <a
                            className="footerLink"
                            href="https://github.com/rylew2"
                            target="_blank"
                            rel="noreferrer noopener"
                            aria-label="github"
                        >
                            <div className="footerIcon github">
                                <FontAwesomeIcon
                                    icon={faGithub as IconProp}
                                    size="lg"
                                />
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
                                <FontAwesomeIcon
                                    icon={faEnvelope as IconProp}
                                    size="lg"
                                />
                            </div>
                        </a>
                    </li>
                </ul>
            </Container>
        </StyledFooterSection>
    </>
)

export default Footer
