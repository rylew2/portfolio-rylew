import React from 'react';

import { profile } from '../../lib/profile';
import { Container } from '../container';
import { StyledHomeHeading } from '../styles/header.styles';

const HomeHeader = () => (
  <StyledHomeHeading aria-label="Page introduction">
    <Container>
      <div className="header-container">
        <h1>{profile.name}</h1>
        <p className="identity">
          {profile.role} · {profile.location}
        </p>
        <p className="description">
          I build accessible, maintainable digital services with React,
          TypeScript, Python, and Node.js.
        </p>
        <nav className="hero-actions" aria-label="Homepage actions">
          <a className="primary" href="/projects">
            View projects
          </a>
          {profile.links.resume && (
            <a href={profile.links.resume}>Resume</a>
          )}
          <a href={`mailto:${profile.links.email}`}>Contact</a>
        </nav>
      </div>
    </Container>
  </StyledHomeHeading>
);

export default HomeHeader;
