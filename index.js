class PopUpInfo extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" }); // sets and returns 'this.shadowRoot'

    const wrapper = document.createElement("span");
    wrapper.setAttribute("class", "wrapper");

    const icon = wrapper.appendChild(document.createElement("span"));
    icon.setAttribute("class", "icon");
    icon.setAttribute("tabindex", 0);

    const img = icon.appendChild(document.createElement("img"));
    img.src = this.hasAttribute("img-src")
      ? this.getAttribute("img-src")
      : "img/default.png";
    img.alt = this.hasAttribute("alt")
      ? this.getAttribute("alt")
      : "";

    const info = wrapper.appendChild(document.createElement("span"));
    info.setAttribute("class", "info");
    info.textContent = this.getAttribute("data-text");

    // The following is an example of internal styling for the shadow dom. Later
    // on, we add more styling with an external style sheet:
    const style = document.createElement("style");
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
    .icon:hover + .info, .icon:focus + .info {
      opacity: 1;
    }
    `;

    // the following is more styling applied with an external styles sheet added
    // with a link element. More on this at:
    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#internal_vs._external_styles
    const linkElm = document.createElement('link');
    linkElm.setAttribute('rel', 'stylesheet');
    linkElm.setAttribute("href", 'popup-info.css');

    this.shadowRoot.append(style, wrapper, linkElm,);
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
        li.setAttribute('class', 'closed',);
        const childText = li.childNodes[0];
        const newSpan = document.createElement('span');
        newSpan.textContent = childText.textContent;
        newSpan.style.cursor = 'pointer';

        newSpan.onclick = this.showUl;

        childText.parentNode.insertBefore(newSpan, childText,);
        childText.parentNode.removeChild(childText,);
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
      nextUl.parentNode.setAttribute('class', 'closed',);
      return;
    }

    nextUl.style.display = 'block';
    nextUl.parentNode.setAttribute('class', 'open',);
  }
}

// The following is the creation of the autonomous custom element that inherit from a basic
// HTML elements.

customElements.define("popup-info", PopUpInfo);
customElements.define("expanding-list", ExpandingList, {extends: 'ul',});
