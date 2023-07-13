import React, { useEffect, useState } from 'react';

export const fetchDailyVerse = async () => {
  const request = await fetch('https://www.abibliadigital.com.br/api/verses/rvr/random', {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlNhdCBNYXkgMTMgMjAyMyAwMjoyMzo0NCBHTVQrMDAwMC42NDVlZWU3NjVlNGQ2NjAwMjBiMTBmODUiLCJpYXQiOjE2ODM5NDQ2MjR9.8cOGVuMbLMgIej78CwsRiFX7nC6lEQVL0aPnDvgoo_g'
    }
  });

  const tokenData = await request.json();

  console.log(tokenData.text);

  return tokenData.text;
};

export const DailyVerse = () => {
  const [verse, setVerse] = useState('');

  useEffect(() => {
    const savedVerse = localStorage.getItem('verse');
    const savedTime = localStorage.getItem('time');

    const currentTime = new Date().getTime();
    const sixHours = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

    if (!savedVerse || !savedTime || currentTime - savedTime > sixHours) {
      fetchDailyVerse().then((verse) => {
        setVerse(verse);
        localStorage.setItem('verse', verse);
        localStorage.setItem('time', currentTime.toString());
      });
    } else {
      let verseLowerCase = savedVerse.toLowerCase();
      let verseFormated = verseLowerCase.charAt(0).toUpperCase() + verseLowerCase.slice(1).toLowerCase()
      setVerse(verseFormated);
    }
  }, []);

  return (
    <div className="daily-verse">
      <h2>Versiculo del día</h2>
      <p className="verse-text">{verse}</p>
    </div>
  );
};