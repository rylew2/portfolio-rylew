import React from 'react';

import { Container } from '../container';
import siteConfig from '../../config/index.json';
import { profile } from '../../lib/profile';
import { StyledHomeHeading } from '../styles/header.styles';

const HomeHeader = () => (
  <StyledHomeHeading aria-label="Page introduction">
    <Container>
      <div className="header-container">
        <h1>{profile.name}</h1>
        <p className="role">
          {profile.role} · {profile.location}
        </p>
        <p className="description">{siteConfig.author.homepageDescription}</p>
        <nav className="hero-actions" aria-label="Primary actions">
          <a href="/projects">View projects</a>
          {profile.links.resume && (
            <a href={profile.links.resume} target="_blank" rel="noreferrer">
              Resume
            </a>
          )}
          <a href={`mailto:${profile.links.email}`}>Contact</a>
        </nav>
      </div>
    </Container>
  </StyledHomeHeading>
);

export default HomeHeader;
