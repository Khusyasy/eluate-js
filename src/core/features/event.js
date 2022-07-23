function eventImpl(eventName, element, value, proxy) {
  // TODO: not reactive for nested objects and arrays
  const eventHandler = new Function('$event', value).bind(proxy);
  element.addEventListener(eventName, eventHandler);
}

export default eventImpl;
