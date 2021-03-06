import getOffsetTop from "./functions/getOffsetTop";
import Observer from "./modules/Observer";

export default class {
  constructor(selector, options = {}) {
    let self = this;
    self.Observer = new Observer();
    if (Array.isArray(selector)) {
      self.selectors = [];
      selector.forEach((selector) => {
        self.selectors.push(document.getElementById(selector));
      });
    } else {
      self.selectors = document.getElementById(selector).children;
    }
    self.current_section = null;
    self.before_section = null;

    self.reset();
    self.events();
  }
  on(eventType, callback) {
    switch (eventType) {
      case "switch":
        this.Observer.on("switch", callback.bind(this));
        break;
      case "onBefore":
        this.Observer.on("onBefore", callback.bind(this));
        break;
      case "onAfter":
        this.Observer.on("onAfter", callback.bind(this));
        break;
      default:
        console.log("Error");
    }
  }
  switch() {
    this.scrollevent();
  }
  reset() {
    let self = this;
    self.sections = [];
    Array.prototype.forEach.call(self.selectors, (element, index) => {
      self.sections.push({
        $_element: element,
        index: index,
        id: "section_" + index,
        name: element.dataset.name || "section_" + index,
        target: element.dataset.target || null,
        first: getOffsetTop(element),
        end: getOffsetTop(element) + element.clientHeight,
      });
    });
  }
  update() {
    let self = this;
    self.sections.forEach((section) => {
      section.first = getOffsetTop(section.$_element);
      section.end =
        getOffsetTop(section.$_element) + section.$_element.clientHeight;
    });
  }
  events() {
    let self = this;
    window.addEventListener("scroll", function (e) {
      self.update();
      self.scrollevent();
    });
  }
  scrollevent() {
    let self = this;
    let s = window.pageYOffset + window.innerHeight / 2;
    let count = 0;
    let sections_len = self.sections.length;

    self.sections.forEach((section) => {

      //??????????????????????????????????????????
      if (count === 0) {
        if (section.first >= s) {
          if (self.current_section === 'is-before-section') return;

          self.before_section = self.current_section;
          self.current_section = 'is-before-section';

          self.Observer.trigger("onBefore", {});
        }
      }
      //?????????????????????????????????????????????
      if (count === sections_len - 1) {
        if (s > section.end) {
          if (self.current_section === 'is-after-section') return;

          self.before_section = self.current_section;
          self.current_section = 'is-after-section';
          
          self.Observer.trigger("onAfter", {});
        }
      }
      count++;

      if (section.first < s && s <= section.end) {
        if (self.current_section === section.name) return;

        self.before_section = self.current_section;
        self.current_section = section.name;

        self.Observer.trigger("switch", {
          $_element: section.$_element,
          index: section.index,
          id: section.id,
          current_section: self.current_section,
          before_section: self.before_section,
          target: section.target,
        });
      }
    });
  }
}
