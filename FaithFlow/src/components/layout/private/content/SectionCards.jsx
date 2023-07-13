import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faMoneyBillWave, faBookOpen, faBible } from '@fortawesome/free-solid-svg-icons';
import styles from '../../../../assets/css/section-card.module.css';
import { DailyVerse } from './DailyVerse';
import { NavLink } from 'react-router-dom';
import useAuth from '../../../../hooks/useAuth';
import { Global } from '../../../../helpers/Global';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const SectionCards = () => {
  const [churchIncome, setChurchIncome] = useState(null);
  const { auth } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchChurch = async () => {
      try {
        const response = await fetch(Global.url + 'church', {
          method: 'GET',
          headers: {
            Authorization: token,
          },
        });
        const churchData = await response.json();
        setChurchIncome(churchData.church_income);
      } catch (error) {
        console.error('Error fetching church:', error);
      }
    };

    fetchChurch();
  }, [auth.member_code, token]);

  const handleCardClick = () => {
    if (churchIncome === null) {
      toast.error('No puedes acceder a Tesorería. Actualiza los ingresos de la Iglesia en el apartado de preferencias.');
    }
  };

  const cardsData = [
    { title: 'Miembros', description: 'Gestión de miembros', icon: faUsers, route: '/social/miembros' },
    { title: 'Tesorería', description: 'Gestión financiera', icon: faMoneyBillWave, route: '/social/tesoreria' },
    //{ title: 'Enseñanza', description: 'Recursos educativos', icon: faBookOpen, route: '/social/enseñanza' },
    { title: 'Biblia Virtual', description: 'Acceso a la Biblia', icon: faBible, route: '/social/biblia' },
  ];

  return (
    <div className={styles['card-container']}>
      <DailyVerse />
      <ToastContainer />
      {cardsData.map((card, index) => (
        <div
          key={index}
          className={`${styles.card} ${card.route === '/social/tesoreria' && churchIncome === null ? styles.disabled : ''}`}
          onClick={card.route === '/social/tesoreria' ? handleCardClick : null}
        >
          {card.route === '/social/tesoreria' && churchIncome === null ? (
            <div>
              <FontAwesomeIcon icon={card.icon} className={`${styles['card-icon']} ${styles.disabledIcon}`} style={{ fontSize: '4rem', marginLeft:'1.8rem'}} />
              <h2 className={`${styles['card-title']} ${styles.disabledTitle}`}>{card.title}</h2>
              <p className={`${styles['card-description']} ${styles.disabledDescription}`}>{card.description}</p>
            </div>
          ) : (
            <NavLink to={card.route}>
              <FontAwesomeIcon icon={card.icon} className={styles['card-icon']} style={{ fontSize: '4rem', marginLeft:'2rem' }} />
              <h2 className={styles['card-title']}>{card.title}</h2>
              <p className={styles['card-description']}>{card.description}</p>
            </NavLink>
          )}
        </div>
      ))}
    </div>
  );
};
