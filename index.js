class PopUpInfo extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' }); // sets and returns 'this.shadowRoot'

    const wrapper = document.createElement('span');
    wrapper.setAttribute('class', 'wrapper');

    const icon = wrapper.appendChild(document.createElement('span'));
    icon.setAttribute('class', 'icon');
    icon.setAttribute('tabindex', 0);

    const img = icon.appendChild(document.createElement('img'));
    img.src = this.hasAttribute('img-src')
      ? this.getAttribute('img-src')
      : 'img/default.png';
    img.alt = this.hasAttribute('alt') ? this.getAttribute('alt') : '';

    const info = wrapper.appendChild(document.createElement('span'));
    info.setAttribute('class', 'info');
    info.textContent = this.getAttribute('data-text');

    icon.addEventListener('focus', () => {
      info.classList.add('focus');
    });

    icon.addEventListener('blur', () => {
      info.classList.remove('focus');
    });

    icon.addEventListener('mouseover', () => {
      info.classList.add('hover');
    });

    icon.addEventListener('mouseout', () => {
      info.classList.remove('hover');
    });
    // The following is an example of internal styling for the shadow dom. Later
    // on, we add more styling with an external style sheet:
    const style = document.createElement('style');
    style.textContent = `
    .wrapper {
      position: relative;
    }
    .info {
      font-size: 0.8rem;
      width: 200px;
      display: inline-block;
      border: 1px solid black;
      padding: 10px;
      background: white;
      border-radius: 10px;
      opacity: 0;
      transition: 0.6s all;
      position: absolute;
      bottom: 20px;
      left: 10px;
      z-index: 3;
    }
    img {
      width: 1.2rem;
    }
    .info.focus, .info.hover {
      opacity: 1;
    }
    `;

    // TODO: see if opacity can be done with (.info + ("focus or hover")) selector

    // the following is more styling applied with an external styles sheet added
    // with a link element. More on this at:
    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#internal_vs._external_styles
    const linkElm = document.createElement('link');
    linkElm.setAttribute('rel', 'stylesheet');
    linkElm.setAttribute('href', 'popup-info.css');

    this.shadowRoot.append(style, wrapper, linkElm);
  }
}

class ExpandingList extends HTMLUListElement {
  constructor() {
    super();

    const uls = Array.from(this.querySelectorAll('ul'));
    const lis = Array.from(this.querySelectorAll('li'));

    for (const ul of uls) {
      ul.style.display = 'none';
    }

    for (const li of lis) {
      if (li.querySelectorAll('ul').length > 0) {
        li.setAttribute('class', 'closed');
        const childText = li.childNodes[0];
        const newSpan = document.createElement('span');
        newSpan.textContent = childText.textContent;
        newSpan.style.cursor = 'pointer';

        newSpan.onclick = this.showUl;

        childText.parentNode.insertBefore(newSpan, childText);
        childText.parentNode.removeChild(childText);
      }
    }

    const linkElm = document.createElement('link');
    linkElm.setAttribute('rel', 'stylesheet');
    linkElm.setAttribute('href', 'expanding-list.css');
    this.appendChild(linkElm);
  }

  showUl(event) {
    const nextUl = event.target.nextElementSibling;

    if (nextUl.style.display === 'block') {
      nextUl.style.display = 'none';
      nextUl.parentNode.setAttribute('class', 'closed');
      return;
    }

    nextUl.style.display = 'block';
    nextUl.parentNode.setAttribute('class', 'open');
  }
}

class Square extends HTMLElement {
  static get observedAttributes() {
    return ['c', 'l'];
  }

  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' });

    const div = document.createElement('div');
    const style = document.createElement('style');

    shadow.appendChild(style);
    shadow.appendChild(div);
  }

  // The following are the lifecycle callbacks that web-components can use to
  // manage what happens during the elements lifecycle. You can think of this
  // similarly to how React function component useEffect works.

  connectedCallback() {
    // connectedCallback is invoked each time the custom element is appended into a
    // document-connected element. Invocation therefore occurs each time the node is
    // moves and may happen before the element's contents have been fully parsed.
    // TODO: what exactly is meant by "may happen before the element's contents have been fully parsed."
    // Note: connectedCallback may be called once a custom element is no longer connected, use Node.isConnected to make sure.
    document.body.querySelector('.message').innerHTML =
      'custom square element added to page';
    updateStyle(this);
  }

  disconnectedCallback() {
    // disconnectedCallback is invoked every time the custom element is is
    // disconnected from the DOM.
    document.body.querySelector('.message').innerHTML =
      'custom square element removed from page';
  }

  adoptedCallback() {
    // adoptedCallback is invoked each time the custom element is moved to a
    // new document.
    // TODO: what constitutes as a "move"?
    // TODO: why the "invoke when moved" overlap with connectedCallback?
    document.body.querySelector('.message').innerHTML =
      'custom square element moved to a new page';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // attributeChangedCallback is invoked each time the custom elements
    // attributes change, including removals and additions. Which attributes to
    // notice change for is specified in a `static get observedAttributes`
    // method, which behaves similarly do a dependency array in React, where you
    // list the reactive state that should trigger hook invocation.
    document.body.querySelector('.message').innerHTML =
      'custom square element attributes changed';
    updateStyle(this);
  }
}

function updateStyle(elem) {
  const shadow = elem.shadowRoot;
  shadow.querySelector('style').textContent = `
    div {
      width: ${elem.getAttribute('l')}px;
      height: ${elem.getAttribute('l')}px;
      background-color: ${elem.getAttribute('c')};
    }
  `;
}

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

// The following is the creation of the autonomous custom element that inherit from a basic
// HTML elements.

customElements.define('popup-info', PopUpInfo);
customElements.define('expanding-list', ExpandingList, { extends: 'ul' });
customElements.define('custom-square', Square);
