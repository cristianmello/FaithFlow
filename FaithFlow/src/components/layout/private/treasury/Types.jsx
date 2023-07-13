import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSpring, animated as a } from 'react-spring';
import { FaEdit, FaTrash } from 'react-icons/fa';
import styles from '../../../../assets/css/typeTreasury.module.css';
import { Global } from '../../../../helpers/Global';

export const Types = () => {
    const [typeTreasuries, setTypeTreasuries] = useState([]);
    const [editTreasury, setEditTreasury] = useState(null);
    const [newTreasury, setNewTreasury] = useState({ TypeTreasury_type: '', TypeTreasury_title: '', TypeTreasury_description: '' });
    const [editing, setEditing] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios
            .get(`${Global.url}typeTreasury/`, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => setTypeTreasuries(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleEdit = (treasury) => {
        setEditTreasury(treasury);
        setEditing(treasury.TypeTreasury_code);
    };

    const handleDelete = (treasuryCode) => {
        axios
            .delete(`${Global.url}typeTreasury/typeTreasuries/${treasuryCode}`, {
                headers: {
                    Authorization: token,
                },
            })
            .then(() =>
                setTypeTreasuries(typeTreasuries.filter((treasury) => treasury.TypeTreasury_code !== treasuryCode))
            )
            .catch((err) => console.error(err));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditTreasury({ ...editTreasury, [name]: value });
    };

    const handleNewChange = (event) => {
        const { name, value } = event.target;
        setNewTreasury({ ...newTreasury, [name]: value });
    };


    const handleSubmit = () => {
        if (editTreasury.TypeTreasury_code) {
            axios
                .patch(`${Global.url}typeTreasury/typeTreasuries/${editTreasury.TypeTreasury_code}`, editTreasury, {
                    headers: {
                        Authorization: token,
                    },
                })
                .then(() =>
                    setTypeTreasuries(
                        typeTreasuries.map((treasury) =>
                            treasury.TypeTreasury_code === editTreasury.TypeTreasury_code ? editTreasury : treasury
                        )
                    )
                )
                .catch((err) => console.error(err));
        }
        setEditTreasury(null);
        setEditing(null);
    };

    const handleNewSubmit = () => {
        axios
            .post(`${Global.url}typeTreasury/`, newTreasury, {
                headers: {
                    Authorization: token,
                },
            })
            .then((res) => setTypeTreasuries([...typeTreasuries, res.data]))
            .catch((err) => console.error(err));

        setNewTreasury({ TypeTreasury_type: '', TypeTreasury_title: '', TypeTreasury_description: '' });
    };

    const springProps = useSpring({ opacity: 1, from: { opacity: 0 } });

    return (
        <a.div style={springProps}>
            <div className={styles.flexContainer}>
                <div className={`${styles.card} ${styles.addCard}`}>
                    <select
                        name="TypeTreasury_type"
                        value={newTreasury.TypeTreasury_type || ''}
                        onChange={handleNewChange}
                        className={styles.fullWidth}
                    >
                        <option value="">Tipo</option>
                        <option value={1}>Entrada</option>
                        <option value={2}>Salida</option>
                    </select>
                    <input
                        type="text"
                        name="TypeTreasury_title"
                        placeholder="Título"
                        value={newTreasury.TypeTreasury_title || ''}
                        onChange={handleNewChange}
                        className={styles.fullWidth}
                    />
                    <input
                        type="text"
                        name="TypeTreasury_description"
                        placeholder="Descripción"
                        value={newTreasury.TypeTreasury_description || ''}
                        onChange={handleNewChange}
                        className={styles.fullWidth}
                    />
                    <button onClick={handleNewSubmit} className={styles.submitButton}>
                        Agregar
                    </button>
                </div>
                {typeTreasuries.map((treasury) => (
                    <div className={styles.card} key={treasury.TypeTreasury_code}>
                        <div style={{ position: 'relative' }}>
                            {editing === treasury.TypeTreasury_code ? (
                                <>
                                    <select
                                        name="TypeTreasury_type"
                                        value={editTreasury?.TypeTreasury_type || ''}
                                        onChange={handleChange}
                                        className={styles.fullWidth}
                                    >
                                        <option value="">Tipo</option>
                                        <option value={1}>Entrada</option>
                                        <option value={2}>Salida</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="TypeTreasury_title"
                                        placeholder="Título"
                                        value={editTreasury?.TypeTreasury_title || ''}
                                        onChange={handleChange}
                                        className={styles.fullWidth}
                                    />
                                    <input
                                        type="text"
                                        name="TypeTreasury_description"
                                        placeholder="Descripción"
                                        value={editTreasury?.TypeTreasury_description || ''}
                                        onChange={handleChange}
                                        className={styles.fullWidth}
                                    />
                                    <button onClick={handleSubmit} className={styles.submitButton}>
                                        Actualizar
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2 className={styles.title}>{treasury.TypeTreasury_title}</h2>
                                    <p className={styles.description}>{treasury.TypeTreasury_description}</p>
                                    <p className={styles.type}>{treasury.TypeTreasury_type === 1 ? 'Entrada' : 'Salida'}</p>
                                    <div className={styles.buttonContainer}>
                                        <button className={styles.editButton} onClick={() => handleEdit(treasury)}>
                                            <FaEdit />
                                        </button>
                                        <button className={styles.deleteButton} onClick={() => handleDelete(treasury.TypeTreasury_code)}>
                                            <FaTrash />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </a.div>
    );
};

