export default class {
  constructor() {
    this.listeners = {};
  }
  on(event, func) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(func);
  }
  off(event, func) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(func);
  }
  trigger(event, args) {
    if (!this.listeners[event]) {
      return;
    }
    var ref = this.listeners[event];
    for (var i = 0, len = ref.length; i < len; i++) {
      var listener = ref[i];
      if (typeof listener === "function") listener(args);
    }
  }
}