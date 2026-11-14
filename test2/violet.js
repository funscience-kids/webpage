const hueButtons = document.querySelectorAll('.hue-switch button');
hueButtons.forEach(button => button.addEventListener('click', () => {
  document.documentElement.dataset.hue = button.dataset.hue;
  hueButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
}));
