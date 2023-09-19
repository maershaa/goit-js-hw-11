import SimpleLightbox from 'simplelightbox';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

import { getPhotos } from './query_api';

async function onImageClick(evt) {
  const images = await getPhotos(); // Получаем данные изображений

  // Инициализируем Lightbox для всех ссылок внутри галереи
  const lightbox = new SimpleLightbox('.gallery a', {
    sourceAttr: 'href',
    captionsData: 'alt',
    captionsDelay: 250,
  });

  // Вызываем метод refresh() для обновления Lightbox после добавления новых ссылок
  lightbox.refresh();

  // Открываем Lightbox для первой ссылки (если необходимо)
}

export { onImageClick };
