import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faPlusCircle, faChartBar } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../assets/css/section-card.module.css'
import { NavLink } from 'react-router-dom';

export const SectionTreasury = () => {
    const cardsData = [
        { title: 'Pagos', description: 'Tipos de entradas y salídas', icon: faCreditCard, route: '/social/tesoreria/tipos' },
        { title: 'Agregar', description: 'Agregar Entrada/Salída', icon: faPlusCircle, route: '/social/tesoreria/lista' },
        //{ title: 'Estadisticas', description: 'Grafica mensual Entradas/Salídas', icon: faChartBar, route: '/social/tesoreria/estadisticas' },
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
