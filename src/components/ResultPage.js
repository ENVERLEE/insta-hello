import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ResultPage = () => {
  const location = useLocation();
  const { name, answers } = location.state;
  const [letter, setLetter] = useState(''); 

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/love-letter`, { name, answers });
        setLetter(response.data.letter);
      } catch (error) {
        console.error('러브레터 생성에 실패했습니다:', error);
      }
    };
    
    fetchLetter();
  }, [name, answers]);

  return (
    <div>
      <h1>러브레터</h1>
      <p>{letter}</p>
    </div>
  );
};

export default ResultPage;
