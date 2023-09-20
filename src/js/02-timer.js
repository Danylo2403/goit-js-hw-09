// Імпортую бібліотеку flatpickr ; імпортую стилі для календаря ; імпортую тему оформлення "material_blue" для календаря
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
require("flatpickr/dist/themes/material_blue.css");

// Імпортую бібліотеку для відображення сповіщень ; імпортую файл з необхідним кодом для відображення сповіщень
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-notify-aio-3.2.6.min.js';

// Константа для затримки оновлення таймера
const DELAY = 1000;

// Посилання на елементи сторінки, які будуть взаємодіяти зі скриптом
const startBtn = document.querySelector('[data-start]');
const daysField = document.querySelector('[data-days]');
const hoursField = document.querySelector('[data-hours]');
const minsField = document.querySelector('[data-minutes]');
const secsField = document.querySelector('[data-seconds]');

// Слухач подій для кнопки "Start"
startBtn.addEventListener('click', startTimer);

//
startBtn.setAttribute('disabled', 'true'); 
let startTime = null; 

// Налаштування для календаря
const options = {
  enableTime: true, 
  time_24hr: true, 
  defaultDate: new Date(), 
  minuteIncrement: 1, 
  onClose(selectedDates) {
    // Функція після закриття календаря
    if (isPastTime()) {
      // Перевіряємо, чи вибрана дата є в майбутньому
      startBtn.setAttribute('disabled', 'true'); 
      Notify.failure('Please choose a date in the future'); 
      return;
    }

    startTime = selectedDates[0].getTime(); 
    startBtn.removeAttribute('disabled'); 
  },
};

// Створюємо календар для вибору дати та часу
const datePicker = flatpickr('#datetime-picker', options);

// Функція для перевірки, чи вибрана дата є в минулому
function isPastTime() {
  const currentDate = Date.now(); 
  const selectedDate = datePicker.selectedDates[0].getTime(); 
  return selectedDate - currentDate < 0; 
}

// Функція для запуску таймера
function startTimer() {
  startBtn.setAttribute('disabled', 'true'); 
  const currentTime = Date.now(); 
  const deltaTime = startTime - currentTime; 

  const timeComponents = convertMs(deltaTime); 

  updateReverseTimerFields(timeComponents); 

  const intervalId = setInterval(() => {
    // Запускаємо інтервал оновлення таймера
    const currentTime = Date.now(); 
    const deltaTime = startTime - currentTime; // Різниця між початковим та поточним часом

    const timeComponents = convertMs(deltaTime); 

    if (deltaTime <= 0) {
      // Якщо різниця менше або дорівнює нулю, тобто таймер завершено
      stopTimer(intervalId); // Зупиняємо таймер
      return;
    }

    updateReverseTimerFields(timeComponents); // Оновлюємо відображення залишкового часу
  }, DELAY);
}

// Функція для зупинки таймера і відображення сповіщення про завершення
function stopTimer(intervalId) {
  clearInterval(intervalId); // Зупиняємо інтервал оновлення таймера
  Notify.success('Countdown is over!'); 
}

// Функція для оновлення відображення залишкового часу
function updateReverseTimerFields(timeComponents) {
  daysField.textContent = addLeadingZero(timeComponents.days);
  hoursField.textContent = addLeadingZero(timeComponents.hours);
  minsField.textContent = addLeadingZero(timeComponents.minutes);
  secsField.textContent = addLeadingZero(timeComponents.seconds);
}

// Функція для перетворення мілісекунд в компоненти часу
function convertMs(ms) {
  // Кількість мілісекунд в одиниці часу
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Визначення компонентів часу: дні, години, хвилини, секунди
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

// Функція для додавання ведучого нуля до числа
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
