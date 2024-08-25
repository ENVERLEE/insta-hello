import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuestionPage.css'; // CSS 파일을 추가해 스타일링

// 질문 리스트
const questions = [
  "데이트 약속이 생겼을 때, 당신의 첫 반응은?",
  "연애에서 가장 중요한 건?",
  "연인이 서프라이즈 이벤트를 준비했다면, 당신의 반응은?",
  "기념일이 다가오고 있어요. 당신의 준비는?",
  "연인과의 주말 계획이 취소됐다면?",
  "이상적인 데이트 장소는?",
  "연애 초반, 마음 표현은?",
  "연인이 멀리 여행을 간다면 당신의 마음은?",
  "둘만의 시간을 보낼 때 당신이 더 좋아하는 건?",
  "연인이 마음에 상처를 입었을 때 당신의 행동은?",
];

// 선택지 리스트
const choices = [
  ["설레면서도 계획부터 세운다", "일단 분위기를 내버려둔다", "약간 긴장된다"],
  ["서로를 이해하고 공감하는 시간", "함께하는 모든 순간을 즐기는 것", "꾸준한 관심과 애정 표현"],
  ["감동! 완전 설레고 감사해", "예상을 벗어나 당황하지만 고마워", "약간 부담스럽지만 기뻐할래"],
  ["깜짝 이벤트나 선물을 고민 중", "특별한 계획보단 분위기를 중시해", "간단한 선물로 진심을 전할래"],
  ["아쉽지만 대체할 계획을 생각한다", "집에서 쉬면서 재정비한다", "조금 우울하지만 괜찮아"],
  ["예쁜 카페나 분위기 좋은 레스토랑", "자연 속 산책", "사람 많은 곳보단 조용한 공간"],
  ["솔직하게 바로 표현한다", "천천히 반응을 보면서 다가간다", "신중하게 고민 후 표현한다"],
  ["자유 시간을 즐긴다", "살짝 쓸쓸하지만 응원한다", "자주 연락하며 그리움을 달랜다"],
  ["활동적인 데이트", "소파에 누워 이야기 나누기", "깊이 있는 대화 나누기"],
  ["빨리 위로하고 해결책을 찾는다", "차분하게 들어주며 공감한다", "옆에서 조용히 함께 있는다"],
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
    <div className="question-page">
      <h1>{questions[questionIndex]}</h1>
      <div className="choices-container">
        {choices[questionIndex].map((choice, index) => (
          <button
            key={index}
            className={`choice-button ${answer === choice ? 'selected' : ''}`}
            onClick={() => setAnswer(choice)}
          >
            {choice}
          </button>
        ))}
      </div>
      <button className="next-button" onClick={handleNext} disabled={!answer}>다음</button>
    </div>
  );
};

export default QuestionPage;

