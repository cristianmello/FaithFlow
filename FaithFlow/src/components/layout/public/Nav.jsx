import React from 'react';
import { FaUser, FaUsers, FaChurch } from 'react-icons/fa';
import avatar from '../../../assets/img/user.png';
import { NavLink } from 'react-router-dom';

export const Nav = () => {
  return (
    <nav className="navbar__container-lists">
      <ul className="container-lists__menu-list">
        <li className="menu-list__item">
          <NavLink to="/login" className="menu-list__link">
            <FaUser className="menu-list__icon" />
            <span className="menu-list__title">Identificarse</span>
          </NavLink>
        </li>
        <li className="menu-list__item">
          <NavLink to="/registro" className="menu-list__link">
            <FaUsers className="menu-list__icon" />
            <span className="menu-list__title">¿Nuevo Miembro?</span>
          </NavLink>
        </li>
        <li className="menu-list__item">
          <NavLink to="/church" className="menu-list__link">
            <FaChurch className="menu-list__icon" />
            <span className="menu-list__title">¿Nueva Iglesia?</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};