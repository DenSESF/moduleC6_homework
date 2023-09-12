/* eslint-disable linebreak-style */
const elmMessage = document.getElementById('message');
const elmBtnSend = document.querySelector('.btn-send');
const elmBtnGeolocation = document.querySelector('.btn-geolocation');
const elmChatOutput = document.querySelector('.chat-output');
const elmBtnOpen = document.querySelector('.btn-open');
const elmBtnClose = document.querySelector('.btn-close');
const echoUri = 'wss://echo-ws-service.herokuapp.com/';
let websocket;

elmChatOutput.style.maxHeight = `${elmChatOutput.clientHeight}px`;
elmChatOutput.style.overflow = 'auto';

function viewMessage(msg, direct) {
  const elmMsgBox = document.createElement('div');
  elmMsgBox.classList.add('message-box');
  if (direct === 'href') {
    const elmLink = document.createElement('a');
    elmLink.href = msg;
    elmLink.target = '_blank';
    elmLink.appendChild(document.createTextNode('Геолокация'));
    elmMsgBox.appendChild(elmLink);
  } else {
    elmMsgBox.appendChild(document.createTextNode(msg));
  }
  if (direct === 'error') {
    elmMsgBox.style.borderColor = 'red';
  }
  if (direct === 'href' || direct === 'error' || direct === 'out') {
    elmMsgBox.classList.add('out');
  }
  if (direct === 'in') {
    elmMsgBox.classList.add('in');
  }
  elmChatOutput.insertAdjacentElement('beforeend', elmMsgBox);
  if (elmChatOutput.lastElementChild) {
    elmChatOutput.lastElementChild.scrollIntoView({ behavior: 'smooth' });
  }
}
function sockedMessage(event) {
  viewMessage(event.data, 'in');
}
function viewGeolocation(location) {
  websocket.onmessage = function fakeMessage() {
    websocket.onmessage = sockedMessage;
    elmBtnGeolocation.disabled = false;
  };
  websocket.send(location.coords);
  const { latitude } = location.coords;
  const { longitude } = location.coords;
  const hrefAttr = `https://www.openstreetmap.org/#map=15/${latitude}/${longitude}`;
  viewMessage(hrefAttr, 'href');
}
function errorGeolocation(error) {
  switch (error.code) {
    case 0:
      viewMessage('Браузер не поддерживает геолокацию.', 'error');
      break;
    case 1:
      viewMessage('Нет разрешения на доступ к геолокации.', 'error');
      elmBtnGeolocation.disabled = false;
      break;
    case 2:
      viewMessage('Не удалось получить информацию о геолокации.', 'error');
      break;
    case 3:
      viewMessage('Превышено время ожидания определения координат.', 'error');
      break;
    // no default
  }
}
function getGeolocation() {
  if (!navigator.geolocation) {
    errorGeolocation({ code: 0 });
    elmBtnGeolocation.disabled = true;
  }
  navigator.geolocation.getCurrentPosition(viewGeolocation, errorGeolocation);
  elmBtnGeolocation.disabled = true;
}

elmBtnGeolocation.addEventListener('click', getGeolocation);
elmMessage.addEventListener('input', () => {
  if (elmMessage.value) {
    elmBtnSend.disabled = false;
  } else {
    elmBtnSend.disabled = true;
  }
});
elmBtnSend.addEventListener('click', () => {
  viewMessage(elmMessage.value, 'out');
  websocket.send(elmMessage.value);
  elmMessage.value = '';
  elmBtnSend.disabled = true;
});
elmBtnOpen.addEventListener('click', () => {
  viewMessage('Установка соединения', 'out');
  elmBtnOpen.disabled = true;
  if (elmChatOutput.lastElementChild) {
    elmChatOutput.lastElementChild.scrollIntoView({ behavior: 'smooth' });
  }
  document.querySelector('.chat-box').style.visibility = 'visible';
  websocket = new WebSocket(echoUri);
  websocket.onopen = function sockedOpen() {
    viewMessage('Соединение открыто', 'out');
    elmMessage.disabled = false;
    elmBtnClose.disabled = false;
    elmBtnGeolocation.disabled = false;
  };
  websocket.onclose = function socketClose() {
    viewMessage('Соединение закрыто', 'out');
    elmMessage.disabled = true;
    elmMessage.value = '';
    elmBtnSend.disabled = true;
    elmBtnGeolocation.disabled = true;
    elmBtnOpen.disabled = false;
    elmBtnClose.disabled = true;
    setTimeout(() => {
      document.querySelector('.chat-box').style.visibility = 'hidden';
    }, 1000);
  };
  websocket.onmessage = sockedMessage;
  websocket.onerror = function sockedError() {
    viewMessage('Ошибка WebSocket', 'error');
  };
});
elmBtnClose.addEventListener('click', () => {
  setTimeout(() => {
    websocket.close();
    websocket = null;
  }, 100);
});
