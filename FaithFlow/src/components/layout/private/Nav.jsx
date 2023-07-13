import React, { useState, useEffect } from 'react';
import avatar from '../../../assets/img/user.png';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import { Global } from '../../../helpers/Global';
import useRoles from '../../../hooks/useRoles';

export const Nav = () => {
  const { auth, avatarUrl } = useAuth();
  const { roles } = useRoles();

  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const openPreferences = () => setIsPreferencesOpen(true);
  const closePreferences = () => setIsPreferencesOpen(false);

  const togglePreferences = () => {
    setIsPreferencesOpen(!isPreferencesOpen);
  };

  const hasPastorRole = roles && Array.isArray(roles) && roles.some(role => role.role_name === 'Pastor');

  return (
    <nav className="navbar__container-lists">
      <ul className="container-lists__menu-list">
        <li className="menu-list__item">
          <NavLink to="/social" className="list-end__link">
            <i className="fa-solid fa-house"></i>
            <span className="menu-list__title">Inicio</span>
          </NavLink>
        </li>
      </ul>

      <ul className="container-lists__list-end">
        <li className="list-end__item">
          <a href="#" className="list-end__link-image">
            {avatarUrl ? (
              <img src={avatarUrl} className="list-end__img" alt="Foto de perfil" />
            ) : (
              <img src="/src/assets/img/user.png" className="list-end__img" alt="Foto de perfil" />
            )}
          </a>
        </li>
        <li className="list-end__item">
          <a href="#" className="list-end__link">
            <span className="list-end__name">{auth.member_name + ' ' + auth.member_lastname}</span>
          </a>
        </li>
        <li className="list-end__item" onMouseEnter={openPreferences} onMouseLeave={closePreferences}>
          <div className="list-end__link">
            <i className="fa-solid fa-gear"></i>
            <span className="list-end__name">Preferencias</span>
          </div>
          {isPreferencesOpen && (
            <ul className="preferences-menu">
              <li>
                <NavLink to="/social/miembro/perfil" className="preferences-menu__link">
                  Ver Perfil
                </NavLink>
              </li>
              <li>
                <NavLink to="/social/miembro/actualizar" className="preferences-menu__link">
                  Actualizar datos
                </NavLink>
              </li>
              <li>
                {hasPastorRole &&
                  <NavLink to="/social/Roles" className="preferences-menu__link">
                    Asignar Rol
                  </NavLink>}
              </li>
            </ul>
          )}
        </li>
        <li className="list-end__item">
          <NavLink to="/social/logout" className="list-end__link">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span className="list-end__name">Cerrar sesión</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};






