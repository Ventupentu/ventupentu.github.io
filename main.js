// main.js gestiona el tema, animaciones adaptadas y microinteracciones sobrias.
(function () {
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const yearTarget = document.getElementById("current-year");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const STORAGE_KEY = "ventura-theme";

  const setTheme = (theme) => {
    const normalizedTheme = theme === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", normalizedTheme);
    if (themeToggle) {
      const isDark = normalizedTheme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.innerHTML = `<span aria-hidden="true">${isDark ? "Oscuro" : "Claro"}</span><span class="sr-only">Cambiar a modo ${isDark ? "claro" : "oscuro"}</span>`;
    }
  };

  const loadTheme = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
      return stored;
    }
    const prefersDark = systemThemeQuery.matches;
    const initialTheme = prefersDark ? "dark" : "light";
    setTheme(initialTheme);
    return initialTheme;
  };

  let currentTheme = loadTheme();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(currentTheme);
      try {
        localStorage.setItem(STORAGE_KEY, currentTheme);
      } catch (error) {
        // Si localStorage falla (modo incógnito), ignoramos sin romper la UI.
      }
    });
  }

  systemThemeQuery.addEventListener("change", (event) => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return; // Respeta preferencia explícita del usuario.
    currentTheme = event.matches ? "dark" : "light";
    setTheme(currentTheme);
  });

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  const shouldReduceMotion = () => reducedMotionQuery.matches;

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;
      event.preventDefault();
      if (shouldReduceMotion()) {
        target.scrollIntoView();
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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

  reducedMotionQuery.addEventListener("change", () => {
    // Esto permite que la navegación futura respete cambios dinámicos del usuario.
  });

  console.info("Hola, mundo Bauhaus!");
})();
