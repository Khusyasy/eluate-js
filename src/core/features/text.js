import { createFnGlobal } from '../functions';

function textImpl(element, value, proxy) {
  const valueFn = createFnGlobal(value, proxy);
  proxy.$text.push({ element, valueFn });
  element.innerHTML = valueFn();
}

export default textImpl;
