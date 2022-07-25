import initRoot from './initRoot';

// find element with 'data-set' to initialize the root element of the app
function initRecursive(element) {
  if (element.dataset['set']) {
    initRoot(element, element.dataset['set']);
  } else {
    [...element.children].forEach((child) => {
      initRecursive(child);
    });
  }
  delete element.dataset['set'];
}

export default initRecursive;
