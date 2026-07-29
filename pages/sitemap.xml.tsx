import type { GetServerSideProps } from 'next';

import { generateSitemapXml } from '../lib/sitemap';

const SitemapXml = () => null;

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.end(generateSitemapXml());

  return {
    props: {},
  };
};

export default SitemapXml;
