/* eslint-disable linebreak-style */
/* eslint-disable no-alert */

function getScreenInfo() {
  const sizeFull = `Размер экрана: ${
    window.screen.width}px ${window.screen.height}px\n`;

  const sizeWithScroll = `Размер со скроллом: ${
    window.innerWidth}px ${window.innerHeight}px\n`;

  const sizeWithOutScroll = `Размер без скролла: ${
    document.documentElement.clientWidth}px ${
    document.documentElement.clientHeight}px\n`;

  return sizeFull + sizeWithScroll + sizeWithOutScroll;
}

const btn = document.querySelector('.btn');

const handlerBtnClick = () => { alert(getScreenInfo()); };

btn.addEventListener('click', handlerBtnClick);
