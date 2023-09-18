import { onLoadMoreButtonClick } from './query_api';

const BASE_URL = 'https://pixabay.com/api/';

const API_KEY = '39476118-a69449891a99ee741726132f7';

const refs = {
  searchForm: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  searchButton: document.querySelector('.submit'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};
export { BASE_URL, API_KEY, refs };

// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.
