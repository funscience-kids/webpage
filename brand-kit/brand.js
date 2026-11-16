// Brand kit: copy a color's hex code on tap.
document.querySelectorAll('.copy').forEach(button => button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(button.dataset.copy); } catch { return; }
  button.classList.add('copied');
  setTimeout(() => button.classList.remove('copied'), 1500);
}));
