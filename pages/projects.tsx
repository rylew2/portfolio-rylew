import React from "react";
import { Cards, Container, Layout } from "../components";
import { getContentList } from "../lib/content";

/**
 * Work page `/work`
 */
const Project = ({ projects }) => {
  return (
    <Layout
      pathname={"/projects"}
      pageTitle="Projects"
      pageDescription="Projects covering front end, machine learning, school associated courses, and research topics"
    >
      <Container>
        <p className="page-intro">
          Selected works I'm proud of. Ranging from front end development to
          machine learning.
        </p>
        <Cards data={projects} basePath="projects" />
      </Container>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const projects = getContentList("project");
  return {
    props: { projects },
  };
};

export default Project;
