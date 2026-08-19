document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("productCanvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const currentElement =
        document.getElementById("sequenceCurrent");

    const totalElement =
        document.getElementById("sequenceTotal");

    const materialButtons =
        document.querySelectorAll(".material-btn");


    const materials = {
        plastic: {
            path: "assets/img/case/plastic/",
            price: "R$ 149,90",
            description: "Dispositivo em plástico"
        },

        wood: {
            path: "assets/img/case/wood/",
            price: "R$ 129,90",
            description: "Dispositivo em madeira"
        }
    };


    const totalFrames = 7;

    let material = "plastic";

    let currentFrame = 1;

    let images = [];

    let loadedImages = 0;


    /* =====================================================
       CANVAS
    ====================================================== */

    function resizeCanvas() {

        const rect = canvas.getBoundingClientRect();

        const dpr = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

        drawFrame();
    }


    /* =====================================================
       CARREGAR IMAGENS
    ====================================================== */

    function loadImages() {

        images = [];

        loadedImages = 0;

        for (let i = 1; i <= totalFrames; i++) {

            const image = new Image();

            image.decoding = "async";

            image.src =
                `${materials[material].path}${i}.png`;

            image.onload = () => {

                loadedImages++;

                /*
                 * Assim que a primeira imagem estiver pronta,
                 * ela aparece imediatamente.
                 */
                if (i === 1) {

                    currentFrame = 1;

                    drawFrame();
                }

            };

            image.onerror = () => {

                console.warn(
                    `Imagem não encontrada: ${image.src}`
                );

            };

            images.push(image);
        }

        if (totalElement) {

            totalElement.textContent =
                String(totalFrames).padStart(2, "0");
        }
    }


    /* =====================================================
       DESENHAR FRAME
    ====================================================== */

    function drawFrame() {

        const image = images[currentFrame - 1];

        if (!image || !image.complete || !image.naturalWidth) {
            return;
        }

        const width =
            canvas.clientWidth;

        const height =
            canvas.clientHeight;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


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


        if (currentElement) {

            currentElement.textContent =
                String(currentFrame).padStart(2, "0");
        }
    }


    /* =====================================================
       FRAME PELO SCROLL
    ====================================================== */

    function updateFrameFromScroll() {

        const section =
            document.querySelector(".product-sequence");

        if (!section) return;


        const rect =
            section.getBoundingClientRect();

        const scrollable =
            section.offsetHeight -
            window.innerHeight;


        if (scrollable <= 0) return;


        const progress =
            Math.min(
                Math.max(
                    -rect.top / scrollable,
                    0
                ),
                1
            );


        const frame =
            Math.min(
                totalFrames,
                Math.max(
                    1,
                    Math.floor(
                        progress * totalFrames
                    ) + 1
                )
            );


        if (frame !== currentFrame) {

            currentFrame = frame;

            drawFrame();
        }
    }


    /* =====================================================
       MATERIAL
    ====================================================== */

    materialButtons.forEach(button => {

        button.addEventListener("click", () => {

            const selected =
                button.dataset.material;

            if (!materials[selected]) return;

            material = selected;


            materialButtons.forEach(btn => {

                btn.classList.toggle(
                    "active",
                    btn === button
                );

            });


            updatePrice();

            loadImages();
        });

    });


    /* =====================================================
       PREÇO
    ====================================================== */

    function updatePrice() {

        const price =
            document.querySelector(".price-value");

        const description =
            document.querySelector(".price-description");


        if (price) {

            price.textContent =
                materials[material].price;
        }


        if (description) {

            description.textContent =
                materials[material].description;
        }
    }


    /* =====================================================
       EVENTOS
    ====================================================== */

    window.addEventListener(
        "scroll",
        updateFrameFromScroll,
        { passive: true }
    );


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    updatePrice();

    resizeCanvas();

    loadImages();

});