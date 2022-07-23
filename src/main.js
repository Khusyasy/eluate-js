function createObjectProxy(target = {}) {
  // special cases used to update the real DOM
  let $text = [];
  let $show = [];

  // TODO: check for cases like nested objects or arrays for data-text and data-show (and maybe more later)
  const proxy = new Proxy(target, {
    get(target, prop) {
      if (prop === '$text') {
        return $text;
      } else if (prop === '$show') {
        return $show;
      }

      let result = new Function(`return this.${prop}`).call(target);
      return result;
    },
    set(target, prop, value) {
      if (prop === '$text') {
        $text = value;
      } else if (prop === '$show') {
        $show = value;
      }

      new Function(`return this.${prop} = ${value}`).call(target);

      // update the real DOM
      // data-text
      $text.forEach(({ $el, propName }) => {
        if (propName === prop) {
          $el.innerHTML = value;
        }
      });
      // data-show
      $show.forEach(({ $el, propName }) => {
        if (propName === prop) {
          $el.style.display = value ? '' : 'none';
        }
      });
    },
  });
  return proxy;
}

function initElement($el, proxy) {
  Object.entries($el.dataset).forEach(([name, value]) => {
    if (name === 'text') {
      // add the element to the $instances array, so we can update it later when the value changes
      proxy.$text.push({ $el, propName: value });
      $el.innerHTML = proxy[value];
    } else if (name.startsWith('on:')) {
      const [, eventName] = name.split(':');
      // create a new function binded to proxy for handling the event
      // TODO: not reactive for nested objects and arrays
      const eventHandler = new Function('$event', value).bind(proxy);
      $el.addEventListener(eventName, eventHandler);
    } else if (name === 'show') {
      proxy.$show.push({ $el, propName: value });
      $el.style.display = proxy[value] ? '' : 'none';
    }
  });
  [...$el.children].forEach(($child) => {
    initElement($child, proxy);
  });
}

function initRoot($el, value) {
  // TODO: find another way to parse the data more like normal js objects
  //  because currently it only accept JSON
  const jsonData = JSON.parse(value);

  // create an object proxy to use in data binding
  const proxy = createObjectProxy(jsonData);
  [...$el.children].forEach(($child) => {
    initElement($child, proxy);
  });
}

// find element with 'data-set' to initialize the root element of the app
document.querySelectorAll('*').forEach(($el) => {
  Object.entries($el.dataset).forEach(([name, value]) => {
    if (name === 'set') {
      initRoot($el, value);
    }
  });
});

// remove all 'data-*' attributes
// idk, just to make the html looks cleaner
document.querySelectorAll('*').forEach(($el) => {
  Object.entries($el.dataset).forEach(([name, _]) => {
    delete $el.dataset[name];
  });
});
