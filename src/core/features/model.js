function modelImpl(element, value, proxy) {
  // TODO: handle for other form types 
  const updateFn = function () {
    element.value = proxy.$get(value);
  };
  proxy.$model.push({ updateFn });
  updateFn();
  element.addEventListener('input', (e) => {
    proxy.$set(value, e.target.value);
  });
}

export default modelImpl;
