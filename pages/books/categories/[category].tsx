import { useRouter } from 'next/router';
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
}

const Category = ({ content, title, description }: CategoryPageProps) => {
  const { pathname } = useRouter();
  return (
    <Layout pageTitle={title} pathname={pathname} pageDescription={description}>
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
  const content = getContentInCategory(params?.category as string, 'book');
  const categoryObject = categoryJSON.filter(
    (category) => category.category === params?.category
  )[0];

  return {
    props: {
      content,
      title: categoryObject.title,
      description: categoryObject.description,
    },
  };
};

export default Category;
