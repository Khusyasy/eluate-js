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
      let result = target[prop];
      return result;
    },
    set(target, prop, value) {
      if (prop === '$text') {
        $text = value;
      } else if (prop === '$show') {
        $show = value;
      }
      target[prop] = value;

      // update the real DOM
      // data-text
      $text.forEach(({ $el, prop }) => {
        $el.innerHTML = target[prop];
      });
      // data-show
      $show.forEach(({ $el, prop }) => {
        $el.style.display = target[prop] ? '' : 'none';
      });
    },
  });
  return proxy;
}

function initElement($el, proxy) {
  Object.entries($el.dataset).forEach(([name, value]) => {
    if (name === 'text') {
      // add the element to the $instances array, so we can update it later when the value changes
      proxy.$text.push({ $el, prop: value });
      $el.innerHTML = proxy[value];
    } else if (name.startsWith('on:')) {
      const [, eventName] = name.split(':');
      // create a new function to handle the event
      // binded to the proxy so we can use 'this' to access the data
      const eventHandler = new Function(value).bind(proxy);
      $el.addEventListener(eventName, eventHandler);
    } else if (name === 'show') {
      proxy.$show.push({ $el, prop: value });
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
