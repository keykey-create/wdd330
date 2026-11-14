const ctaForm = document.querySelector("#cta-form");
const ctaMessage = document.querySelector("#cta-message");

ctaForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.querySelector("#cta-email").value;
  localStorage.setItem("subscribedEmail", email);
  
  ctaForm.classList.add("hidden");
  ctaMessage.textContent = `Thanks for joining, ${email}! Check your inbox for more information, and member deals!`;
  ctaMessage.classList.remove("hidden");
});