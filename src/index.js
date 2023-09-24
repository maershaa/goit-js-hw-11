// Импорт необходимых библиотек и стилей
import throttle from 'lodash.throttle'; // Lodash Throttle - библиотека для создания функций с задержкой выполнения.
import Notiflix from 'notiflix'; // Notiflix - библиотека для создания уведомлений в веб-приложениях.
import 'notiflix/dist/notiflix-3.2.6.min.css';

import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

// Импорт необходимых функций и данных из других модулей
import { refs, totalPages } from './js/refs';
import { createMarkup } from './js/markup';
import { getPhotos } from './js/query_api';

import { scrollPage } from './js/scroll.js';

// Инициализация переменных
let currentPage = 1;
let perPage = 40; // Количество элементов (изображений) на странице.

// Скрываем кнопки "Load more" и "Scroll" по умолчанию
refs.loadMoreButton.classList.add('hidden');
refs.scrollButton.classList.add('hidden');

// Инициализация Lightbox для просмотра изображений
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
  userInput = refs.input.value.trim(); // Убираем начальные и конечные пробелы.
  // Проверяем, заполнено ли поле ввода, и выводим информационное уведомление, если оно пустое.
  if (userInput === '') {
    Notiflix.Notify.info('Пожалуйста, заполните все поля!');
    return; // Возвращаемся из функции, так как поле пустое
  } else {
    try {
      // Запрашиваем данные изображений по введенному запросу и странице
      const photoArr = await getPhotos(userInput, 1);

      // Если запрос не пустой, очищаем галерею
      if (userInput !== '') {
        clearGallery(); // Очищаем галерею
      }

      // Если найдены изображения, то создаем разметку и добавляем ее в галерею
      if (parseInt(photoArr.totalHits) > 0) {
        const markup = createMarkup(photoArr.hits); // Создаем HTML-разметку из данных hits
        refs.gallery.innerHTML += markup; // Добавляем разметку в галерею

        // Запускаем наблюдение для infinityscroll, если все доступные фотографии загружены
        observer.observe(target);

        // Обновляем Lightbox, чтобы учесть новые элементы
        lightbox.refresh();

        // Выводим информацию о количестве найденных изображений
        Notiflix.Notify.info(`Hooray! We found ${photoArr.totalHits} images.`);

        // Если есть еще изображения для загрузки, показываем кнопку "Scroll"
        if (photoArr.hits !== photoArr.totalHits) {
          refs.scrollButton.classList.remove('hidden'); // Показываем кнопку прокрутки
        }

        // Если запрос пустой, сбрасываем текущую страницу на 1
        if (userInput === '') {
          currentPage = 1;
        }

        // Вычисляем общее количество страниц с изображениями
        const totalPages = Math.ceil(photoArr.totalHits / perPage); // perPage - это количество элементов на странице

        // ======= ДЛЯ infinityscroll Проверяем, загружены ли все доступные фотографии ================
        if (currentPage >= totalPages) {
          // Останавливаем наблюдение для infinityscroll, если все доступные фотографии загружены
          observer.unobserve(target);
        }

        // Возвращаем информацию о текущей странице, общем количестве страниц и массиве изображений
        return { currentPage, totalPages, hits: photoArr.hits };
      } else {
        // Если фотографий для загрузки больше нет, скрываем кнопку "Load more"
        refs.loadMoreButton.classList.add('hidden');

        // Выводим уведомление о том, что больше изображений нет
        Notiflix.Notify.info('No more images to load.');
      }
    } catch (error) {
      // В случае ошибки выводим уведомление
      console.error(error);
      Notiflix.Notify.failure('No photos found for your query');
    }
  }
}

// Функция для очистки галереи
function clearGallery() {
  while (refs.gallery.firstChild) {
    refs.gallery.removeChild(refs.gallery.firstChild);
  }
}

// Добавляем слушателя события для кнопки "Scroll"
refs.scrollButton.addEventListener('click', scrollPage);

// ====================================================================================
// =========  Реализация подгрузки фото через нажатие кнопки LoadMore =================
// ====================================================================================

// refs.loadMoreButton.addEventListener('click', onLoadMoreButtonClick);

// async function onLoadMoreButtonClick(evt) {
//   evt.preventDefault();

//   // Обновляем значение currentPage после успешного выполнения запроса.
//   currentPage = currentPage + 1;

//   const { totalPages, hits } = await getPhotos(userInput, currentPage);

//   // if (currentPage >= totalPages) {
//   //   refs.loadMoreButton.classList.add('hidden');
//   //   Notiflix.Notify.warning(
//   //     "We're sorry, but you've reached the end of search results."
//   //   );
//   // }

//   if (hits.length === 0) {
//     // Если API не вернуло больше изображений, то скрываем кнопку "Load More".
//     refs.loadMoreButton.classList.add('hidden');
//     Notiflix.Notify.warning(
//       "We're sorry, but you've reached the end of search results."
//     );
//   }
//   const markup = createMarkup(hits);
//   refs.gallery.innerHTML += markup;

//   // Уничтожаем и повторно инициализируем Lightbox
//   lightbox.refresh();
// }

// ====================================================================================
// =========  Реализация подгрузки фото через infinity scroll ========================
// ====================================================================================

const target = document.querySelector('.infinityScroll-js');

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

async function onLoad(entries, observer) {
  entries.forEach(async entry => {
    // Проверяем, видим ли элемент
    if (entry.isIntersecting) {
      // Увеличиваем текущую страницу
      currentPage += 1;

      // Проверяем, есть ли еще страницы для загрузки
      if (currentPage < totalPages) {
        try {
          // Загружаем данные для следующей страницы
          const { hits } = await getPhotos(userInput, currentPage);

          // Создаем HTML-разметку на основе загруженных данных
          const markup = createMarkup(hits);

          // Добавляем разметку в галерею
          refs.gallery.innerHTML += markup;

          // Обновляем Lightbox, чтобы учесть новые элементы
          lightbox.refresh();
        } catch (error) {
          // В случае ошибки выводим уведомление
          console.error(error);
          Notiflix.Notify.failure('Failed to load more photos');
        }
      }
    }
  });
}
