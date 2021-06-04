export default function(element) {
  return element.getBoundingClientRect().top + window.pageYOffset;
}