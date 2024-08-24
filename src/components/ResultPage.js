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
  const resultRef = useRef(null);

  useEffect(() => {
    const fetchLetter = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/love-letter`, { name, answers });

        // Log the full response to verify structure
        console.log('API Response:', response.data);

        // Use regular expressions to extract content
        const responseText = response.data;

        // Extract the letter, keywords, and descriptor using regular expressions
        const loveLetterMatch = responseText.match(/Love Letter:\s*([\s\S]*?)(?:\n 2. Keywords:|$)/);
        const keywordsMatch = responseText.match(/Keywords:\s*([\s\S]*?)(?:\n 3. Descriptor:|$)/);
        const descriptorMatch = responseText.match(/Descriptor:\s*(.*)$/);

        // Process the results
        const letterContent = loveLetterMatch ? loveLetterMatch[1].trim() : 'No letter provided.';
        const keywordsContent = keywordsMatch ? keywordsMatch[1].trim().split(',').map(keyword => keyword.trim()) : [];
        const descriptorContent = descriptorMatch ? descriptorMatch[1].trim() : 'No descriptor provided.';

        setLetter(letterContent);
        setKeywords(keywordsContent);
        setDescriptor(descriptorContent);
      } catch (error) {
        console.error('러브레터 생성에 실패했습니다:', error);
        setLetter(''); // Optionally set an error message or empty state
        setKeywords([]);
        setDescriptor('');
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
        alert('Instagram 스토리 공유에 실패했습니다. 나중에 다시 시도해 주세요.');
      }
    }
  };

  return (
    <div>
      <h1>{descriptor} 당신을 위한 러브레터</h1>
      {loading ? (
        <p>로딩 중...</p>
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
              <h2></h2>
              <p></p>
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
