import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCalendarAlt, faChurch  } from "@fortawesome/free-solid-svg-icons";
import styles from '../../../../assets/css/section-card.module.css'
import { NavLink } from 'react-router-dom';

export const SectionMembers = () => {
    const cardsData = [
        { title: 'Miembros', description: 'Lista de miembros',icon: faUsers, route: '/social/miembros/lista' },
        { title: 'Calendario', description: 'Calendario con actividades', icon: faCalendarAlt, route: '/social/miembros/calendario' },
        { title: 'Reuniones', description: 'Historial de Reuniones', icon: faChurch , route: '/social/miembros/reuniones' },
    ];

    return (
        <div className={styles['card-container']}>
            {cardsData.map((card, index) => (
                <NavLink key={index} to={card.route}>
                    <div className={styles.card}>
                        <FontAwesomeIcon icon={card.icon} className={styles['card-icon']} style={{ fontSize: '4rem' }} />
                        <h2 className={styles['card-title']}>{card.title}</h2>
                        <p className={styles['card-description']}>{card.description}</p>
                    </div>
                </NavLink>
            ))}
        </div>
    );
}
