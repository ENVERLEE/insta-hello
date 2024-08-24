import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';

const ResultPage = () => {
  const location = useLocation();
  const { name, answers } = location.state;
  const [letter, setLetter] = useState('');
  const [keywords, setKeywords] = useState([]); // 키워드 상태 추가
  const [descriptor, setDescriptor] = useState(''); // 단어 요약 상태 추가
  const [loading, setLoading] = useState(true);
  const resultRef = useRef(null);

  useEffect(() => {
    const fetchLetter = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/love-letter`, { name, answers });
        setLetter(response.data.letter);
        setKeywords(response.data.keywords || []); // 키워드 상태 업데이트
        setDescriptor(response.data.descriptor || ''); // 단어 요약 상태 업데이트
      } catch (error) {
        console.error('러브레터 생성에 실패했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLetter();
  }, [name, answers]);

  const handleShare = async () => {
    if (resultRef.current) {
      try {
        const canvas = await html2canvas(resultRef.current);
        const image = canvas.toDataURL('image/png');
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], 'story.png', { type: blob.type });

        const link = document.createElement('a');
        link.href = image;
        link.download = 'love-letter.png';
        link.click();

        const isMobile = /android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          const instagramUrl = 'instagram://story-camera';
          window.location.href = instagramUrl;
        } else {
          alert('Instagram 스토리 공유는 모바일에서만 가능합니다.');
        }
      } catch (error) {
        console.error('Instagram 스토리 공유에 실패했습니다:', error);
      }
    }
  };

  return (
    <div>
      <h1>러브레터</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div ref={resultRef}>
          <p>{letter}</p>
          {keywords.length > 0 && (
            <div>
              <h2>당신을 나타내는 단어들</h2>
              <ul>
                {keywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
          )}
          {descriptor && (
            <div>
              <h2>당신은</h2>
              <p>{descriptor}</p>
            </div>
          )}
        </div>
      )}
      <button onClick={handleShare} disabled={loading}>인스타그램 스토리에 공유하기</button>
    </div>
  );
};

export default ResultPage;
