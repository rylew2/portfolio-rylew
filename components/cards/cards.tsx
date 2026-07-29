import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { StyledCards } from '../styles/cards.styles';
import { useRouter } from 'next/router';
import { ContentListItem } from '../../lib/content';
import {
  CONVERSION_EVENTS,
  trackConversion,
} from '../../lib/conversion-analytics';

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
              onClick={
                singleCard.path === 'projects' && singleCard.slug
                  ? () =>
                      trackConversion(CONVERSION_EVENTS.projectVisit, {
                        destination: 'detail',
                        location: 'card',
                        project_slug: singleCard.slug!,
                      })
                  : undefined
              }
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

// The actions are links, so they are anchors styled as buttons. Wrapping a
// <button> in an <a> nests two controls: it gives every action a duplicate tab
// stop, announces it twice, and collapses the anchor's own box to a 1px strip
// that fails the 24x24 target-size minimum.
function getDemoButtons(singleCard: ContentListItem) {
  return (
    <>
      {singleCard.liveSite && (
        <a
          href={singleCard.liveSite}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${singleCard.title} demo`}
          className="card-action a-demo demo"
          onClick={
            singleCard.path === 'projects' && singleCard.slug
              ? () =>
                  trackConversion(CONVERSION_EVENTS.projectVisit, {
                    destination: 'demo',
                    location: 'card',
                    project_slug: singleCard.slug!,
                  })
              : undefined
          }
        >
          Demo
        </a>
      )}
      {singleCard.sourceCode && (
        <a
          href={singleCard.sourceCode}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${singleCard.title} source code`}
          className="card-action a-source source"
          onClick={
            singleCard.path === 'projects' && singleCard.slug
              ? () =>
                  trackConversion(CONVERSION_EVENTS.projectVisit, {
                    destination: 'source',
                    location: 'card',
                    project_slug: singleCard.slug!,
                  })
              : undefined
          }
        >
          Source
        </a>
      )}
      {singleCard.presentation && (
        <a
          href={singleCard.presentation}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`${singleCard.title} presentation`}
          className="card-action a-presentation presentation"
        >
          Presentation
        </a>
      )}
    </>
  );
}
