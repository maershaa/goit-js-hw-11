import axios from 'axios'; // Axios - библиотека для выполнения HTTP-запросов.
import throttle from 'lodash.throttle'; // Lodash Throttle - библиотека для создания функций с задержкой выполнения.
import Notiflix from 'notiflix'; // Notiflix - библиотека для создания уведомлений в веб-приложениях.
import 'notiflix/dist/notiflix-3.2.6.min.css';

import { refs } from './refs';
import { createMarkup } from './markup';

const BASE_URL = 'https://pixabay.com/api/';

const API_KEY = '39476118-a69449891a99ee741726132f7';

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
    per_page: 40, // Количество изображений на странице
  });

  try {
    // Выполняем HTTP GET-запрос к API Pixabay и получаем ответ
    const response = await axios.get(`${BASE_URL}?${params}`);
    return response.data; // Возвращаем данные изображений
  } catch (error) {
    // Обрабатываем ошибку и выводим уведомление об ошибке с помощью Notiflix.
    console.error(error);
    Notiflix.Notify.failure(
      'Извините, нет изображений, соответствующих вашему запросу. Пожалуйста, попробуйте еще раз.'
    );
    refs.loadMoreButton.classList.add('hidden'); // убираем кнопку "Load more"

    // Очищаем поле ввода.
    refs.input.value = '';
  }
}

export { getPhotos };
