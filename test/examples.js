const choices = Array.from(document.querySelectorAll('[data-demo]'));
const panels = Array.from(document.querySelectorAll('[data-panel]'));
function chooseExample(index) {
  choices.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  panels.forEach((panel, i) => { panel.hidden = i !== index; });
}
choices.forEach((button, i) => button.addEventListener('click', () => chooseExample(i)));
chooseExample(0);
