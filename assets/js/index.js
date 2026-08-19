/* =========================================================
   PATRONUSNET
   SCROLL-DRIVEN IMAGE SEQUENCE
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    const sequences = {

        plastic: {
            path: "assets/img/case/plastic/",
            count: 7
        },

        wood: {
            path: "assets/img/case/wood/",
            count: 8
        }

    };


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const section =
        document.querySelector(".product-sequence");

    const canvas =
        document.getElementById("productCanvas");

    const ctx =
        canvas.getContext("2d");

    const currentElement =
        document.getElementById("sequenceCurrent");

    const totalElement =
        document.getElementById("sequenceTotal");

    const materialButtons =
        document.querySelectorAll(".material-btn");


    if (!section || !canvas || !ctx) {
        return;
    }


    /* =====================================================
       ESTADO
    ===================================================== */

    let currentMaterial = "plastic";

    let images = [];

    let currentFrame = 0;

    let loadedImages = 0;

    let animationFrame = null;

    let initialized = false;


    /* =====================================================
       RETINA / RESOLUÇÃO DO CANVAS
    ===================================================== */

    function resizeCanvas() {

        const rect =
            canvas.getBoundingClientRect();

        const dpr =
            Math.min(window.devicePixelRatio || 1, 2);

        canvas.width =
            Math.round(rect.width * dpr);

        canvas.height =
            Math.round(rect.height * dpr);

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        drawFrame(currentFrame);
    }


    /* =====================================================
       CARREGAR IMAGENS
    ===================================================== */

    function loadSequence(material) {

        const config =
            sequences[material];

        const loaded = [];

        loadedImages = 0;

        for (
            let i = 1;
            i <= config.count;
            i++
        ) {

            const image =
                new Image();

            image.decoding = "async";

            image.src =
                `${config.path}${i}.png`;

            image.onload = () => {

                loadedImages++;

                if (
                    material === currentMaterial &&
                    loadedImages === config.count
                ) {

                    drawFrame(currentFrame);
                }
            };

            image.onerror = () => {

                console.warn(
                    `Não foi possível carregar: ${image.src}`
                );
            };

            loaded.push(image);
        }

        return loaded;
    }


    /* =====================================================
       DESENHAR FRAME
    ===================================================== */

    function drawFrame(index) {

        if (!images.length) {
            return;
        }

        const image =
            images[
                Math.max(
                    0,
                    Math.min(
                        index,
                        images.length - 1
                    )
                )
            ];

        if (
            !image ||
            !image.complete ||
            image.naturalWidth === 0
        ) {

            return;
        }


        const rect =
            canvas.getBoundingClientRect();

        const width =
            rect.width;

        const height =
            rect.height;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
            Contain:

            Mantém o produto inteiro visível
            sem cortar a imagem.
        */

        const imageRatio =
            image.naturalWidth /
            image.naturalHeight;

        const canvasRatio =
            width / height;

        let drawWidth;
        let drawHeight;

        if (imageRatio > canvasRatio) {

            drawWidth = width;

            drawHeight =
                width / imageRatio;

        } else {

            drawHeight = height;

            drawWidth =
                height * imageRatio;
        }


        const x =
            (width - drawWidth) / 2;

        const y =
            (height - drawHeight) / 2;


        ctx.drawImage(
            image,
            x,
            y,
            drawWidth,
            drawHeight
        );
    }


    /* =====================================================
       SCROLL → FRAME
    ===================================================== */

    function updateSequence() {

        const rect =
            section.getBoundingClientRect();

        const scrollable =
            section.offsetHeight -
            window.innerHeight;

        /*
            Progresso de 0 até 1
        */

        let progress =
            -rect.top / scrollable;


        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        /*
            Converte o progresso
            em frame.
        */

        const frame =
            Math.min(
                images.length - 1,
                Math.floor(
                    progress *
                    images.length
                )
            );


        if (frame !== currentFrame) {

            currentFrame = frame;

            if (!animationFrame) {

                animationFrame =
                    requestAnimationFrame(() => {

                        drawFrame(currentFrame);

                        animationFrame = null;

                    });
            }

            updateCounter();
        }
    }


    /* =====================================================
       CONTADOR
    ===================================================== */

    function updateCounter() {

        const current =
            String(currentFrame + 1)
                .padStart(2, "0");

        const total =
            String(images.length)
                .padStart(2, "0");

        currentElement.textContent =
            current;

        totalElement.textContent =
            total;
    }


    /* =====================================================
       TROCAR MATERIAL
    ===================================================== */

    function changeMaterial(material) {

        if (
            !sequences[material] ||
            material === currentMaterial
        ) {
            return;
        }


        currentMaterial =
            material;


        /*
            Carrega a nova sequência.
        */

        images =
            loadSequence(material);


        /*
            Começa novamente no primeiro
            frame do material escolhido.
        */

        currentFrame = 0;


        /*
            Atualiza botões.
        */

        materialButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.material === material
            );

        });


        updateCounter();


        /*
            Pequeno redraw.
        */

        requestAnimationFrame(() => {

            drawFrame(0);

        });
    }


    /* =====================================================
       EVENTOS DOS BOTÕES
    ===================================================== */

    materialButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                changeMaterial(
                    button.dataset.material
                );

            }
        );

    });


    /* =====================================================
       SCROLL
    ===================================================== */

    let scrollTicking = false;

    window.addEventListener(
        "scroll",
        () => {

            if (!scrollTicking) {

                window.requestAnimationFrame(() => {

                    updateSequence();

                    scrollTicking = false;

                });

                scrollTicking = true;
            }

        },
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        () => {

            resizeCanvas();

            updateSequence();

        },
        {
            passive: true
        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function init() {

        if (initialized) {
            return;
        }

        initialized = true;


        /*
            Plástico é o padrão.
        */

        images =
            loadSequence("plastic");


        updateCounter();


        /*
            Aguarda o layout estar pronto.
        */

        requestAnimationFrame(() => {

            resizeCanvas();

            /*
                Tenta desenhar o primeiro frame
                assim que ele carregar.
            */

            const first =
                images[0];

            if (first) {

                first.onload = () => {

                    drawFrame(0);

                };
            }

            updateSequence();

        });

    }


    /*
        Inicializa depois que a página
        estiver pronta.
    */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            init
        );

    } else {

        init();

    }


    /* =====================================================
       ANO DO FOOTER
    ===================================================== */

    const year =
        document.getElementById("ano");

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }

})();
