const SUBMISSION_ENDPOINT = "https://script.google.com/macros/s/AKfycby_5Iy_QyVm1HdpUuOvkFAl_dy0y_HyC9XCSaTbtFPzQgf-FXKIKQR6gpFcDcZfrIFUgw/exec";
const form = document.querySelector("#emailForm");
const input = document.querySelector("#emailInput");
const button = document.querySelector("#submitButton");
const error = document.querySelector("#emailError");
const success = document.querySelector("#pageSuccess");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  error.textContent = "";
  success.textContent = "";
  if (form.elements.website.value) return;
  const email = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    error.textContent = "Please enter a valid email address.";
    input.focus();
    return;
  }
  button.disabled = true;
  button.textContent = "Sending…";
  const payload = {
    submissionId: crypto.randomUUID ? crypto.randomUUID() : `waitlist-${Date.now()}`,
    submissionType: "email_only",
    email,
    childAge: [],
    homeschool: "",
    earlyFeedback: "Email submitted",
    submittedAt: new Date().toISOString()
  };
  try {
    await fetch(SUBMISSION_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    success.textContent = "Thanks! We'll contact you to arrange testing with your family.";
    form.reset();
  } catch {
    error.textContent = "Something went wrong. Please try again.";
  } finally {
    button.disabled = false;
    button.textContent = "Sign Up for Testing";
  }
});


const exampleButtons = Array.from(document.querySelectorAll('[data-example]'));
const examplePanels = Array.from(document.querySelectorAll('[data-example-panel]'));
function selectExample(index) {
  examplePanels.forEach((panel, i) => { panel.hidden = i !== index; });
  exampleButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
}
exampleButtons.forEach((button, i) => button.addEventListener('click', () => selectExample(i)));
if (examplePanels.length) selectExample(0);

const ngssTrigger = document.querySelector('.ngss-trigger');
const ngssHelp = document.querySelector('#ngss-help');
if (ngssTrigger && ngssHelp) {
  let pinned = false;
  function showHelp(open) {
    ngssHelp.hidden = !open;
    ngssTrigger.setAttribute('aria-expanded', String(open));
  }
  ngssTrigger.addEventListener('mouseenter', () => showHelp(true));
  ngssTrigger.addEventListener('mouseleave', () => {
    if (!pinned && document.activeElement !== ngssTrigger) showHelp(false);
  });
  ngssTrigger.addEventListener('focus', () => showHelp(true));
  ngssTrigger.addEventListener('blur', () => { if (!pinned) showHelp(false); });
  ngssTrigger.addEventListener('click', () => { pinned = !pinned; showHelp(pinned); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { pinned = false; showHelp(false); }
  });
  document.addEventListener('click', event => {
    if (!ngssTrigger.contains(event.target) && !ngssHelp.contains(event.target)) {
      pinned = false;
      showHelp(false);
    }
  });
}
