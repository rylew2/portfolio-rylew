import React from "react";
import { Cards, Container, Layout } from "../components";
import { getContentList } from "../lib/content";

/**
 * Work page `/work`
 */
const Work = ({ projects }) => {
  return (
    <Layout
      pathname={"/projects"}
      pageTitle="Projects"
      pageDescription="Works and projects spanning Product design, Research, frontend and software engineering with ReactJS, React Native and NodeJs"
    >
      <Container>
        <p className="page-intro">
          Selected works I'm proud of. Ranging from Software Engineering and
          Product Design.
        </p>
        <Cards data={projects} basePath="projects" />
      </Container>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const projects = getContentList("work");
  return {
    props: { projects },
  };
};

export default Work;
