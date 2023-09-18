import axios from 'axios'; // Axios - библиотека для выполнения HTTP-запросов.
import throttle from 'lodash.throttle'; // Lodash Throttle - библиотека для создания функций с задержкой выполнения.
import Notiflix from 'notiflix'; // Notiflix - библиотека для создания уведомлений в веб-приложениях.
import 'notiflix/dist/notiflix-3.2.6.min.css';

import { BASE_URL, API_KEY, refs, totalPages, currentPage } from './js/refs';
import { createMarkup } from './js/markup';
import { getPhotos } from './js/query_api';

// refs.loadMoreButton.hidden = true;
refs.loadMoreButton.setAttribute('data-custom', 'custom-value');

// Определение константы STORAGE_KEY для использования в локальном хранилище.
const STORAGE_KEY = 'feedback-data';

// Создаем объект formData для хранения данных формы.
let formData = {};

// Получаем текущее значение поля ввода и записываем его в userInput.
let userInput = refs.input.value;

// Добавляем слушателя события отправки формы.
refs.searchForm.addEventListener('submit', onFormSubmit);

// Добавляем слушателя события ввода с задержкой для поля ввода.
refs.input.addEventListener('input', throttle(onInput, 500));

// Функция onFormSubmit вызывается при отправке формы.
function onFormSubmit(evt) {
  evt.preventDefault();

  // Получаем текущее значение поля ввода и записываем его в userInput.
  userInput = refs.input.value;

  // Проверяем, заполнено ли поле ввода, и выводим информационное уведомление, если оно пустое.
  if (refs.input.value === '') {
    Notiflix.Notify.info('Пожалуйста, заполните все поля!');
    return;
  } else {
    // Вызываем функцию getPhotos с пользовательским вводом.
    getPhotos(userInput);
    //   .then(data => console.log(data))

    //   .catch(err => console.log(err));
    // console.log(userInput);

    // Сбрасываем форму и удаляем данные из локального хранилища.
    // evt.currentTarget.reset();
    // localStorage.removeItem(STORAGE_KEY);
  }
}

// Функция onInput вызывается при вводе данных в поле формы.
function onInput(evt) {
  const fieldName = evt.target.getAttribute('name');
  userInput = evt.target.value; // Обновляем userInput
  formData[fieldName] = userInput; // Записываем значения ввода в объект formData
  // Записываем значения ввода в объект formData.
  formData[fieldName] = evt.target.value;

  // Сохраняем данные в локальном хранилище.
  saveDataToLocalStorage();
}

// Функция saveDataToLocalStorage сохраняет данные из объекта formData в локальном хранилище.
function saveDataToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

refs.loadMoreButton.addEventListener('click', onLoadMoreButtonClick);

async function onLoadMoreButtonClick(evt) {
  evt.preventDefault();

  const { currentPage, totalPages, hits } = await getPhotos(
    userInput,
    currentPage
  );

  if (currentPage >= totalPages) {
    // refs.loadMoreButton.setAttribute('disabled', true);
    refs.loadMoreButton.style.display = 'none';
  }

  const markup = createMarkup(hits);
  refs.gallery.innerHTML += markup;

  // Обновляем значение currentPage после успешного выполнения запроса.
  currentPage = currentPage + 1;
}
