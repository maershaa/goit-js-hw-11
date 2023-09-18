import axios from 'axios'; // Axios - библиотека для выполнения HTTP-запросов.
import throttle from 'lodash.throttle'; // Lodash Throttle - библиотека для создания функций с задержкой выполнения.
import Notiflix from 'notiflix'; // Notiflix - библиотека для создания уведомлений в веб-приложениях.
import 'notiflix/dist/notiflix-3.2.6.min.css';

import { BASE_URL, API_KEY, refs, totalPages } from './refs';
import { createMarkup } from './markup';

let currentPage = 1;

// Функция getPhotos выполняет HTTP-запрос к API Pixabay на основе пользовательского ввода.
async function getPhotos(userInput, currentPage = 1) {
  // Создаем параметры запроса для API Pixabay
  const params = new URLSearchParams({
    key: API_KEY, // Ключ API Pixabay
    q: userInput, // Поисковый запрос пользователя
    image_type: 'photo', // Тип изображений (фото)
    orientation: 'horizontal', // Ориентация изображений (горизонтальная)
    safesearch: 'true', // Фильтрация изображений с учетом безопасного поиска
    page: currentPage, // Номер текущей страницы
    per_page: 20, // Количество изображений на странице
  });

  try {
    // Выполняем HTTP GET-запрос к API Pixabay и получаем ответ
    const response = await axios.get(`${BASE_URL}?${params}`);
    const photoArr = response.data;

    if (parseInt(photoArr.totalHits) > 0) {
      // Если найдены изображения, то создаем разметку и добавляем ее в галерею
      const markup = createMarkup(photoArr.hits);
      refs.gallery.innerHTML += markup;
      console.log('photoArr.hits', photoArr.hits);

      if (photoArr.hits !== photoArr.totalHits) {
        // Если есть еще изображения для загрузки, то показываем кнопку "Load more"
        // refs.loadMoreButton.style.display = 'block';
        refs.loadMoreButton.classList.remove('hidden');
      }

      // Вычисляем общее количество страниц с изображениями
      const totalPages = Math.ceil(photoArr.totalHits / 20); // 20 - это количество элементов на странице, можете заменить на нужное

      // Возвращаем информацию о текущей странице, общем количестве страниц и массиве изображений
      return { currentPage, totalPages, hits: photoArr.hits };
    } else {
      console.log('No hits');
    }

    // Очищаем поле ввода.
    refs.input.value = '';
  } catch (error) {
    // Обрабатываем ошибку и выводим уведомление об ошибке с помощью Notiflix.
    console.error(error);
    Notiflix.Notify.failure(
      'Извините, нет изображений, соответствующих вашему запросу. Пожалуйста, попробуйте еще раз.'
    );
  }
}
export { getPhotos };
