import Image from 'next/image';
import React from 'react';
import { Container, Layout } from '../components';
import { StyledAbout } from '../components/styles/about.styles';

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
                            I’m a software engineer who enjoys tackling complex technical
                            challenges and delivering reliable, user-centered software. My
                            experience spans designing and building modern web applications,
                            architecting scalable back-end systems, and integrating with
                            various content and data platforms.
                        </p>
                        <p>
                            I care deeply about clean, maintainable code, collaborative
                            problem-solving, and continuous learning. Outside of work, I love
                            exploring New York’s endless food scene, experimenting in the
                            kitchen, running, traveling, and skiing in the winter winter.
                        </p>
                    </div>
                </Container>
            </StyledAbout>
        </Layout>
    );
};

export default About;
