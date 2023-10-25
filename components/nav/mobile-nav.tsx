import Link from 'next/link'
import React from 'react'
import { StyledMobileNav } from '../styles/nav.styles'
import { navLinks as mobileNavLinks } from './nav'
const MobileNav = () => {
    return (
        <StyledMobileNav>
            <div className="mobile-nav-container">
                <ul className="linkList">
                    {mobileNavLinks.map((item, idx) => {
                        return (
                            <li key={idx} className="listItem">
                                {item.link ? (
                                    <Link href={item.link}>
                                        <a className="link">{item.title}</a>
                                    </Link>
                                ) : (
                                    <a
                                        className="link"
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener norefferer"
                                    >
                                        {item.title}
                                    </a>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>
        </StyledMobileNav>
    )
}

export default MobileNav
