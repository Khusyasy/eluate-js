function createFnGlobal(value, proxy) {
  const setGlobal = Object.keys(proxy)
    .map((k) => `globalThis.${k} = this.${k}`)
    .join(';');
  return new Function(`${setGlobal};\nreturn ${value}`).bind(proxy);
}

export { createFnGlobal };
