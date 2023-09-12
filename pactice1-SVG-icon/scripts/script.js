/* eslint-disable linebreak-style */
const svgIconFill = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-arrow-down-left-circle-fill" viewBox="0 0 18 18">
  <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-5.904-2.803a.5.5 0 1 1 .707.707L6.707 10h2.768a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5V6.525a.5.5 0 0 1 1 0v2.768l4.096-4.096z"/>
  </svg>
`;

const repIcon = document.createElement('div');
repIcon.innerHTML = svgIconFill;

function changeIcon(divIcon) {
  let newIcon = divIcon.firstElementChild;
  const btnIcon = document.querySelector('.btn-icon');
  const oldIcon = btnIcon.firstElementChild;
  newIcon = btnIcon.replaceChild(newIcon, oldIcon);
  return newIcon.outerHTML;
}

const btn = document.querySelector('.btn');

const handlerBtnClick = () => { repIcon.innerHTML = changeIcon(repIcon); };

btn.addEventListener('click', handlerBtnClick);
