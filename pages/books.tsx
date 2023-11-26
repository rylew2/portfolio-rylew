import React from 'react'
import { Cards, Container, Layout } from '../components'
import { getContentList } from '../lib/content'

/**
 * Work page `/work`
 */
const Book = ({ books }) => {
    return (
        <Layout
            pathname={'/books'}
            pageTitle="Books"
            pageDescription="Books covering a variety of topics"
        >
            <Container>
                <p className="page-intro">Books I've had the chance to read.</p>
                <Cards data={books} />
            </Container>
        </Layout>
    )
}

export const getStaticProps = async () => {
    const books = getContentList('book')

    return {
        props: { books },
    }
}

export default Book
