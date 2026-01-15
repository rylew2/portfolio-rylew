import React from 'react';
import { Cards, Container, Layout } from '../components';
import { getContentList, ContentListItem } from '../lib/content';

interface ProjectsPageProps {
  projects: ContentListItem[];
}

/**
 * Work page `/work`
 */
const Project = ({ projects }: ProjectsPageProps) => {
  return (
    <Layout
      pathname={'/projects'}
      pageTitle="Projects"
      pageDescription="Projects covering front end, machine learning, school associated courses, and research topics"
    >
      <Container>
        <p className="page-intro">
          Selected works I'm proud of. Ranging from front end development to
          machine learning.
        </p>
        <Cards data={projects} />
      </Container>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const projects = getContentList('project');
  return {
    props: { projects },
  };
};

export default Project;
