import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [name, setName] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/question/1', { state: { name } });
  };

  useEffect(() => {
    // 광고 스크립트를 동적으로 로드
    const script = document.createElement('script');
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup: Remove the script if needed
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <ins className="kakao_ad_area"
        data-ad-unit="DAN-IZJJcewdVXvL0BZF"
        data-ad-width="320"
        data-ad-height="50"></ins>

      <h1>인스타 감성 설문</h1>
      <form onSubmit={handleSubmit}>
        <label>이름을 입력하세요:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">시작하기</button>
          </form>

    <ins className="kakao_ad_area"
      data-ad-unit="DAN-ovMWR6gtlt39CgYR"
      data-ad-width="300"
      data-ad-height="250"></ins>
    <ins className="kakao_ad_area"
      data-ad-unit="DAN-WUbgcrIFWFlvVoWO"
      data-ad-width="320"
      data-ad-height="50"></ins>
    <ins className="kakao_ad_area"
      data-ad-unit="DAN-xv20fHZyXcJ5r2li"
      data-ad-width="320"
      data-ad-height="100"></ins>
    </div>
  );
};

export default HomePage;
