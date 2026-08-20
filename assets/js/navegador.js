/* =========================================================
   PATRONUSNET BROWSER
   JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ANO DO FOOTER
    ===================================================== */

    const ano = document.getElementById("ano");

    if (ano) {

        ano.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       MENU PRODUTOS
    ===================================================== */

    const productsMenu =
        document.querySelector(".products-menu");

    const productsTrigger =
        document.querySelector(".products-trigger");


    if (productsMenu && productsTrigger) {


        productsTrigger.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                const isOpen =
                    productsMenu.classList.toggle("open");

                productsTrigger.setAttribute(
                    "aria-expanded",
                    String(isOpen)
                );

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !productsMenu.contains(
                        event.target
                    )
                ) {

                    productsMenu.classList.remove(
                        "open"
                    );

                    productsTrigger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );


    }


    /* =====================================================
       FAQ
    ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");


    faqItems.forEach((item) => {


        const button =
            item.querySelector(".faq-question");


        if (!button) {
            return;
        }


        button.addEventListener(
            "click",
            () => {


                const isActive =
                    item.classList.contains("active");


                /*
                 * Fecha os outros itens.
                 */

                faqItems.forEach(
                    (otherItem) => {

                        otherItem.classList.remove(
                            "active"
                        );

                        const otherButton =
                            otherItem.querySelector(
                                ".faq-question"
                            );

                        if (otherButton) {

                            otherButton.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                        }

                    }
                );


                /*
                 * Abre o item selecionado.
                 */

                if (!isActive) {

                    item.classList.add(
                        "active"
                    );

                    button.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            }
        );


    });


    /* =====================================================
       VÍDEO
    ===================================================== */

    const video =
        document.getElementById(
            "patronusVideo"
        );

    const videoOverlay =
        document.getElementById(
            "videoPlayOverlay"
        );


    if (video && videoOverlay) {


        videoOverlay.addEventListener(
            "click",
            () => {

                video.play()
                    .catch(() => {});

            }
        );


        video.addEventListener(
            "play",
            () => {

                videoOverlay.style.opacity =
                    "0";

                videoOverlay.style.pointerEvents =
                    "none";

            }
        );


        video.addEventListener(
            "pause",
            () => {

                /*
                 * Só mostra novamente o overlay
                 * caso o vídeo ainda não tenha terminado.
                 */

                if (
                    !video.ended &&
                    video.currentTime > 0
                ) {

                    videoOverlay.style.opacity =
                        "1";

                    videoOverlay.style.pointerEvents =
                        "auto";

                }

            }
        );


        video.addEventListener(
            "ended",
            () => {

                videoOverlay.style.opacity =
                    "1";

                videoOverlay.style.pointerEvents =
                    "auto";

            }
        );


    }


    /* =====================================================
       SCROLL SUAVE
    ===================================================== */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(
        (link) => {


            link.addEventListener(
                "click",
                (event) => {


                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        /*
                         * Links das lojas ainda não
                         * possuem URL real.
                         */

                        if (
                            targetId === "#"
                        ) {

                            event.preventDefault();

                        }

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    const header =
                        document.querySelector(
                            ".site-header"
                        );


                    const headerHeight =
                        header
                            ? header.offsetHeight
                            : 0;


                    const targetPosition =
                        target.getBoundingClientRect()
                            .top +
                        window.scrollY -
                        headerHeight -
                        20;


                    window.scrollTo({

                        top:
                            targetPosition,

                        behavior:
                            "smooth"

                    });

                }
            );

        }
    );


    /* =====================================================
       ANIMAÇÃO DE ENTRADA
    ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".browser-feature-card, " +
            ".compatibility-card, " +
            ".security-point, " +
            ".faq-item"
        );


    if (
        "IntersectionObserver"
        in window
    ) {


        const observer =
            new IntersectionObserver(
                (entries) => {


                    entries.forEach(
                        (entry) => {


                            if (
                                entry.isIntersecting
                            ) {


                                entry.target.classList.add(
                                    "visible"
                                );


                                observer.unobserve(
                                    entry.target
                                );


                            }

                        }
                    );


                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach(
            (element) => {

                observer.observe(
                    element
                );

            }
        );

    }


    /* =====================================================
       BOTÕES DAS LOJAS
    ===================================================== */

    const storeButtons =
        document.querySelectorAll(
            ".store-button"
        );


    storeButtons.forEach(
        (button) => {


            button.addEventListener(
                "click",
                (event) => {


                    const store =
                        button.dataset.store;


                    /*
                     * Substitua os URLs abaixo pelos
                     * endereços reais das lojas.
                     */

                    const storeUrls = {

                        chrome:
                            "",

                        edge:
                            ""

                    };


                    if (
                        !storeUrls[store]
                    ) {

                        event.preventDefault();


                        console.info(
                            `URL da loja ${store} ainda não configurada.`
                        );

                        return;

                    }


                    button.href =
                        storeUrls[store];

                }
            );


        }
    );


});
