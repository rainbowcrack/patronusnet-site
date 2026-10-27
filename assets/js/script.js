/* =========================================================
   PATRONUSNET — SCRIPT GLOBAL
   Navegação, menu mobile e utilidades comuns.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ANO DO FOOTER
    ===================================================== */

    const ano = document.getElementById("ano");

    if (ano) {
        ano.textContent = new Date().getFullYear();
    }


    /* =====================================================
       MENU MOBILE
    ===================================================== */

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {

        const closeMenu = () => {
            navToggle.classList.remove("active");
            navLinks.classList.remove("open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Abrir menu");
        };

        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.classList.toggle("active");

            navLinks.classList.toggle("open", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );
        });

        /* Fecha ao clicar num link */
        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        /* Fecha ao clicar fora */
        document.addEventListener("click", (event) => {
            const insideNav = navLinks.contains(event.target);
            const onToggle = navToggle.contains(event.target);

            if (!insideNav && !onToggle) {
                closeMenu();
            }
        });

        /* Fecha com ESC */
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });
    }


    /* =====================================================
       SCROLL SUAVE PARA ÂNCORAS
    ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const header = document.querySelector(".site-header");
            const headerHeight = header ? header.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                20;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });
        });
    });
});
