function showImpl(element, value, proxy) {
  proxy.$show.push({ element, value });
  element.style.display = proxy.$get(value) ? '' : 'none';
}

export default showImpl;
