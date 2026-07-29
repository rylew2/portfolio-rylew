import { useRouter } from 'next/router';
import React from 'react';
import { GetStaticPropsContext } from 'next';
import { Cards, Container, Layout } from '../../../components';
import tagsJSON from '../../../config/tags.json';
import {
  getContentTaxonomyValues,
  getContentWithTag,
  ContentListItem,
} from '../../../lib/content';

interface TagPageProps {
  content: ContentListItem[];
  title: string;
  description: string;
}

const Tag = ({ content, title, description }: TagPageProps) => {
  const { pathname } = useRouter();
  return (
    <Layout pathname={pathname} pageTitle={title} pageDescription={description}>
      <Container>
        <p className="page-intro">{description}</p>

        <Cards data={content} />
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const bookTags = new Set(getContentTaxonomyValues('book', 'tags'));

  const paths = tagsJSON
    .filter((tag) => bookTags.has(tag.tag))
    .map((tag) => {
      return {
        params: {
          tag: tag.tag,
        },
      };
    });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const content = getContentWithTag(params?.tag as string, 'book');
  const tagObject = tagsJSON.filter((json) => json.tag === params?.tag)[0];

  return {
    props: {
      content,
      title: tagObject.title,
      description: tagObject.description,
    },
  };
};

export default Tag;
