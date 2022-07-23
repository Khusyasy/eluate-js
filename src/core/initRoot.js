import initElement from './initElement';

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
