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
    success.textContent = "Thanks! We'll email you at launch.";
    form.reset();
  } catch {
    error.textContent = "Something went wrong. Please try again.";
  } finally {
    button.disabled = false;
    button.textContent = "Get notified";
  }
});
