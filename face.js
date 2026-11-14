// Test: one small gesture at a time (brows, smile), by swapping whole frames like the app does.
// Blinking keeps running on its own (script.js) and sits on top of every frame.
(() => {
  const octo = document.querySelector('.octo');
  if (!octo || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const frames = {};
  octo.querySelectorAll('.octo-frame').forEach(img => { frames[img.dataset.frame] = img; });
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const show = name => Object.entries(frames).forEach(([key, img]) => img.classList.toggle('on', key === name));
  const play = async steps => { for (const [name, ms] of steps) { show(name); await wait(ms); } };
  const step = 110;
  const gestures = [
    [['smile-1', step], ['smile-2', 1500], ['smile-1', step], ['rest', 0]],
    [['brows-1', step], ['brows-2', 1000], ['brows-1', step], ['rest', 0]],
  ];
  (async () => {
    await wait(2500);
    for (let i = 0; ; i = (i + 1) % gestures.length) {
      if (!document.hidden) await play(gestures[i]);
      await wait(3500 + Math.random() * 3000);
    }
  })();
})();
