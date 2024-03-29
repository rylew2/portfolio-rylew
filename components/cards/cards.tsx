import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { StyledCards } from '../styles/cards.styles'

interface ICard {
    data: {
        title: string
        id: string
        slug: string
        date: Date
        previewImage: string
        description: string
        path: string
        liveSite?: string
        sourceCode?: string
        presentation?: string
    }[]
}

/**
 * Renders a grid of cards
 * @param {Array} data Data to display in grid
 */

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

                    {singleCard.liveSite || singleCard.sourceCode ? (
                        <div className="card-demo-link">
                            <time>
                                {singleCard.date instanceof Date
                                    ? singleCard.date.toLocaleDateString()
                                    : singleCard.date}
                            </time>

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
                                    <button className="source">Source </button>
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
                                    <button className="source">
                                        Presentation{' '}
                                    </button>
                                </a>
                            )}
                        </div>
                    ) : (
                        <time>
                            {singleCard.date instanceof Date
                                ? singleCard.date.toLocaleDateString()
                                : singleCard.date}
                        </time>
                    )}
                    <Link
                        href={`/${singleCard.path}/[id]`}
                        as={`/${singleCard.path}/${singleCard.slug}`}
                    >
                        <h2>{singleCard.title}</h2>
                    </Link>

                    {singleCard.description && <p>{singleCard.description}</p>}
                    {/* </a>
          </Link> */}
                </article>
            ))}
        </StyledCards>
    )
}

export { Cards }
