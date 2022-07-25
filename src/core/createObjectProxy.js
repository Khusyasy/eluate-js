function createObjectProxy(target = {}) {
  // special property used
  const $text = [];
  const $show = [];
  const $model = [];
  function $get(prop) {
    const setGlobal = Object.keys(target)
      .map((k) => `globalThis.${k} = this.${k}`)
      .join(';');
    return new Function(`${setGlobal};\nreturn ${prop}`).call(target);
  }
  function $set(prop, value) {
    // user JSON stringify to any value convert into string
    let valueString = JSON.stringify(value);
    new Function(`return this.${prop} = ${valueString}`).call(target);

    // update the real DOM
    // data-text
    $text.forEach(({ element, value }) => {
      element.innerHTML = proxy.$get(value);
    });
    // data-show
    $show.forEach(({ element, value }) => {
      element.style.display = proxy.$get(value) ? '' : 'none';
    });
    // data-model
    $model.forEach(({ updateFn }) => {
      updateFn();
    });
  }

  // TODO: check for cases like nested objects or arrays for data-text and data-show (and maybe more later)
  const proxy = new Proxy(target, {
    get(target, prop) {
      if (prop.startsWith('$')) {
        if (prop === '$text') {
          return $text;
        } else if (prop === '$show') {
          return $show;
        } else if (prop === '$model') {
          return $model;
        } else if (prop === '$get') {
          return $get;
        } else if (prop === '$set') {
          return $set;
        } else {
          throw new Error(`Unknown special property: ${prop}`);
        }
      }

      return $get(prop);
    },
    set(target, prop, value) {
      if (prop.startsWith('$')) {
        return "can't set special property";
      }

      $set(prop, value);
    },
  });
  return proxy;
}

export default createObjectProxy;
