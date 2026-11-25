// 한국어/영어 전환. <head>에서 동기로 불러야 화면이 깜빡이지 않는다.
// 순서: 주소의 ?lang= → 저장된 선택 → 브라우저 언어(한국어가 아니면 영어).
// 본문: lang="ko"/lang="en" 요소 중 다른 언어 쪽을 숨긴다.
// 속성: data-en(title 글자), data-en-alt, data-en-content, data-en-aria-label 을 영어일 때 바꿔 넣는다.
(function () {
  var q = new URLSearchParams(location.search).get('lang');
  var l = q || localStorage.getItem('lang') || (/^ko\b/i.test(navigator.language) ? 'ko' : 'en');
  if (l !== 'ko' && l !== 'en') l = 'ko';
  if (q) try { localStorage.setItem('lang', l); } catch (e) {}
  document.documentElement.lang = l;
  document.head.insertAdjacentHTML('beforeend',
    '<style>html[lang=ko] body [lang=en],html[lang=en] body [lang=ko]{display:none}</style>');

  document.addEventListener('DOMContentLoaded', function () {
    if (l === 'en') {
      var t = document.querySelector('title[data-en]');
      if (t) document.title = t.dataset.en;
      ['alt', 'content', 'aria-label'].forEach(function (a) {
        var key = 'data-en-' + a;
        document.querySelectorAll('[' + key + ']').forEach(function (e) { e.setAttribute(a, e.getAttribute(key)); });
      });
    }
    document.querySelectorAll('.lang-toggle').forEach(function (a) {
      var other = l === 'ko' ? 'en' : 'ko';
      a.href = '?lang=' + other;
      a.textContent = other === 'en' ? 'English' : '한국어';
      a.setAttribute('hreflang', other); // lang 속성은 붙이지 않는다(붙이면 위 규칙에 숨겨짐)
    });
  });
})();
