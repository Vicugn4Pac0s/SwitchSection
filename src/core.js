import getOffsetTop from "./functions/getOffsetTop";
import Observer from "./modules/Observer";

let observer = new Observer();

export default class {
  constructor(selector, options = {}) {
    this.selector = document.getElementById(selector);
    this.current_section = null;
    this.before_section = null;

    this.reset();
    this.events();
  }
  on(eventType, callback) {
    switch (eventType) {
      case "switch":
        observer.on("switch", callback.bind(this));
        this.scrollevent();
        break;
      default:
        console.log("Error");
    }
  }
  reset() {
    let self = this;
    self.sections = [];
    Array.prototype.forEach.call(self.selector.children, (element, index) => {
      self.sections.push({
        $_element: element,
        id: index,
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
      section.end = getOffsetTop(section.$_element) + section.$_element.clientHeight;
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

    self.sections.forEach((section) => {

      if (section.first < s && s <= section.end) {
        if (self.current_section === section.name) return;

        self.before_section = self.current_section;
        self.current_section = section.name;

        observer.trigger("switch", {
          $_element: section.$_element,
          current_section: self.current,
          before_section: self.before_section,
          target: section.target,
        });
      }
    });
  }
}
