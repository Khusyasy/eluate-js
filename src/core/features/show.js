import { createFnGlobal } from '../functions';

function showImpl(element, value, proxy) {
  const valueFn = createFnGlobal(value, proxy);
  proxy.$show.push({ element, valueFn });
  element.style.display = valueFn() ? '' : 'none';
}

export default showImpl;
