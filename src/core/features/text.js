function textImpl(element, value, proxy) {
  proxy.$text.push({ element, value });
  element.innerHTML = proxy.$get(value);
}

export default textImpl;
