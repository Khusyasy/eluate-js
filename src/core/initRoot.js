import initElement from './initElement';

function createObjectProxy(target = {}) {
  // special property used
  const $text = [];
  const $show = [];
  function $get(prop) {
    return new Function(`return this.${prop}`).call(target);
  }
  function $set(prop, value) {
    // user JSON stringify to any value convert into string
    let valueString = JSON.stringify(value);
    new Function(`return this.${prop} = ${valueString}`).call(target);
  }

  // TODO: check for cases like nested objects or arrays for data-text and data-show (and maybe more later)
  const proxy = new Proxy(target, {
    get(target, prop) {
      if (prop.startsWith('$')) {
        if (prop === '$text') {
          return $text;
        } else if (prop === '$show') {
          return $show;
        } else if (prop === '$get') {
          return $get;
        } else if (prop === '$set') {
          return $set;
        } else {
          throw new Error(`Unknown special property: ${prop}`);
        }
      }

      return $get(prop);
    },
    set(target, prop, value) {
      if (prop.startsWith('$')) {
        return "can't set special property";
      }

      $set(prop, value);

      // update the real DOM
      // data-text
      $text.forEach(({ element, valueFn }) => {
        element.innerHTML = valueFn();
      });
      // data-show
      $show.forEach(({ element, valueFn }) => {
        element.style.display = valueFn() ? '' : 'none';
      });
    },
  });
  return proxy;
}

function initRoot(element, value) {
  if (value === '') value = '{}';
  const dataObj = new Function(`return ${value};`)();
  if (dataObj.constructor !== Object) {
    throw new Error('`data-set` value must be an object');
  }

  // create an object proxy to use in data binding
  const proxy = createObjectProxy(dataObj);
  [...element.children].forEach((child) => {
    initElement(child, proxy);
  });
}

export default initRoot;
