import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../../../assets/css/bible.module.css';

const API_BASE = "https://www.abibliadigital.com.br/api";
const VERSION = "rvr";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlNhdCBNYXkgMTMgMjAyMyAwMjoyMzo0NCBHTVQrMDAwMC42NDVlZWU3NjVlNGQ2NjAwMjBiMTBmODUiLCJpYXQiOjE2ODM5NDQ2MjR9.8cOGVuMbLMgIej78CwsRiFX7nC6lEQVL0aPnDvgoo_g";


const bookNameTranslation = {
    'Gênesis': 'Génesis',
    'Êxodo': 'Éxodo',
    'Levítico': 'Levítico',
    'Números': 'Números',
    'Deuteronômio': 'Deuteronomio',
    'Josué': 'Josué',
    'Juízes': 'Jueces',
    'Rute': 'Rut',
    '1° Samuel': '1 Samuel',
    '2° Samuel': '2 Samuel',
    '1° Reis': '1 Reyes',
    '2° Reis': '2 Reyes',
    '1° Crônicas': '1 Crónicas',
    '2° Crônicas': '2 Crónicas',
    'Esdras': 'Esdras',
    'Neemias': 'Nehemías',
    'Ester': 'Ester',
    'Jó': 'Job',
    'Salmos': 'Salmos',
    'Provérbios': 'Proverbios',
    'Eclesiastes': 'Eclesiastés',
    'Cânticos': 'Cantares',
    'Isaías': 'Isaías',
    'Jeremias': 'Jeremías',
    'Lamentações': 'Lamentaciones',
    'Ezequiel': 'Ezequiel',
    'Daniel': 'Daniel',
    'Oséias': 'Oseas',
    'Joel': 'Joel',
    'Amós': 'Amós',
    'Obadias': 'Abdías',
    'Jonas': 'Jonás',
    'Miquéias': 'Miqueas',
    'Naum': 'Nahum',
    'Habacuque': 'Habacuc',
    'Sofonias': 'Sofonías',
    'Ageu': 'Hageo',
    'Zacarias': 'Zacarías',
    'Malaquias': 'Malaquías',
    'Mateus': 'Mateo',
    'Marcos': 'Marcos',
    'Lucas': 'Lucas',
    'João': 'Juan',
    'Atos': 'Hechos',
    'Romanos': 'Romanos',
    '1 Coríntios': '1 Corintios',
    '2 Coríntios': '2 Corintios',
    'Gálatas': 'Gálatas',
    'Efésios': 'Efesios',
    'Filipenses': 'Filipenses',
    'Colossenses': 'Colosenses',
    '1 Tessalonicenses': '1 Tesalonicenses',
    '2 Tessalonicenses': '2 Tesalonicenses',
    '1 Timóteo': '1 Timoteo',
    '2 Timóteo': '2 Timoteo',
    'Tito': 'Tito',
    'Filemom': 'Filemón',
    'Hebreus': 'Hebreos',
    'Tiago': 'Santiago',
    '1 Pedro': '1 Pedro',
    '2 Pedro': '2 Pedro',
    '1 João': '1 Juan',
    '2 João': '2 Juan',
    '3 João': '3 Juan',
    'Judas': 'Judas',
    'Apocalipse': 'Apocalipsis'
}

export const Bible = () => {
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [verses, setVerses] = useState([]);
    const [selectedVerse, setSelectedVerse] = useState(null);


    useEffect(() => {
        axios.get(`${API_BASE}/books`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            const translatedBooks = res.data.map(book => {
                book.name = bookNameTranslation[book.name] || book.name;
                return book;
            });
            setBooks(translatedBooks);
        }).catch(err => {
            console.error(err);
        });
    }, []);

    useEffect(() => {
        if (selectedBook) {
            axios.get(`${API_BASE}/books/${selectedBook.abbrev.pt}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                setChapters(new Array(res.data.chapters).fill().map((_, idx) => idx + 1));
                setSelectedChapter(null);
                setVerses([]);
            }).catch(err => {
                console.error(err);
            });
        }
    }, [selectedBook]);

    useEffect(() => {
        if (selectedBook && selectedChapter) {
            axios.get(`${API_BASE}/verses/${VERSION}/${selectedBook.abbrev.pt}/${selectedChapter}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(res => {
                setVerses(res.data.verses);
            }).catch(err => {
                console.error(err);
            });
        }
    }, [selectedBook, selectedChapter]);

    const changeChapter = (increment) => {
        const newChapter = Number(selectedChapter) + increment;
        if (selectedBook && newChapter > 0 && newChapter <= selectedBook.chapters) {
            setSelectedChapter(String(newChapter));
            setSelectedVerse(null);
        }
    }

    const scrollToVerse = (verseNumber) => {
        const verseElement = document.getElementById(`verse-${verseNumber}`);
        verseElement?.scrollIntoView({ behavior: 'smooth' });
    }

    useEffect(() => {
        if (selectedVerse) {
            scrollToVerse(selectedVerse);
        }
    }, [selectedVerse, verses]);

    return (
        <div className={styles['bible-container']}>
            <select className={styles['bible-select']} onChange={(e) => setSelectedBook(books[e.target.value])} value={books.indexOf(selectedBook)}>
                <option value="">Seleccione Libro</option>
                {books.map((book, idx) => (
                    <option value={idx} key={idx}>{bookNameTranslation[book.name] || book.name}</option>
                ))}
            </select>

            {selectedBook && (
                <select className={styles['bible-select']} onChange={(e) => setSelectedChapter(e.target.value)} value={selectedChapter}>
                    <option value="">Seleccione capitulo</option>
                    {chapters.map((chapter, idx) => (
                        <option value={chapter} key={idx}>{chapter}</option>
                    ))}
                </select>
            )}

            {selectedBook && selectedChapter && (
                <div>
                    <button className={styles['bible-button']} onClick={() => changeChapter(-1)} disabled={selectedChapter === "1"}>Capitulo Anterior</button>
                    <button className={styles['bible-button']} onClick={() => changeChapter(1)} disabled={selectedChapter === String(selectedBook.chapters)}>Capitulo Siguiente</button>
                </div>
            )}

            {selectedBook && selectedChapter && (
                <select className={styles['bible-select']} onChange={(e) => setSelectedVerse(e.target.value)} value={selectedVerse}>
                    <option value="">Seleccione versiculo</option>
                    {verses.map((verse, idx) => (
                        <option value={verse.number} key={idx}>{verse.number}</option>
                    ))}
                </select>
            )}

            <div className={styles['bible-verses-container']}>
                {verses.map((verse, idx) => (
                    <p className={styles['bible-verse']} id={`verse-${verse.number}`} key={idx}>{verse.number}. {verse.text.charAt(0).toUpperCase() + verse.text.slice(1).toLowerCase()}</p>
                ))}
            </div>


        </div>
    );
};
