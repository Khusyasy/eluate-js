function createObjectProxy(target = {}) {
  // special properties used
  const $specials = {
    $text: [],
    $show: [],
    $model: [],
    $get(prop) {
      const setGlobal = Object.keys(target)
        .map((k) => `globalThis.${k} = this.${k}`)
        .join(';');
      return new Function(`${setGlobal};\nreturn ${prop}`).call(target);
    },
    $set(prop, value) {
      // user JSON stringify to any value convert into string
      let valueString = JSON.stringify(value);
      new Function(`return this.${prop} = ${valueString}`).call(target);

      // update the real DOM
      // data-text
      this.$text.forEach(({ element, value }) => {
        element.innerHTML = proxy.$get(value);
      });
      // data-show
      this.$show.forEach(({ element, value }) => {
        element.style.display = proxy.$get(value) ? '' : 'none';
      });
      // data-model
      this.$model.forEach(({ updateFn }) => {
        updateFn();
      });
    },
  };

  const proxy = new Proxy(target, {
    get(target, prop) {
      if (prop.startsWith('$')) {
        const $special = $specials[prop];
        if (!$special) throw new Error(`unknown special property '${prop}'`);
        return $special;
      }

      return $specials.$get(prop);
    },
    set(target, prop, value) {
      if (prop.startsWith('$')) {
        return "can't set special property";
      }

      $specials.$set(prop, value);
    },
  });
  return proxy;
}

export default createObjectProxy;
