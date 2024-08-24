import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/question/1', { state: { name } });
  };

  return (
    <div>
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
    </div>
  );
};

export default HomePage;
