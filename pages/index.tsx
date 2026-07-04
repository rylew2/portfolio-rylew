import React, { useState } from 'react';
import { Cards, Container, Layout } from '../components';
import { StyledIndexPage } from '../components/styles/home.styles';
import { getContentList, ContentListItem } from '../lib/content';

interface IndexPageProps {
  selectedWorks: ContentListItem[];
}

type WorkFilter = 'all' | 'projects' | 'books';

const filters: { label: string; value: WorkFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Projects', value: 'projects' },
  { label: 'Books', value: 'books' },
];

/**
 * Index page `/index`
 */
const Index = ({ selectedWorks }: IndexPageProps) => {
  const [filter, setFilter] = useState<WorkFilter>('all');

  const filteredWorks =
    filter === 'all'
      ? selectedWorks
      : selectedWorks.filter((work) => work.path === filter);

  return (
    <Layout pathname={'/'} pageTitle="Ryan Lewis Portfolio">
      <StyledIndexPage>
        <Container>
          <div
            className="work-filter"
            role="group"
            aria-label="Filter works by type"
          >
            {filters.map(({ label, value }) => (
              <button
                key={value}
                className={filter === value ? 'active' : ''}
                aria-pressed={filter === value}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <Cards data={filteredWorks} />
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
