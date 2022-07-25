import createObjectProxy from './createObjectProxy';
import initElement from './initElement';

function initRoot(element, value) {
  if (value === '') value = '{}';
  const dataObj = new Function(`return ${value};`)();
  if (dataObj.constructor !== Object) {
    throw new Error('`data-set` value must be an object');
  }

  const vroot = {
    proxy: createObjectProxy(dataObj),
    element,
    children: [],
  };

  // create an object proxy to use in data binding
  const proxy = createObjectProxy(dataObj);
  [...element.children].forEach((child) => {
    const vnode = initElement(child, proxy);
    vroot.children.push(vnode);
  });

  console.log('vroot', vroot);
  return vroot;
}

export default initRoot;
