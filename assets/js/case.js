document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURAÇÕES
    ===================================================== */

    const TOTAL_FRAMES = 7;

    const materials = {
        plastic: {
            name: "Plástico",

            price: "R$ 149,90",

            description: "Dispositivo em plástico",

            folder: "assets/img/case/plastic/"
        },

        wood: {
            name: "Madeira",

            // Por enquanto mantém o mesmo preço.
            // Quando houver o preço da madeira, basta alterar aqui.
            price: "R$ 129,90",

            description: "Dispositivo em madeira",

            folder: "assets/img/case/wood/"
        }
    };


    let currentMaterial = "plastic";

    let currentFrame = 1;

    let images = [];

    let loadedImages = 0;

    let canvas;

    let ctx;

    let animationFrame = null;

    let lastScrollY = window.scrollY;

    let scrollVelocity = 0;



    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const materialButtons =
        document.querySelectorAll(".material-btn");

    const priceElement =
        document.getElementById("productPrice");

    const descriptionElement =
        document.getElementById("productDescription");

    const currentElement =
        document.getElementById("sequenceCurrent");

    const totalElement =
        document.getElementById("sequenceTotal");

    canvas =
        document.getElementById("productCanvas");


    if (!canvas) {
        return;
    }


    ctx = canvas.getContext("2d");


    if (totalElement) {
        totalElement.textContent =
            String(TOTAL_FRAMES).padStart(2, "0");
    }



    /* =====================================================
       RESIZE DO CANVAS
    ===================================================== */

    function resizeCanvas() {

        const rect =
            canvas.getBoundingClientRect();

        const dpr =
            Math.min(window.devicePixelRatio || 1, 2);

        canvas.width =
            Math.max(1, Math.floor(rect.width * dpr));

        canvas.height =
            Math.max(1, Math.floor(rect.height * dpr));

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        drawCurrentFrame();
    }



    /* =====================================================
       CARREGAR IMAGENS
    ===================================================== */

    function loadImages(material) {

        images = [];

        loadedImages = 0;

        for (let i = 1; i <= TOTAL_FRAMES; i++) {

            const image =
                new Image();

            image.decoding = "async";

            image.src =
                `${materials[material].folder}${i}.png`;

            image.onload = () => {

                loadedImages++;

                /*
                 * Não exibimos "Carregando dispositivo..."
                 * na tela.
                 */

                if (i === 1) {
                    drawCurrentFrame();
                }

            };


            image.onerror = () => {

                console.warn(
                    `Não foi possível carregar: ${image.src}`
                );

            };


            images.push(image);
        }


        /*
         * Pré-carrega todas as imagens sem colocar
         * nenhuma mensagem na interface.
         */

        images.forEach(image => {

            if (image.complete) {
                loadedImages++;
            }

        });


        drawCurrentFrame();
    }



    /* =====================================================
       DESENHAR FRAME
    ===================================================== */

    function drawCurrentFrame() {

        if (!ctx || !canvas) {
            return;
        }


        const image =
            images[currentFrame - 1];


        if (!image || !image.complete) {
            return;
        }


        if (image.naturalWidth === 0) {
            return;
        }


        const width =
            canvas.clientWidth;

        const height =
            canvas.clientHeight;


        if (!width || !height) {
            return;
        }


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
         * Mantém a imagem inteira dentro do espaço.
         * Isso evita cortar o produto quando a tela
         * fica menor.
         */

        const imageRatio =
            image.naturalWidth /
            image.naturalHeight;

        const canvasRatio =
            width / height;


        let drawWidth;

        let drawHeight;


        if (imageRatio > canvasRatio) {

            drawWidth =
                width * 0.90;

            drawHeight =
                drawWidth / imageRatio;

        } else {

            drawHeight =
                height * 0.90;

            drawWidth =
                drawHeight * imageRatio;

        }


        /*
         * Limita novamente para evitar qualquer corte.
         */

        if (drawWidth > width * 0.94) {

            drawWidth =
                width * 0.94;

            drawHeight =
                drawWidth / imageRatio;

        }


        if (drawHeight > height * 0.94) {

            drawHeight =
                height * 0.94;

            drawWidth =
                drawHeight * imageRatio;

        }


        const x =
            (width - drawWidth) / 2;

        const y =
            (height - drawHeight) / 2;


        ctx.imageSmoothingEnabled = true;

        ctx.imageSmoothingQuality = "high";


        ctx.drawImage(
            image,
            x,
            y,
            drawWidth,
            drawHeight
        );
    }



    /* =====================================================
       FRAME ATUAL
    ===================================================== */

    function updateFrame(frame) {

        frame =
            Math.max(
                1,
                Math.min(
                    TOTAL_FRAMES,
                    Math.round(frame)
                )
            );


        if (frame === currentFrame) {
            return;
        }


        currentFrame =
            frame;


        if (currentElement) {

            currentElement.textContent =
                String(currentFrame).padStart(2, "0");

        }


        drawCurrentFrame();
    }



    /* =====================================================
       SCROLL PARA FRAME
    ===================================================== */

    function updateFromScroll() {

        const section =
            document.querySelector(".product-sequence");

        if (!section) {
            return;
        }


        const rect =
            section.getBoundingClientRect();

        const sectionHeight =
            section.offsetHeight;

        const viewportHeight =
            window.innerHeight;


        /*
         * Calcula o progresso da sequência.
         */

        const maxScroll =
            Math.max(
                1,
                sectionHeight - viewportHeight
            );


        let progress =
            -rect.top / maxScroll;


        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        /*
         * Pequena suavização para deixar a mudança
         * de imagens mais agradável.
         */

        const frame =
            1 +
            progress *
            (TOTAL_FRAMES - 1);


        updateFrame(frame);
    }



    /* =====================================================
       SCROLL
    ===================================================== */

    function handleScroll() {

        const currentScrollY =
            window.scrollY;

        scrollVelocity =
            Math.abs(
                currentScrollY - lastScrollY
            );

        lastScrollY =
            currentScrollY;


        if (!animationFrame) {

            animationFrame =
                requestAnimationFrame(() => {

                    updateFromScroll();

                    animationFrame =
                        null;

                });

        }
    }



    /* =====================================================
       TROCA DE MATERIAL
    ===================================================== */

    function changeMaterial(material) {

        if (!materials[material]) {
            return;
        }


        currentMaterial =
            material;


        /*
         * Atualiza visual dos botões.
         */

        materialButtons.forEach(button => {

            const isActive =
                button.dataset.material === material;

            button.classList.toggle(
                "active",
                isActive
            );

        });


        /*
         * Atualiza preço.
         */

        if (priceElement) {

            priceElement.textContent =
                materials[material].price;

        }


        /*
         * Atualiza descrição.
         */

        if (descriptionElement) {

            descriptionElement.textContent =
                materials[material].description;

        }


        /*
         * Reinicia a sequência.
         */

        currentFrame = 1;

        if (currentElement) {

            currentElement.textContent =
                "01";

        }


        loadImages(material);
    }



    /* =====================================================
       EVENTOS DOS BOTÕES
    ===================================================== */

    materialButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const material =
                    button.dataset.material;

                changeMaterial(material);

            }
        );

    });



    /* =====================================================
       REDIMENSIONAMENTO
    ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        () => {

            clearTimeout(resizeTimer);

            resizeTimer =
                setTimeout(() => {

                    resizeCanvas();

                    updateFromScroll();

                }, 100);

        }
    );



    /* =====================================================
       SCROLL
    ===================================================== */

    window.addEventListener(
        "scroll",
        handleScroll,
        {
            passive: true
        }
    );



    /* =====================================================
       MENU PRODUTOS
    ===================================================== */

    const productsMenu =
        document.querySelector(".products-menu");

    const productsTrigger =
        document.querySelector(".products-trigger");


    if (
        productsMenu &&
        productsTrigger
    ) {

        productsTrigger.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                productsMenu.classList.toggle(
                    "open"
                );

            }
        );


        document.addEventListener(
            "click",
            event => {

                if (
                    !productsMenu.contains(event.target)
                ) {

                    productsMenu.classList.remove(
                        "open"
                    );

                }

            }
        );

    }



    /* =====================================================
       ANO DO FOOTER
    ===================================================== */

    const yearElement =
        document.getElementById("ano");


    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }



    /* =====================================================
       LINK SUAVE PARA EXPLORAR
    ===================================================== */

    document
        .querySelectorAll('a[href="#explorar"]')
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const target =
                        document.getElementById(
                            "explorar"
                        );

                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });



    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    resizeCanvas();

    /*
     * Carrega primeiro o plástico, que é o material
     * selecionado inicialmente.
     */

    loadImages("plastic");

    /*
     * Garante que a posição inicial do scroll
     * seja refletida no contador.
     */

    updateFromScroll();

});