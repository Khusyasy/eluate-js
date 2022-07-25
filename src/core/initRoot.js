import createObjectProxy from './createObjectProxy';
import initElement from './initElement';

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
