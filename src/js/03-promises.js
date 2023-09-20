// Імпортуємо клас Notify з бібліотеки notiflix для відображення сповіщень
// Імпортуємо код для відображення сповіщень з файлу notiflix-notify-aio-3.2.6.min.js
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-notify-aio-3.2.6.min.js';


// Отримуємо посилання на HTML-елементи сторінки
const createBtn = document.querySelector('.form > button');
const firstDelayInput = document.querySelector('input[name=delay]');
const delayStepInput = document.querySelector('input[name=step]');
const amountInput = document.querySelector('input[name=amount]');


// Додаємо слухача подій для кнопки "createBtn"
createBtn.addEventListener('click', e => {
  e.preventDefault(); //Запобігаємо перезавантаженню сторінки при кліку на кнопку

   // Зчитуємо значення з полів вводу
  const amount = parseInt(amountInput.value);
  const delayStep = parseInt(delayStepInput.value);
  const firstDelay = parseInt(firstDelayInput.value);

  for (let position = 1; position <= amount; position++) {
    let delay = firstDelay + delayStep * position - delayStep;

    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
  }
});

const createPromise = (position, delay) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;

      if (shouldResolve) {
        resolve({ position, delay });
      }

      reject({ position, delay });
    }, delay);
  });
};