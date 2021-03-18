import React from "react";
import { Cards, Container, Layout } from "../components";
import { getContentList } from "../lib/content";

/**
 * Article page `/articles`
 */

const Articles = ({ articles }) => {
  return (
    <Layout
      pathname={"/articles"}
      pageTitle="Articles"
      pageDescription="Articles and Essays about Frontend Web Development and software engineering"
    >
      <Container>
        <p className="page-intro">
          More long form articles and essays about new things I'm exploring and
          learning about...
        </p>

        <blockquote>
          All articles here are for demo purposes. But hey, the sky is the limit
          🚀
        </blockquote>
        <Cards data={articles} basePath="articles" />
      </Container>
    </Layout>
  );
};

//getStaticProps run only at build time
// in dev, run on every request
export const getStaticProps = async () => {
  const articles = getContentList("articles");
  return {
    props: { articles },
  };
};

export default Articles;
