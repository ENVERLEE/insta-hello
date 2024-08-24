import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';

const ResultPage = () => {
  const location = useLocation();
  const { name, answers } = location.state;
  const [letter, setLetter] = useState('');
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const resultRef = useRef(null);

  useEffect(() => {
    const fetchLetter = async () => {
      setLoading(true); // 로딩 시작
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/love-letter`, { name, answers });
        setLetter(response.data.letter);
      } catch (error) {
        console.error('러브레터 생성에 실패했습니다:', error);
      } finally {
        setLoading(false); // 로딩 끝
      }
    };

    fetchLetter();
  }, [name, answers]);

  const handleShare = async () => {
    if (resultRef.current) {
      try {
        // html2canvas로 콘텐츠 캡처
        const canvas = await html2canvas(resultRef.current);
        const image = canvas.toDataURL('image/png');
        const shareUrl = 'intent://instagram.com/stories/share';
        const link = document.createElement('a');
        link.href = image;
        link.download = 'love-letter.png';
        link.click();
        // 캡처한 이미지를 Blob으로 변환
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], 'story.png', { type: blob.type });

        // Instagram 스토리 공유 URL 스키마 생성
        // 모바일 장치에서 Instagram으로 전환
        const formData = new FormData();
        formData.append('file', file);
        formData.append('media_type', 'image/png');

        const isMobile = /android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (isMobile) {
          // 모바일 환경에서만 작동
          const instagramUrl = instagram://story-camera;
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
      {loading ? ( // 로딩 중일 때 표시
        <p>로딩 중...</p>
      ) : (
        <div ref={resultRef}>
          <p>{letter}</p>
        </div>
      )}
      <button onClick={handleShare} disabled={loading}>인스타그램 스토리에 공유하기</button>
    </div>
  );
};

export default ResultPage;


