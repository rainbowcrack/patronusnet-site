/* =========================================================
   PATRONUSNET — SOBRE NÓS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       ANO DO FOOTER
       ====================================================== */

    const ano = document.getElementById("ano");

    if (ano) {
        ano.textContent = new Date().getFullYear();
    }


    /* =====================================================
       MENU MOBILE
       ====================================================== */

    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
        navToggle.addEventListener("click", () => {
            const isOpen = navToggle.classList.toggle("active");

            navLinks.classList.toggle("open", isOpen);

            navToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            navToggle.setAttribute(
                "aria-label",
                isOpen ? "Fechar menu" : "Abrir menu"
            );
        });


        /* Fecha o menu ao clicar em um link */

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navToggle.classList.remove("active");
                navLinks.classList.remove("open");

                navToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                navToggle.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );
            });
        });


        /* Fecha o menu ao clicar fora */

        document.addEventListener("click", (event) => {
            const clickedInsideNav =
                navLinks.contains(event.target);

            const clickedToggle =
                navToggle.contains(event.target);

            if (!clickedInsideNav && !clickedToggle) {
                navToggle.classList.remove("active");
                navLinks.classList.remove("open");

                navToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                navToggle.setAttribute(
                    "aria-label",
                    "Abrir menu"
                );
            }
        });
    }


    /* =====================================================
       MENU DE PRODUTOS
       ====================================================== */

    const productsMenu =
        document.querySelector(".products-menu");

    const productsTrigger =
        document.querySelector(".products-trigger");

    const productsDropdown =
        document.querySelector(".products-dropdown");


    if (
        productsMenu &&
        productsTrigger &&
        productsDropdown
    ) {
        productsTrigger.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                event.stopPropagation();

                const isOpen =
                    productsMenu.classList.toggle("open");

                productsTrigger.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );
            }
        );


        /* Fecha ao clicar fora */

        document.addEventListener("click", (event) => {
            if (!productsMenu.contains(event.target)) {
                productsMenu.classList.remove("open");

                productsTrigger.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        });


        /* Fecha ao selecionar um produto */

        productsDropdown
            .querySelectorAll("a")
            .forEach((link) => {
                link.addEventListener("click", () => {
                    productsMenu.classList.remove("open");

                    productsTrigger.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                });
            });
    }


    /* =====================================================
       SCROLL SUAVE PARA ÂNCORAS
       ====================================================== */

    const anchorLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchorLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }


            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }


            event.preventDefault();


            const header =
                document.querySelector(".site-header");

            const headerHeight =
                header
                    ? header.offsetHeight
                    : 0;


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


    /* =====================================================
       ANIMAÇÃO DE ENTRADA
       ====================================================== */

    const animatedElements =
        document.querySelectorAll(
            [
                ".proposal-card",
                ".technology-card",
                ".security-item",
                ".team-card",
                ".stack-card"
            ].join(", ")
        );


    if (
        animatedElements.length &&
        "IntersectionObserver" in window
    ) {
        const observer =
            new IntersectionObserver(
                (entries, observerInstance) => {
                    entries.forEach((entry) => {
                        if (!entry.isIntersecting) {
                            return;
                        }


                        entry.target.classList.add(
                            "is-visible"
                        );


                        observerInstance.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        animatedElements.forEach(
            (element, index) => {
                element.style.setProperty(
                    "--animation-delay",
                    `${index * 0.06}s`
                );

                observer.observe(element);
            }
        );
    }


    /* =====================================================
       LINKS EXTERNOS
       ====================================================== */

    const externalLinks =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    externalLinks.forEach((link) => {
        link.addEventListener("click", () => {
            link.classList.add("link-visited");


            window.setTimeout(() => {
                link.classList.remove(
                    "link-visited"
                );
            }, 500);
        });
    });


    /* =====================================================
       ESC PARA FECHAR MENUS
       ====================================================== */

    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") {
            return;
        }


        /* Fecha menu de produtos */

        if (productsMenu && productsTrigger) {
            productsMenu.classList.remove("open");

            productsTrigger.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        /* Fecha menu mobile */

        if (navToggle && navLinks) {
            navToggle.classList.remove("active");
            navLinks.classList.remove("open");

            navToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            navToggle.setAttribute(
                "aria-label",
                "Abrir menu"
            );
        }
    });


    /* =====================================================
       FEEDBACK VISUAL DOS BOTÕES
       ====================================================== */

    const buttons =
        document.querySelectorAll(
            ".btn, .technology-link"
        );


    buttons.forEach((button) => {
        button.addEventListener(
            "mousedown",
            () => {
                button.classList.add(
                    "button-press"
                );
            }
        );


        button.addEventListener(
            "mouseup",
            () => {
                button.classList.remove(
                    "button-press"
                );
            }
        );


        button.addEventListener(
            "mouseleave",
            () => {
                button.classList.remove(
                    "button-press"
                );
            }
        );
    });


    /* =====================================================
       PROTEÇÃO CONTRA ERRO DE IMAGENS
       ====================================================== */

    const images =
        document.querySelectorAll(
            "img"
        );


    images.forEach((image) => {
        image.addEventListener(
            "error",
            () => {
                image.classList.add(
                    "image-error"
                );
            }
        );
    });
});
