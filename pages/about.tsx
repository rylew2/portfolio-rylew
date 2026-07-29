import Image from 'next/image';
import React from 'react';
import { Container, Layout } from '../components';
import { StyledAbout } from '../components/styles/about.styles';
import {
  CONVERSION_EVENTS,
  trackConversion,
} from '../lib/conversion-analytics';
import { profile } from '../lib/profile';

/**
 * About page `/about`
 *
 * Everything factual here comes from me/profile.json, which also generates the
 * summary the chat assistant is given. Edit that file, not this one.
 */
const About = () => {
  const {
    name,
    role,
    location,
    bio,
    experience,
    education,
    certifications,
    skills,
    links,
  } = profile;

  return (
    <Layout
      pathname={'/about'}
      pageTitle="About"
      pageDescription={`${role} based in ${location}. Experience, education, and the tools I build with.`}
    >
      <StyledAbout>
        <Container width="narrow">
          <div className="aboutIntro">
            <div className="avatarImage">
              <Image
                src="/images/avatar2.png"
                width={200}
                height={200}
                alt={name}
                priority
              />
            </div>
            <div className="introText">
              <p className="positioning">
                {role} · {location}
              </p>
              {bio.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
              {/* Contact details live in the footer. The résumé is the one link
                  the footer doesn't carry, so it sits here instead. */}
              {links.resume && (
                <p>
                  <a
                    className="resumeLink"
                    href={links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackConversion(CONVERSION_EVENTS.resumeDownload, {
                        location: 'about',
                      })
                    }
                  >
                    Résumé (PDF)
                  </a>
                </p>
              )}
            </div>
          </div>

          <section className="aboutSection">
            <h2>Experience</h2>
            <ol className="timeline">
              {experience.map((job) => (
                <li key={`${job.company}-${job.start}`}>
                  <span className="entryPrimary">{job.company}</span>
                  <span className="entrySecondary">{job.title}</span>
                  <span className="entryMeta">
                    {job.start} – {job.end}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className="aboutSection">
            <h2>Education &amp; Certifications</h2>
            <ul className="credentials">
              {education.map((school) => (
                <li key={school.school}>
                  <span className="entryPrimary">{school.school}</span>
                  <span className="entrySecondary">
                    {[school.credential, school.years, school.detail]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </li>
              ))}
              {certifications.map((certification) => (
                <li key={certification.name}>
                  <span className="entryPrimary">{certification.name}</span>
                  {certification.issued && (
                    <span className="entrySecondary">
                      Issued {certification.issued}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="aboutSection">
            <h2>Skills</h2>
            {/* A plain pill list rather than the Chips component: Chips links
                each item to a relative `tags/` route, which would 404 from
                /about and would pull every skill into config/tags.json. */}
            <dl className="skillGroups">
              {skills.map((group) => (
                <div className="skillGroup" key={group.group}>
                  <dt>{group.group}</dt>
                  <dd>
                    <ul className="skillPills">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </Container>
      </StyledAbout>
    </Layout>
  );
};

export default About;
