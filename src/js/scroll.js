import { refs } from './refs';

// Добавьте обработчик события для клика на эту кнопку
function scrollPage() {
  // Код для прокрутки страницы
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

export { scrollPage };
