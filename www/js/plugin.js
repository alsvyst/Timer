const timer = (function () {

  let countdown,
      timerDisplay,
      endTime,
      alarmSound,
      stopButton;

  // Инициализация модуля
  function init(settings) {
      timerDisplay = document.querySelector(settings.timerDisplaySelector);
      endTime = document.querySelector(settings.endTimeSelector);
      alarmSound = new Audio(settings.alarmSound);
      stopButton = document.querySelector(settings.stopButtonSelector);
      return this;
  }
  
  function start(seconds) {
      stop();
      if (typeof  seconds !== 'number') return new Error ('Please provide seconds!');

      const now = Date.now();
      const then = now + seconds * 1000;

      displayTimeLeft(seconds);
      displayEndTime(then);

      stopButton.classList.add('button-display');
      stopButton.addEventListener( 'click', stop );

      countdown = setInterval(() => {
          const secondsLeft = Math.round( (then - Date.now()) / 1000 );
          if (secondsLeft < 0) {
              clearInterval(countdown);
              alarmSound.play();
              return;
          }
          displayTimeLeft(secondsLeft);
      }, 1000);
  }

  function displayTimeLeft(seconds) {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor( (seconds % 86400) / 3600 );
      const minutes = Math.floor( (seconds % 3600) / 60 );
      const reminderSeconds = seconds % 60;

      const display = seconds >= 86400 ? `${days < 10 ? '0' : ''}${days}:${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${reminderSeconds < 10 ? '0' : ''}${reminderSeconds}`:
          seconds >= 3600 ? `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${reminderSeconds < 10 ? '0' : ''}${reminderSeconds}` :
              `${minutes < 10 ? '0' : ''}${minutes}:${reminderSeconds < 10 ? '0' : ''}${reminderSeconds}`;

      timerDisplay.textContent = display;
      document.title = display;
  }
  
  function displayEndTime(timestamp) {
      const end = new Date(timestamp);
      const day = end.getDate();
      const month = end.getMonth() + 1;
      const year = end.getFullYear();
      const hour = end.getHours();
      const minutes = end.getMinutes();

      endTime.textContent = `Be back at ${day < 10 ? '0' : ''}${day}.${month < 10 ? '0' : ''}${month}.${year} ${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  function stop() {
      alarmSound.pause();
      alarmSound.currentTime = 0;
      clearInterval(countdown);
      timerDisplay.textContent = '';
      endTime.textContent = ``;
      stopButton.classList.remove('button-display');
      document.title = 'Countdown Timer';
      return this;
  }
  
  return {
      init,
      start,
      stop
  }

})();

const buttons = document.querySelectorAll('[data-time]');
const form = document.forms.customForm;
const input = document.querySelector('input');

timer.init({
    timerDisplaySelector: '.display__time-left',
    endTimeSelector: '.display__end-time',
    alarmSound: 'audio/bell.mp3',
    stopButtonSelector: '.stop__button'
});

// start timer on click
function startTimer(e) {
    const seconds = Number(this.dataset.time);
    timer.start(seconds);
}

// start timer on submit
function onSubmit(e) {
    e.preventDefault();
    const value = input.value;
    const seconds = value * 60;
    timer.start(seconds);
}

buttons.forEach(btn => btn.addEventListener('click', startTimer));
form.addEventListener('submit', onSubmit);