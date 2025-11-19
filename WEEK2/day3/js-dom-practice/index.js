const questions = document.querySelectorAll('.question-item');

questions.forEach(item => {
  const btn = item.querySelector('#toggle-btn');
  const answer = item.querySelector('.answer');

  btn.addEventListener('click', () => {
    answer.classList.toggle('show');
    btn.classList.toggle('active');
  });
});
