// Add your data collection endpoint here.
// Examples:
// - Formspree endpoint: "https://formspree.io/f/your-form-id"
// - Netlify Function: "/.netlify/functions/waitlist"
// - Supabase/Firebase proxy endpoint: "https://your-domain.com/api/waitlist"
const SUBMISSION_ENDPOINT = "https://script.google.com/macros/s/AKfycby_5Iy_QyVm1HdpUuOvkFAl_dy0y_HyC9XCSaTbtFPzQgf-FXKIKQR6gpFcDcZfrIFUgw/exec";

const STORAGE_KEY = "pendingWaitlistEmail";
const SUBMISSION_ID_KEY = "pendingWaitlistSubmissionId";

const emailForm = document.querySelector("#emailForm");
const emailInput = document.querySelector("#emailInput");
const emailError = document.querySelector("#emailError");
const pageSuccess = document.querySelector("#pageSuccess");
const surveyModal = document.querySelector("#surveyModal");
const surveyForm = document.querySelector("#surveyForm");
const surveyError = document.querySelector("#surveyError");
const surveySteps = Array.from(document.querySelectorAll(".survey-step"));
const surveyBack = document.querySelector("#surveyBack");
const surveyNext = document.querySelector("#surveyNext");
const surveySubmit = document.querySelector("#surveySubmit");
const surveyStepCurrent = document.querySelector("#surveyStepCurrent");
const surveyStepTotal = document.querySelector("#surveyStepTotal");
const surveyProgress = surveyForm ? surveyForm.querySelector(".survey-progress") : null;
const surveyProgressFill = document.querySelector("#surveyProgressFill");
const modalIntro = surveyModal ? surveyModal.querySelector(".modal-intro") : null;
const surveyThanks = document.querySelector("#surveyThanks");
const closeButtons = document.querySelectorAll("[data-close-modal]");
const navLinks = Array.from(document.querySelectorAll(".site-nav a[href^='#']"));
const backToTop = document.querySelector(".back-to-top");
const scrollImageSection = document.querySelector(".scroll-image-section");
const familyImageSection = document.querySelector(".family-image-section");
const ngssHelp = document.querySelector(".ngss-help");
const ngssTrigger = document.querySelector(".ngss-trigger");
const ngssTooltip = document.querySelector("#ngssTooltip");
let ngssCloseTimer = null;
let surveyCompleted = false;
let emailOnlySubmitting = false;
let scrollImageTicking = false;
let currentSurveyStep = 0;
let partialSaveTimer = null;
const useJsParallax = !(window.CSS && CSS.supports("animation-timeline", "scroll()"));

// Gentle fade-up animation for sections and staggered lists as they scroll into view.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.06, rootMargin: "0px 0px -8% 0px" });

document.querySelectorAll(".reveal, .reveal-list, .scroll-image-section, .family-image-section").forEach((element) => {
  revealObserver.observe(element);
});

const storyStepObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      storyStepObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.45, rootMargin: "0px 0px -14% 0px" });

document.querySelectorAll(".story-step-cards .stagger-item").forEach((element) => {
  storyStepObserver.observe(element);
});

function closeNgssHelp() {
  if (!ngssHelp || !ngssTrigger) return;

  window.clearTimeout(ngssCloseTimer);
  ngssCloseTimer = null;
  ngssHelp.classList.remove("is-open");
  ngssTrigger.setAttribute("aria-expanded", "false");
  if (ngssTooltip) {
    ngssTooltip.classList.remove("is-open");
    ngssTooltip.hidden = true;
  }
}

if (ngssHelp && ngssTrigger) {
  ngssTrigger.addEventListener("click", (event) => {
    event.stopPropagation();
    window.clearTimeout(ngssCloseTimer);
    const isOpen = ngssHelp.classList.toggle("is-open");
    ngssTrigger.setAttribute("aria-expanded", String(isOpen));
    if (ngssTooltip) {
      ngssTooltip.hidden = !isOpen;
      ngssTooltip.classList.toggle("is-open", isOpen);
    }
    if (isOpen) {
      ngssCloseTimer = window.setTimeout(closeNgssHelp, 9000);
    }
  });

  document.addEventListener("click", (event) => {
    if (!ngssHelp.contains(event.target) && !ngssTooltip?.contains(event.target)) {
      closeNgssHelp();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNgssHelp();
    }
  });
}

function updateScrollImageParallax() {
  if (!useJsParallax || !scrollImageSection) return;

  const rect = scrollImageSection.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
  scrollImageSection.style.backgroundPositionY = `${progress * 100}%`;
}

function updateFamilyImageParallax() {
  if (!useJsParallax || !familyImageSection) return;

  const rect = familyImageSection.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
  familyImageSection.style.backgroundPositionY = `${18 + progress * 82}%`;
}

function requestScrollImageParallaxUpdate() {
  if (scrollImageTicking) return;

  scrollImageTicking = true;
  window.requestAnimationFrame(() => {
    updateScrollImageParallax();
    updateFamilyImageParallax();
    scrollImageTicking = false;
  });
}

const navSections = Array.from(document.querySelectorAll("#learning, #fit, #about, #waitlist"));
let navTicking = false;

function setActiveNav(activeId = "") {
  navLinks.forEach((link) => {
    const linkTarget = link.getAttribute("href").slice(1);
    link.classList.toggle("is-active", Boolean(activeId) && linkTarget === activeId);
  });
}

// Keep exactly one menu item active. On the hero screen no section is active,
// which avoids confusing double highlights on small mobile viewports.
function updateActiveNav() {
  const marker = window.innerHeight * 0.42;
  const currentSection = navSections.find((section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= marker && rect.bottom > marker;
  });

  setActiveNav(currentSection ? currentSection.id : "");
  if (backToTop) {
    backToTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.75);
  }

  navTicking = false;
}

function requestActiveNavUpdate() {
  if (navTicking) return;

  navTicking = true;
  window.requestAnimationFrame(updateActiveNav);
}

window.addEventListener("scroll", requestActiveNavUpdate, { passive: true });
window.addEventListener("resize", requestActiveNavUpdate);
updateActiveNav();

if (scrollImageSection || familyImageSection) {
  window.addEventListener("scroll", requestScrollImageParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestScrollImageParallaxUpdate);
  updateScrollImageParallax();
  updateFamilyImageParallax();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createSubmissionId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `waitlist-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getPendingSubmissionId() {
  let submissionId = sessionStorage.getItem(SUBMISSION_ID_KEY);

  if (!submissionId) {
    submissionId = createSubmissionId();
    sessionStorage.setItem(SUBMISSION_ID_KEY, submissionId);
  }

  return submissionId;
}

function isNotParentSelected() {
  const notParentInput = surveyForm.querySelector('input[name="childAge"][value="Not a parent"]');
  return Boolean(notParentInput && notParentInput.checked);
}

// When "Not a parent" is selected, the follow-up questions don't apply,
// so the survey collapses to a single step that submits right away.
function effectiveSurveyStepCount() {
  return isNotParentSelected() ? 1 : surveySteps.length;
}

function setSurveyStep(stepIndex) {
  const stepCount = effectiveSurveyStepCount();
  const lastStep = stepCount - 1;
  currentSurveyStep = Math.max(0, Math.min(stepIndex, lastStep));

  surveySteps.forEach((step, index) => {
    step.classList.toggle("is-active", index === currentSurveyStep);
  });

  // The intro line belongs to the first screen only.
  if (modalIntro) {
    modalIntro.hidden = currentSurveyStep !== 0;
  }

  // Hide the progress meter entirely when there is only one step to answer.
  if (surveyProgress) {
    surveyProgress.hidden = stepCount <= 1;
  }

  if (surveyStepCurrent) {
    surveyStepCurrent.textContent = String(currentSurveyStep + 1);
  }

  if (surveyStepTotal) {
    surveyStepTotal.textContent = String(stepCount);
  }

  if (surveyProgressFill) {
    surveyProgressFill.style.width = `${((currentSurveyStep + 1) / stepCount) * 100}%`;
  }

  if (surveyBack) {
    surveyBack.hidden = currentSurveyStep === 0;
  }

  if (surveyNext) {
    surveyNext.hidden = currentSurveyStep >= lastStep;
  }

  if (surveySubmit) {
    surveySubmit.hidden = currentSurveyStep !== lastStep;
  }

  surveyError.textContent = "";
  const modalCard = surveyModal.querySelector(".modal-card");
  if (modalCard) modalCard.scrollTop = 0;
}

function openSurveyModal() {
  surveyModal.classList.add("is-open");
  surveyModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  surveyForm.hidden = false;
  if (surveyThanks) surveyThanks.hidden = true;
  setSurveyStep(0);
}

// Shown inside the modal once the survey is submitted, replacing the questions.
// Tailor the confirmation to what the person agreed to, so someone who
// opted into a call or the form doesn't just hear "we'll contact you later".
function surveyThanksMessage() {
  const choice = getRadioValue(surveyForm, "earlyFeedback");
  if (choice === "Join a 15-minute Zoom call" || choice === "Fill out a 5-minute Google Form") {
    return "Thank you! We’ll be in touch with the details.";
  }
  return "Thank you! We’ll let you know when the app is ready.";
}

function showSurveyThanks() {
  const thanksText = surveyThanks ? surveyThanks.querySelector("p") : null;
  // Read the answer before reset() clears it.
  if (thanksText) thanksText.textContent = surveyThanksMessage();
  surveyForm.reset();
  updateNotParentState();
  setSurveyStep(0);
  surveyForm.hidden = true;
  if (modalIntro) modalIntro.hidden = true;
  if (surveyThanks) surveyThanks.hidden = false;
  const modalCard = surveyModal.querySelector(".modal-card");
  if (modalCard) modalCard.scrollTop = 0;
}

function finishEmailOnlySignup() {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(SUBMISSION_ID_KEY);
  surveyForm.reset();
  updateNotParentState();
  setSurveyStep(0);
  emailForm.reset();
  pageSuccess.textContent = "Thank you! We’ll contact you when the app is ready.";
}

function closeSurveyModal({ saveEmailOnly = false } = {}) {
  if (saveEmailOnly) {
    if (surveyCompleted) {
      finishEmailOnlySignup();
    } else {
      submitPartialSurvey("popup_closed", { closeAfterSave: true });
    }
  }

  surveyModal.classList.remove("is-open");
  surveyModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function getCheckedValues(form, name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function getRadioValue(form, name) {
  const selected = form.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : "";
}

function updateNotParentState() {
  const notParentInput = surveyForm.querySelector('input[name="childAge"][value="Not a parent"]');
  const ageInputs = Array.from(surveyForm.querySelectorAll('input[name="childAge"]'));
  if (!notParentInput) return;

  if (notParentInput.checked) {
    ageInputs.forEach((input) => {
      if (input !== notParentInput) {
        input.checked = false;
        input.disabled = true;
      }
    });
  } else {
    ageInputs.forEach((input) => {
      input.disabled = false;
    });
  }
}

function getSurveyPayload(submissionType = "survey_partial") {
  const email = sessionStorage.getItem(STORAGE_KEY) || emailInput.value.trim();

  return {
    submissionId: getPendingSubmissionId(),
    submissionType,
    email,
    childAge: getCheckedValues(surveyForm, "childAge"),
    homeschool: getRadioValue(surveyForm, "homeschool"),
    earlyFeedback: getRadioValue(surveyForm, "earlyFeedback"),
    submittedAt: new Date().toISOString()
  };
}

function submitPartialSurvey(reason = "survey_partial", { closeAfterSave = false } = {}) {
  const email = sessionStorage.getItem(STORAGE_KEY) || emailInput.value.trim();
  if (!email || !isValidEmail(email) || surveyCompleted) return;

  window.clearTimeout(partialSaveTimer);
  const payload = getSurveyPayload(reason);
  queueWaitlistData(payload);

  if (closeAfterSave) {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SUBMISSION_ID_KEY);
    surveyForm.reset();
    updateNotParentState();
    setSurveyStep(0);
    emailForm.reset();
    pageSuccess.textContent = "Thank you! We’ll contact you when the app is ready.";
  }
}

function schedulePartialSurveySave() {
  window.clearTimeout(partialSaveTimer);
  partialSaveTimer = window.setTimeout(() => {
    submitPartialSurvey("survey_partial");
  }, 180);
}

function validateSurveyStep(stepIndex) {
  const childAge = getCheckedValues(surveyForm, "childAge");
  const homeschool = getRadioValue(surveyForm, "homeschool");
  const earlyFeedback = getRadioValue(surveyForm, "earlyFeedback");

  if (stepIndex === 0 && childAge.length === 0) {
    return "Please select at least one option.";
  }

  if (stepIndex === 1 && !homeschool) {
    return "Please choose one answer.";
  }

  if (stepIndex === 2 && !earlyFeedback) {
    return "Please choose one answer.";
  }

  return "";
}

function validateSurveyAnswers() {
  const stepCount = effectiveSurveyStepCount();
  for (let index = 0; index < stepCount; index += 1) {
    const message = validateSurveyStep(index);
    if (message) {
      setSurveyStep(index);
      return message;
    }
  }

  return "";
}

// Final submission point.
// The payload already contains email, the three answers, and timestamp.
// To connect a backend, set SUBMISSION_ENDPOINT above and make sure that endpoint accepts JSON.
async function submitWaitlistData(payload) {
  if (!SUBMISSION_ENDPOINT) {
    console.log("Waitlist submission payload:", payload);
    return { ok: true };
  }

  if (SUBMISSION_ENDPOINT.includes("script.google.com")) {
    await fetch(SUBMISSION_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    return { ok: true };
  }

  const response = await fetch(SUBMISSION_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Submission failed");
  }

  return response;
}

function queueWaitlistData(payload) {
  if (!SUBMISSION_ENDPOINT) {
    console.log("Waitlist submission payload:", payload);
    return true;
  }

  const body = JSON.stringify(payload);

  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const queued = navigator.sendBeacon(SUBMISSION_ENDPOINT, blob);
    if (queued) return true;
  }

  fetch(SUBMISSION_ENDPOINT, {
    method: "POST",
    mode: SUBMISSION_ENDPOINT.includes("script.google.com") ? "no-cors" : "cors",
    keepalive: true,
    headers: {
      "Content-Type": SUBMISSION_ENDPOINT.includes("script.google.com")
        ? "text/plain;charset=utf-8"
        : "application/json"
    },
    body
  }).catch((error) => {
    console.error(error);
  });

  return true;
}

async function submitEmailOnly(reason, { keepPending = false, force = false, background = false } = {}) {
  if ((surveyCompleted && !force) || emailOnlySubmitting) return;

  const email = sessionStorage.getItem(STORAGE_KEY) || emailInput.value.trim();
  if (!email || !isValidEmail(email)) return;

  emailOnlySubmitting = true;

  const payload = {
    submissionId: getPendingSubmissionId(),
    submissionType: "email_only",
    email,
    childAge: [],
    homeschool: "",
    earlyFeedback: reason,
    submittedAt: new Date().toISOString()
  };

  try {
    if (background) {
      queueWaitlistData(payload);
    } else {
      await submitWaitlistData(payload);
    }

    if (!keepPending) {
      surveyCompleted = true;
    }
    if (!keepPending) {
      finishEmailOnlySignup();
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    emailOnlySubmitting = false;
  }
}

// Step 1:
// The visitor enters an email. We validate it and temporarily store it in
// sessionStorage so it stays associated with the popup answers.
emailForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  emailError.textContent = "";
  pageSuccess.textContent = "";

  if (!email) {
    emailError.textContent = "Field is not filled";
    emailInput.focus();
    return;
  }

  if (!isValidEmail(email)) {
    emailError.textContent = "Please enter a valid email address";
    emailInput.focus();
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, email);
  sessionStorage.setItem(SUBMISSION_ID_KEY, createSubmissionId());
  surveyCompleted = false;

  try {
    await submitEmailOnly("Email submitted", { keepPending: true, force: true, background: true });
    openSurveyModal();
  } catch (error) {
    console.error(error);
    emailError.textContent = "Something went wrong. Please try again.";
  }
});

surveyForm.addEventListener("change", (event) => {
  if (event.target.name === "childAge") {
    updateNotParentState();
    // Toggling "Not a parent" changes how many steps remain, so refresh
    // the navigation (NEXT vs SUBMIT) and progress for the current step.
    setSurveyStep(currentSurveyStep);
  }

  submitPartialSurvey("survey_partial");
});

if (surveyNext) {
  surveyNext.addEventListener("click", () => {
    const validationMessage = validateSurveyStep(currentSurveyStep);
    surveyError.textContent = validationMessage;
    if (validationMessage) return;

    submitPartialSurvey("survey_partial");
    setSurveyStep(currentSurveyStep + 1);
  });
}

if (surveyBack) {
  surveyBack.addEventListener("click", () => {
    setSurveyStep(currentSurveyStep - 1);
  });
}

// Step 2:
// The popup collects the three required follow-up answers. On submit, we build
// one payload object with the stored email, answers, and submission timestamp.
surveyForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const validationMessage = validateSurveyAnswers();
  surveyError.textContent = validationMessage;
  if (validationMessage) return;

  const email = sessionStorage.getItem(STORAGE_KEY) || emailInput.value.trim();

  if (!email || !isValidEmail(email)) {
    surveyError.textContent = "Please return to the email form and enter a valid email address.";
    closeSurveyModal();
    emailInput.focus();
    return;
  }

  const payload = getSurveyPayload("survey_completed");

  try {
    window.clearTimeout(partialSaveTimer);
    queueWaitlistData(payload);
    surveyCompleted = true;
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SUBMISSION_ID_KEY);
    emailForm.reset();
    showSurveyThanks();
  } catch (error) {
    console.error(error);
    surveyError.textContent = "Something went wrong. Please try again.";
  }
});

closeButtons.forEach((button) => {
  button.addEventListener("click", () => closeSurveyModal({ saveEmailOnly: true }));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && surveyModal.classList.contains("is-open")) {
    closeSurveyModal({ saveEmailOnly: true });
  }
});
