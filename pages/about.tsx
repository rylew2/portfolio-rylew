import Image from "next/image";
import React from "react";
import { Container, Layout } from "../components";
import { StyledAbout } from "../components/styles/about.styles";

/**
 * About page `/about`
 */
const About = () => {
  return (
    <Layout
      pathname={"/about"}
      pageTitle="About"
      pageDescription="About page of Peacock starter by Victor Ofoegbu, Product Designer and Frontend Software Engineer in Nigeria"
    >
      <StyledAbout>
        <Container width="narrow">
          <div className="postContent">
            <div className="avatarImage">
              <Image
                src="/images/avatar.jpg"
                width={200}
                height={200}
                alt="Victor Ofoegbu"
              />
            </div>
            <p>
              I am a full stack engineer with a passion for continuous learning,
              a collaborative approach, and using technology to solve real-world
              problems. At the moment, I build React solutions backed by
              SharePoint as a persistent store.
            </p>
            <p>
              Outside of work I enjoy the vast array of food choices here in the
              Bay Area, running scenic trails, and getting up to ski as much as
              I can in the winter.
            </p>
          </div>
        </Container>
      </StyledAbout>
    </Layout>
  );
};

export default About;
