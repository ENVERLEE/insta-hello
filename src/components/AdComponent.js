// src/components/AdComponent.js
import React, { useEffect } from 'react';

const AdComponent = () => {
  useEffect(() => {
    // 스크립트 태그를 동적으로 생성하여 페이지에 추가
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    script.async = true;
    document.body.appendChild(script);

    // 광고 영역을 페이지에 추가
    const adArea = document.createElement('ins');
    adArea.className = 'kakao_ad_area';
    adArea.style.display = 'none';
    adArea.setAttribute('data-ad-unit', 'DAN-ovMWR6gtlt39CgYR');
    adArea.setAttribute('data-ad-width', '300');
    adArea.setAttribute('data-ad-height', '250');
    document.body.appendChild(adArea);

    // 컴포넌트 언마운트 시 스크립트와 광고 영역 제거
    return () => {
      document.body.removeChild(script);
      document.body.removeChild(adArea);
    };
  }, []);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default AdComponent;
