import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { StyledCards } from '../styles/cards.styles';
import { useRouter } from 'next/router';
import { ContentListItem } from '../../lib/content';

interface CardsProps {
  data: ContentListItem[];
}

const Cards = ({ data }: CardsProps) => {
  const router = useRouter();
  const isIndexPage = router.pathname === '/';

  return (
    <StyledCards>
      {data.map((singleCard) => (
        <article className="article" key={singleCard.id}>
          {/* Decorative: the title link below names the destination, so alt
              text here would just repeat it to a screen reader. */}
          <div className="card-image">
            <Image
              src={singleCard.previewImage}
              alt=""
              width={450}
              height={220}
              sizes="(min-width: 640px) 700px, 400px"
            />
          </div>

          <div className="card-body">
            {singleCard.liveSite ||
            singleCard.sourceCode ||
            singleCard.presentation
              ? getDemoLinks(singleCard)
              : getMetaRow(singleCard, isIndexPage)}

            {/* Stretched via ::after to cover the whole card, so the padding
                and description are clickable too. See cards.styles.ts. */}
            <Link
              href={`/${singleCard.path}/[id]`}
              as={`/${singleCard.path}/${singleCard.slug}`}
              className="card-link"
            >
              <h2>{singleCard.title}</h2>
            </Link>

            {singleCard.description && <p>{singleCard.description}</p>}
          </div>
        </article>
      ))}
    </StyledCards>
  );
};

export { Cards };

// Helper functions below to keep the jsx clean and readable

function getMetaRow(singleCard: ContentListItem, isIndexPage: boolean) {
  return (
    <div className="meta-row">
      {getDate(singleCard)}
      {getMetaLabel(singleCard, isIndexPage)}
    </div>
  );
}

function getDemoLinks(singleCard: ContentListItem) {
  return (
    <div className="card-demo-link">
      {getDate(singleCard)}
      {getDemoButtons(singleCard)}
    </div>
  );
}

function getDate(singleCard: ContentListItem) {
  return <time>{singleCard.date ?? ''}</time>;
}

function getMetaLabel(singleCard: ContentListItem, isIndexPage: boolean) {
  // Label that it's a book review on the index page to distinguish from project cards
  return (
    <span>
      {singleCard.path === 'books' && isIndexPage ? 'Book Review' : null}
    </span>
  );
}

function getDemoButtons(singleCard: ContentListItem) {
  return (
    <>
      {singleCard.liveSite && (
        <a
          href={singleCard.liveSite}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${singleCard.title} demo`}
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
          aria-label={`${singleCard.title} source code`}
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
          aria-label={`${singleCard.title} presentation`}
          className="a-presentation"
        >
          <button className="presentation">Presentation</button>
        </a>
      )}
    </>
  );
}
