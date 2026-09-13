document.addEventListener("DOMContentLoaded", function () {
  console.log("MedFinder page loaded");

  const year = new Date().getFullYear();
  const footer = document.querySelector("footer");
  if (footer) {
    footer.textContent = "© " + year + " MedFinder Team";
  }
});
