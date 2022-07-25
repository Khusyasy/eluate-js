import initRoot from './initRoot';

// find element with 'data-set' to initialize the root element of the app
function initRecursive(element) {
  Object.entries(element.dataset).forEach(([name, value]) => {
    if (name === 'set') {
      initRoot(element, value);
    }
  });
  [...element.children].forEach((child) => {
    initRecursive(child);
  });
  // remove all 'data-*' attributes
  // idk, just to make the html looks cleaner
    Object.entries(element.dataset).forEach(([name, _]) => {
    delete element.dataset[name];
  });
}

export default initRecursive;
