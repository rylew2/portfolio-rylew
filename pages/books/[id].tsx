import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { GetStaticPropsContext } from 'next';
import { Container, Layout } from '../../components';
import { Chips } from '../../components/chips/chips';
import { StyledContent } from '../../components/styles/content.styles';
import {
  ContentData,
  getAllContentIds,
  getContentData,
} from '../../lib/content';

/**
 *  Renders book markdown posts
 */

const Book = ({ bookData }: { bookData: ContentData }) => {
  const { pathname } = useRouter();
  const { title, contentHtml, description } = bookData;

  return (
    <Layout pathname={pathname} pageTitle={title} pageDescription={description}>
      <Container width="narrow">
        <StyledContent>
          <time>{bookData.date}</time>
          {bookData.tags && <Chips items={bookData.tags} />}
          {bookData.previewImage && (
            <Image
              alt={`${title} book cover`}
              src={bookData.previewImage}
              height={550}
              width={1200}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </StyledContent>
      </Container>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  const paths = getAllContentIds('book');
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const bookData = await getContentData(params?.id as string, 'book');

  return {
    props: {
      bookData,
    },
  };
};

export default Book;
