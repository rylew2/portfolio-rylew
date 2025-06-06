import Image from 'next/image'
import React from 'react'
import { Container, Layout } from '../components'
import { StyledAbout } from '../components/styles/about.styles'

/**
 * About page `/about`
 */
const About = () => {
    return (
        <Layout
            pathname={'/about'}
            pageTitle="About"
            pageDescription="About page of Ryan Lewis, NYC Developer"
        >
            <StyledAbout>
                <Container width="narrow">
                    <div className="postContent">
                        <div className="avatarImage">
                            <Image
                                src="/images/avatar2.png"
                                width={200}
                                height={200}
                                layout="fixed"
                                alt="Ryan Lewis"
                            />
                        </div>
                        <p>
                            I am a developer with a passion for continuous
                            learning, a collaborative approach, and using
                            technology to solve real-world problems. At the
                            moment, I build React solutions on top of content
                            management platforms.
                        </p>
                        <p>
                            Outside of work, I enjoy the vast array of food
                            choices here in the NYC, cooking, running, travelling, and getting out skiing in the winter.
                        </p>
                    </div>
                </Container>
            </StyledAbout>
        </Layout>
    )
}

export default About
