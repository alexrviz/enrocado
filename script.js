(() => {
  "use strict";

  const form = document.querySelector("[data-email-form]");
  const status = document.querySelector("#form-status");
  const button = form?.querySelector("button[type='submit']");
  const endpoint = window.SITE_CONFIG?.formEndpoint?.trim();

  document.querySelector("[data-year]").textContent = new Date().getFullYear();

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!endpoint) {
      status.textContent = "Formulario en modo prueba: añade el endpoint en config.js.";
      return;
    }

    button.disabled = true;
    button.textContent = "ENVIANDO…";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.elements.email.value.trim(),
          website: form.elements.website.value,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "No se pudo completar el envío.");

      form.reset();
      status.textContent = "Listo. Revisa tu bandeja de entrada.";
    } catch (error) {
      status.textContent = error.message || "Ha ocurrido un error. Inténtalo de nuevo.";
    } finally {
      button.disabled = false;
      button.innerHTML = "ENVIAR <span aria-hidden='true'>→</span>";
    }
  });
})();
