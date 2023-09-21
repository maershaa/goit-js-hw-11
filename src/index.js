import throttle from 'lodash.throttle'; // Lodash Throttle - библиотека для создания функций с задержкой выполнения.
import Notiflix from 'notiflix'; // Notiflix - библиотека для создания уведомлений в веб-приложениях.
import 'notiflix/dist/notiflix-3.2.6.min.css';

import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs, totalPages } from './js/refs';
import { createMarkup } from './js/markup';
import { getPhotos } from './js/query_api';

import { scrollPage } from './js/scroll.js';

let currentPage = 1;

refs.loadMoreButton.classList.add('hidden');
refs.scrollButton.classList.add('hidden');

const lightbox = new SimpleLightbox('.gallery a', {
  sourceAttr: 'href',
  captionsData: 'alt',
  captionsDelay: 250,
});

// ЗАЧЕМ ОНО????? =============
refs.loadMoreButton.setAttribute('data-custom', 'custom-value');

// Получаем текущее значение поля ввода и записываем его в userInput.
let userInput = refs.input.value;

// Добавляем слушателя события отправки формы.
refs.searchForm.addEventListener('submit', onFormSubmit);

// Функция onFormSubmit вызывается при отправке формы.
async function onFormSubmit(evt) {
  evt.preventDefault();

  // Получаем текущее значение поля ввода и записываем его в userInput.
  userInput = refs.input.value;
  // Проверяем, заполнено ли поле ввода, и выводим информационное уведомление, если оно пустое.
  if (refs.input.value === '') {
    Notiflix.Notify.info('Пожалуйста, заполните все поля!');
    return; // Возвращаемся из функции, так как поле пустое
  } else {
    try {
      const photoArr = await getPhotos(userInput, 1);
      // Получаем данные изображений и сохраняем в переменные

      if (userInput !== '') {
        clearGallery(); // Очищаем галерею
      }

      if (parseInt(photoArr.totalHits) > 0) {
        // Если найдены изображения, то создаем разметку и добавляем ее в галерею
        const markup = createMarkup(photoArr.hits); // Создаем HTML-разметку из данных hits
        refs.gallery.innerHTML += markup; // Добавляем разметку в галерею

        // Выводим информацию о количестве найденных изображений
        Notiflix.Notify.info(`Hooray! We found ${photoArr.totalHits} images.`);

        if (photoArr.hits !== photoArr.totalHits) {
          // Если есть еще изображения для загрузки, то показываем кнопку "Load more"
          refs.loadMoreButton.classList.remove('hidden'); // Показываем кнопку "Load more"
          refs.scrollButton.classList.remove('hidden'); // Показываем кнопку прокрутки
        }

        if (userInput === '') {
          currentPage = 1;
        }

        // Вычисляем общее количество страниц с изображениями
        const totalPages = Math.ceil(photoArr.totalHits / 40); // 40 - это количество элементов на странице

        // Возвращаем информацию о текущей странице, общем количестве страниц и массиве изображений
        return { currentPage, totalPages, hits: photoArr.hits };
      }
    } catch (error) {
      console.error(error); // Выводим ошибку в консоль
      Notiflix.Notify.failure(
        'Извините, нет изображений, соответствующих вашему запросу. Пожалуйста, попробуйте еще раз.'
      );
    }
  }

  lightbox.refresh(); // Обновляем Lightbox
}

function clearGallery() {
  while (refs.gallery.firstChild) {
    refs.gallery.removeChild(refs.gallery.firstChild);
  }
}

refs.loadMoreButton.addEventListener('click', onLoadMoreButtonClick);

async function onLoadMoreButtonClick(evt) {
  evt.preventDefault();

  // Обновляем значение currentPage после успешного выполнения запроса.
  currentPage = currentPage + 1;

  const { totalPages, hits } = await getPhotos(userInput, currentPage);

  if (currentPage >= totalPages) {
    refs.loadMoreButton.classList.add('hidden');
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }

  const markup = createMarkup(hits);
  refs.gallery.innerHTML += markup;

  // Уничтожаем и повторно инициализируем Lightbox
  lightbox.refresh();
}

refs.scrollButton.addEventListener('click', scrollPage);
