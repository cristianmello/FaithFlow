import React from 'react'
import { Nav } from './Nav'
import { NavLink } from 'react-router-dom'

export const Header = () => {
    return (
        <header className="layout__navbar">
            <div className="navbar__header">
                <NavLink to="/social" className="navbar__title">FaithFlow</NavLink>
            </div>

            <Nav />

        </header>
    )
}
