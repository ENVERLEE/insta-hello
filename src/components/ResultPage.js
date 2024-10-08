import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import html2canvas from 'html2canvas';

const ResultPage = () => {
  const location = useLocation();
  const { name, answers } = location.state;
  const [letter, setLetter] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [descriptor, setDescriptor] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  useEffect(() => {
    const fetchLetter = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/love-letter`, { name, answers });

        // Log the entire response for debugging
        console.log('API Response:', response);

        // Extract data from response
        const { letter: fullLetter, keywords: rawKeywords, descriptor } = response.data;

        // Extract letter content up to "2. Keywords:" and remove "3. Descriptor:" part
        const [letterPart] = fullLetter.split('2. Keywords:');
        const cleanLetterContent = letterPart.replace(/3\. Descriptor:.*$/, '').trim();

        // Ensure keywords do not include the descriptor
        const keywordsContent = rawKeywords ? rawKeywords.filter(keyword => keyword !== descriptor) : [];

        // Ensure descriptor has a default value if not present
        const descriptorContent = descriptor || '단어 요약이 없습니다.';

        // Update state
        setLetter(cleanLetterContent || '러브레터를 불러오는 데 실패했습니다.');
        setKeywords(keywordsContent);
        setDescriptor(descriptorContent);
      } catch (error) {
        console.error('러브레터 생성에 실패했습니다:', error);
        setLetter('러브레터를 불러오는 데 실패했습니다.');
        setKeywords([]);
        setDescriptor('단어 요약이 없습니다.');
        setError('정보를 불러오는 데 실패했습니다. 나중에 다시 시도해 주세요.');
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
        alert('Instagram 스토리 공유에 실패했습니다. 나중에 다시 시도해 주세요.');
      }
    }
  };
  return (
    <div>
      <h1>{descriptor && descriptor !== '단어 요약이 없습니다.' ? `${descriptor}, 당신의 러브레터` : '러브레터'}</h1>
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div ref={resultRef}>
          {letter ? (
            <div>
              <p>{letter}</p>
            </div>
          ) : (
            <p>러브레터를 불러오는 데 실패했습니다.</p>
          )}

          {keywords.length > 0 ? (
            <div>
              <h2>키워드</h2>
              <ul>
                {keywords.map((keyword, index) => (
                  <li key={index}>{keyword}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p>키워드가 없습니다.</p>
          )}

          {descriptor ? (
            <div>
              <h2>한 단어 요약</h2>
              <p>{descriptor}</p>
            </div>
          ) : (
            <p>단어 요약이 없습니다.</p>
          )}
        </div>
      )}
      <button onClick={handleShare} disabled={loading}>인스타그램 스토리에 공유하기</button>
    </div>
  );
};

export default ResultPage;
