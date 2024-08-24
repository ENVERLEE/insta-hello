import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const questions = [
  "당신이 가장 좋아하는 시간대는?",
  "세상에서 가장 좋아하는 냄새는?",
  "당신이 꿈꾸는 여행지는 어디인가요?",
  "특별한 날에 가장 듣고 싶은 노래는?",
  "가장 좋아하는 계절은?",
  "만약 하루 동안 동물이 될 수 있다면, 어떤 동물이 되고 싶나요?",
  "스트레스를 풀 때 가장 자주 하는 행동은?",
  "어릴 적 꿈꿨던 직업은 무엇인가요?",
  "인생에서 가장 잊지 못할 순간은?",
  "당신이 가장 사랑하는 사람에게 하고 싶은 한마디는?",
];

const choices = [
  ["아침", "점심", "저녁", "밤"],
  ["바다 냄새", "커피 향", "비 냄새", "숲 속 향기"],
  ["파리", "몰디브", "도쿄", "뉴욕"],
  ["달콤한 팝송", "신나는 록", "잔잔한 발라드", "재즈"],
  ["봄", "여름", "가을", "겨울"],
  ["고양이", "강아지", "새", "사자"],
  ["산책", "음악 듣기", "명상", "독서"],
  ["우주비행사", "의사", "예술가", "선생님"],
  ["졸업식", "첫사랑", "가족과의 여행", "성취감 느낄 때"],
  ["늘 사랑해", "항상 고마워", "당신은 나의 영웅", "함께해서 행복해"],
];

const QuestionPage = () => {
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { name, answers = [] } = location.state || {}; // location.state가 정의되지 않은 경우를 처리

  const questionIndex = parseInt(window.location.pathname.split('/').pop()) - 1;

  const handleNext = () => {
    const updatedAnswers = [...answers, answer];
    if (questionIndex < questions.length - 1) {
      navigate(`/question/${questionIndex + 2}`, { state: { name, answers: updatedAnswers } });
    } else {
      navigate('/result', { state: { name, answers: updatedAnswers } });
    }
  };

  return (
    <div>
      <h1>{questions[questionIndex]}</h1>
      {choices[questionIndex].map((choice, index) => (
        <div key={index}>
          <input
            type="radio"
            id={`choice-${index}`}
            name="choice"
            value={choice}
            checked={answer === choice}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <label htmlFor={`choice-${index}`}>{choice}</label>
        </div>
      ))}
      <button onClick={handleNext} disabled={!answer}>다음</button>
    </div>
  );
};

export default QuestionPage;
