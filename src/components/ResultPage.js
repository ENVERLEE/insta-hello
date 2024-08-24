import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';

const ResultPage = () => {
  const location = useLocation();
  const { name, answers } = location.state;
  const [letter, setLetter] = useState('');
  const resultRef = useRef(null);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await axios.post('${process.env.REACT_APP_API_URL}/api/love-letter', { name, answers });
        setLetter(response.data.letter);
      } catch (error) {
        console.error('러브레터 생성에 실패했습니다:', error);
      }
    };
    
    fetchLetter();
  }, [name, answers]);

  const handleShare = async () => {
    if (resultRef.current) {
      const canvas = await html2canvas(resultRef.current);
      const image = canvas.toDataURL('image/png');
      
      // 인스타그램 공유 URL 생성 (대부분의 경우, 직접 공유할 수 없으므로 URL을 복사하는 방법 제공)
      const shareUrl = `https://www.instagram.com/share?url=${window.location.href}&media=${image}`;
      window.open(shareUrl, '_blank');
    }
  };

  return (
    <div>
      <h1>러브레터</h1>
      <div ref={resultRef}>
        <p>{letter}</p>
      </div>
      <button onClick={handleShare}>인스타그램에 공유하기</button>
    </div>
  );
};

export default ResultPage;
