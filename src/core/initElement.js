import textImpl from './features/text';
import eventImpl from './features/event';
import showImpl from './features/show';
import modelImpl from './features/model';

function initElement(element, proxy) {
  const vnode = {
    proxy,
    element,
    children: [],
  };

  Object.entries(element.dataset).forEach(([name, value]) => {
    if (name === 'text') {
      textImpl(element, value, proxy);
      delete element.dataset[name];
    } else if (name.startsWith('on:')) {
      const [, eventName] = name.split(':');
      eventImpl(eventName, element, value, proxy);
      delete element.dataset[name];
    } else if (name === 'show') {
      showImpl(element, value, proxy);
      delete element.dataset[name];
    } else if (name === 'model') {
      modelImpl(element, value, proxy);
      delete element.dataset[name];
    } else if (name === 'set') {
      throw new Error('`data-set` cannot be inside another `data-set`');
    }
  });
  [...element.children].forEach((child) => {
    const $childVDom = initElement(child, proxy);
    vnode.children.push($childVDom);
  });

  return vnode;
}

export default initElement;
