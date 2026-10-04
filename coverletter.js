document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("coverLetterModal");
  const openBtn = document.getElementById("openCoverLetterBtn");
  const closeBtn = document.getElementById("closeCoverLetterBtn");

  if (openBtn && modal) {
    // Open modal on "View credentials →" click
    openBtn.addEventListener("click", () => {
      modal.classList.add("is-active");
    });
  }

  if (closeBtn && modal) {
    // Close modal on 'x' click
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("is-active");
    });
  }

  if (modal) {
    // Close modal when clicking on the dimmed backdrop
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("is-active");
      }
    });
  }

  // Close modal with the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("is-active")) {
      modal.classList.remove("is-active");
    }
  });
});