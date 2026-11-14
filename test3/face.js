// Test: every so often the octopus smiles a little wider, then relaxes. Blinking runs on its own (script.js).
(() => {
  const octo = document.querySelector('.octo');
  if (!octo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  (async () => {
    await wait(3500);
    for (;;) {
      if (!document.hidden) { octo.classList.add('is-smile'); await wait(1400 + Math.random() * 800); octo.classList.remove('is-smile'); }
      await wait(6000 + Math.random() * 5000);
    }
  })();
})();
