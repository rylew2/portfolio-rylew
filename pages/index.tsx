import React from 'react';
import { Cards, Container, Layout } from '../components';
import { StyledIndexPage } from '../components/styles/home.styles';
import { getContentList, ContentListItem } from '../lib/content';

interface IndexPageProps {
  selectedWorks: ContentListItem[];
}

/**
 * Index page `/index`
 */
const Index = ({ selectedWorks }: IndexPageProps) => {
  return (
    <Layout pathname={'/'} pageTitle="Ryan Lewis Portfolio">
      <StyledIndexPage>
        <Container>
          <Cards data={selectedWorks} />
        </Container>
      </StyledIndexPage>
    </Layout>
  );
};

export const getStaticProps = async () => {
  const projects = await getContentList('project');
  const books = await getContentList('book');
  const selectedProjects = projects.filter((work) => work.selectedWork);

  const selectedBooks = books.filter((book) => book.selectedWork);

  const selectedWorks = [...selectedProjects, ...selectedBooks].sort((a, b) => {
    return new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime();
  });

  return {
    props: {
      selectedWorks: selectedWorks,
    },
  };
};

export default Index;
