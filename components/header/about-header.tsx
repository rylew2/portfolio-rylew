import React from 'react';
import { profile } from '../../lib/profile';
import { Container } from '../container';
import { StyledPageHeading } from '../styles/header.styles';

const AboutHeader = () => (
  <StyledPageHeading aria-label="Page heading">
    <Container>
      <div className="header-container">
        <h1 className="about-header">About {profile.name}</h1>
      </div>
    </Container>
  </StyledPageHeading>
);

export default AboutHeader;
