import React from 'react';
import { GetStaticPropsContext } from 'next';
import { Container, Layout } from '../../../components';
import NotesComponent from '../../../components/notes/notes';
import categoryJSON from '../../../config/categories.json';
import { getContentInCategory, ContentListItem } from '../../../lib/content';

interface CategoryPageProps {
  content: ContentListItem[];
  title: string;
  description: string;
  category: string;
}

const Category = ({
  content,
  title,
  description,
  category,
}: CategoryPageProps) => {
  return (
    <Layout
      canonicalPath={`/books/categories/${encodeURIComponent(category)}`}
      pageTitle={title}
      pageDescription={description}
    >
      <Container width="narrow">
        <p className="page-intro">{description}</p>
        <NotesComponent notes={content} basePath="book" />
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  // Get all the tags from the already defined site tags
  const paths = categoryJSON.map((category) => {
    return {
      params: {
        category: category.category,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const category = params?.category as string;
  const content = getContentInCategory(category, 'book');
  const categoryObject = categoryJSON.filter(
    (entry) => entry.category === category
  )[0];

  return {
    props: {
      content,
      title: categoryObject.title,
      description: categoryObject.description,
      category,
    },
  };
};

export default Category;
