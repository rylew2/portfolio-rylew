import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { StyledCards } from '../styles/cards.styles';
import { useRouter } from 'next/router';

interface ICard {
  data: {
    title: string;
    id: string;
    slug: string;
    date: Date;
    previewImage: string;
    description: string;
    path: string;
    liveSite?: string;
    sourceCode?: string;
    presentation?: string;
  }[];
}

const Cards = ({ data }: ICard) => {
  
  return (
    <StyledCards>
      {data.map((singleCard) => (
        <article className="article" key={singleCard.id}>
          <Link
            href={`/${singleCard.path}/[id]`}
            as={`/${singleCard.path}/${singleCard.slug}`}
          >
            <Image
              src={singleCard.previewImage}
              alt={singleCard.title}
              width={450}
              height={220}
              sizes="(min-width: 640px) 700px, 400px"
            />
          </Link>

          {singleCard.liveSite || singleCard.sourceCode || singleCard.presentation
            ? getDemoLinks(singleCard)
            : getMetaRow(singleCard)}

          <Link
            href={`/${singleCard.path}/[id]`}
            as={`/${singleCard.path}/${singleCard.slug}`}
          >
            <h2>{singleCard.title}</h2>
          </Link>

          {singleCard.description && <p>{singleCard.description}</p>}
        </article>
      ))}
    </StyledCards>
  );
};

export { Cards };



// Helper functions below to keep the jsx clean and readable

function getMetaRow(singleCard: ICard['data'][0]) {
  const router = useRouter();
  const isIndexPage = router.pathname === '/';
  return (
    <div className="meta-row">
      {getDate(singleCard)}
      {getMetaLabel(singleCard, isIndexPage)}
    </div>
  );
}

function getDemoLinks(singleCard: ICard['data'][0]) {
  return (
    <div className="card-demo-link">
      {getDate(singleCard)}
      {getDemoButtons(singleCard)}
    </div>
  );
}

function getDate(singleCard: ICard['data'][0]) {
  return (
    <time>
      {singleCard.date instanceof Date
        ? singleCard.date.toLocaleDateString()
        : singleCard.date}
    </time>
  );
}

function getMetaLabel(singleCard: ICard['data'][0], isIndexPage: boolean) {
  // Label that it's a book review on the index page to distinguish from project cards
  return (
    <span>
      {singleCard.path === 'books' && isIndexPage ? 'Book Review' : null}
    </span>
  );
}

function getDemoButtons(singleCard: ICard['data'][0]) {
  return (
    <>
      {singleCard.liveSite && (
        <a
          href={singleCard.liveSite}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={singleCard.title}
          className="a-demo"
        >
          <button className="demo">Demo</button>
        </a>
      )}
      {singleCard.sourceCode && (
        <a
          href={singleCard.sourceCode}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={singleCard.title}
          className="a-source"
        >
          <button className="source">Source</button>
        </a>
      )}
      {singleCard.presentation && (
        <a
          href={singleCard.presentation}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={singleCard.title}
          className="a-presentation"
        >
          <button className="source">Presentation</button>
        </a>
      )}
    </>
  );
}
