// Funciones ligeras para microinteracciones básicas.
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const yearTarget = document.getElementById("current-year");
    if (yearTarget) {
      yearTarget.textContent = new Date().getFullYear();
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);
        if (!target) {
          return;
        }
        event.preventDefault();
        const behavior = prefersReducedMotion.matches ? "auto" : "smooth";
        target.scrollIntoView({ behavior, block: "start" });
        target.setAttribute("tabindex", "-1");
        try {
          target.focus({ preventScroll: true });
        } catch (error) {
          target.focus();
        }
        target.addEventListener(
          "blur",
          () => {
            target.removeAttribute("tabindex");
          },
          { once: true }
        );
      });
    });
  });

  console.info("Hola, mundo en modo claro.");
})();
