document.addEventListener('DOMContentLoaded', () => {
  // 1. 영역 설정 (이름을 마음대로 수정하세요. 특수문자 있어도 괜찮습니다!)
  const sections = [
    { name: "인지", count: 25 },
    { name: "언어", count: 12 },
    { name: "수", count: 12 },
    { name: "자기표현", count: 10 },
    { name: "타인인식", count: 17 },
    { name: "대인관계", count: 19 },
    { name: "기본생활", count: 27 },
    { name: "가정생활", count: 10 },
    { name: "지역적응", count: 14 },
    { name: "IT활용", count: 12 }
  ];

  const container = document.getElementById('questions-container');
  const form = document.getElementById('survey-form');

  // 문항 생성
  if (container) {
    container.innerHTML = '';
    sections.forEach((sec, sIdx) => {
      const title = document.createElement('h2');
      title.innerText = sec.name;
      container.appendChild(title);

      for (let i = 1; i <= sec.count; i++) {
        const qDiv = document.createElement('div');
        qDiv.className = 'question';
        qDiv.setAttribute('tabindex', '0');
        qDiv.dataset.sectionIndex = sIdx; // 영역 순서 저장
        
        // name을 단순히 'q_영역번호_문항번호'로 통일 (오류 방지 핵심)
        const qName = `sec${sIdx}_q${i}`; 
        
        qDiv.innerHTML = `
          <p>${sec.name} - 질문 ${i}</p>
          <label><input type="radio" name="${qName}" value="2"> 매우잘함(2)</label>
          <label><input type="radio" name="${qName}" value="1"> 가끔함(1)</label>
          <label><input type="radio" name="${qName}" value="0"> 거의못함(0)</label>
        `;
        container.appendChild(qDiv);
      }
    });
    
    const firstQ = document.querySelector('.question');
    if (firstQ) firstQ.focus();
  }

  // 키보드 입력 및 이동
  document.addEventListener('keydown', (e) => {
    const focused = document.activeElement;
    if (focused && focused.classList.contains('question')) {
      if (['0', '1', '2'].includes(e.key)) {
        e.preventDefault();
        const radio = focused.querySelector(`input[value="${e.key}"]`);
        if (radio) {
          radio.checked = true;
          focused.classList.add('answered');
          let next = focused.nextElementSibling;
          while (next && !next.classList.contains('question')) next = next.nextElementSibling;
          if (next) next.focus();
          else document.getElementById('submit-btn').focus();
        }
      }
    }
  });

  // 점수 합산 (영역 순서대로 정확히 계산)
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let totalScore = 0;
    let resultHtml = "";

    sections.forEach((sec, sIdx) => {
      let sectionSum = 0;
      for (let i = 1; i <= sec.count; i++) {
        const qName = `sec${sIdx}_q${i}`;
        const selected = document.querySelector(`input[name="${qName}"]:checked`);
        if (selected) {
          sectionSum += parseInt(selected.value);
        }
      }
      resultHtml += `<p>${sec.name} 합계: <strong>${sectionSum}점</strong></p>`;
      totalScore += sectionSum;
    });

    const output = document.getElementById('score-output');
    const resultDiv = document.getElementById('result');
    
    if (output && resultDiv) {
    const linkHtml = `
    <hr>
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://nise-test.com/" target="_blank" 
         style="display: inline-block; padding: 12px 24px; background-color: #34a853; 
         color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
         점수 입력 사이트
      </a>
    </div>
  `;

      output.innerHTML = `<h3>총점: ${totalScore}점</h3><hr>` + resultHtml + linkHtml;
      resultDiv.style.display = 'block';
      resultDiv.scrollIntoView({ behavior: 'smooth' });
    }
  });
});