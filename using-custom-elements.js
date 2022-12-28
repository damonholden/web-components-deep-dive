const add = document.querySelector('.add');
const update = document.querySelector('.update');
const remove = document.querySelector('.remove');
let square;

update.disabled = true;
remove.disabled = true;

function random(min, max) {
  'use strict';
  return Math.floor(Math.random() * (max - min + 1) + min);
}

add.onclick = function () {
  square = document.createElement('custom-square');
  square.setAttribute('l', 100);
  square.setAttribute('c', 'red');
  document.body.querySelector('.container').appendChild(square);

  update.disabled = false;
  remove.disabled = false;
  add.disabled = true;
};

update.onclick = function () {
  square.setAttribute('l', random(50, 200));
  square.setAttribute(
    'c',
    `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`,
  );
};

remove.onclick = function () {
  'use strict';
  document.body.querySelector('.container').removeChild(square);

  update.disabled = true;
  remove.disabled = true;
  add.disabled = false;
};
