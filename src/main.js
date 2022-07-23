import initRoot from './core/initRoot';

// find element with 'data-set' to initialize the root element of the app
document.querySelectorAll('*').forEach((element) => {
  Object.entries(element.dataset).forEach(([name, value]) => {
    if (name === 'set') {
      initRoot(element, value);
    }
  });
});

// remove all 'data-*' attributes
// idk, just to make the html looks cleaner
document.querySelectorAll('*').forEach((element) => {
  Object.entries(element.dataset).forEach(([name, _]) => {
    delete element.dataset[name];
  });
});
