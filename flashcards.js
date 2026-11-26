
/* ==========================================
   GPS LAB - INTERACTIVE FLASHCARDS
========================================== */

// 1. FLASHCARD DATA

const flashcards = [
    {
        question: "What does GPS stand for?",
        answer: "Global Positioning System."
    },
    {
        question: "What is the main purpose of GPS?",
        answer: "To determine the precise location of a receiver on Earth."
    },
    {
        question: "How many satellites are needed for 3D positioning?",
        answer: "At least four satellites."
    },
    {
        question: "What is trilateration?",
        answer: "A method that calculates position using distances from multiple satellites."
    },
    {
        question: "What signal do GPS satellites transmit?",
        answer: "Radio signals containing timing and satellite location information."
    },
    {
        question: "Why is accurate timing important in GPS?",
        answer: "GPS calculates distance using the time taken by signals to travel."
    },
    {
        question: "What is pseudorange?",
        answer: "An estimated distance between a GPS satellite and a receiver."
    },
    {
        question: "What can block GPS signals?",
        answer: "Buildings, tunnels, mountains, and other physical obstacles."
    },
    {
        question: "What is a GPS receiver?",
        answer: "A device that receives satellite signals and calculates its position."
    },
    {
        question: "What is the speed of GPS radio signals?",
        answer: "They travel approximately at the speed of light."
    }
];


// 2. GET ABOUT SECTION

const aboutContent = document.querySelector(".about-content");

if (!aboutContent) {
    console.error("About GPS content container was not found.");
} else {

    // 3. CREATE FLASHCARD INTERFACE

    aboutContent.innerHTML = `
        <div class="flashcards-container">

            <div class="flashcards-heading">
                <span class="flashcards-tag">TEST YOUR KNOWLEDGE</span>
                <h3>GPS Flashcards</h3>
                <p>Flip the cards and discover how GPS works.</p>
            </div>

            <div class="flashcard-progress">
                <span id="flashcard-counter">Card 1 / 10</span>

                <div class="progress-track">
                    <div id="flashcard-progress-bar"></div>
                </div>
            </div>

            <div class="flashcard-scene" id="flashcard-scene">

                <div class="flashcard" id="flashcard">

                    <div class="flashcard-face flashcard-front">

                        <span class="card-label">QUESTION</span>

                        <div class="card-icon">🛰️</div>

                        <h3 id="flashcard-question"></h3>

                        <p>Click to reveal the answer</p>

                    </div>

                    <div class="flashcard-face flashcard-back">

                        <span class="card-label">ANSWER</span>

                        <div class="card-icon">🌍</div>

                        <h3 id="flashcard-answer"></h3>

                        <p>Click to see the question</p>

                    </div>

                </div>

            </div>

            <div class="flashcard-controls">

                <button id="flashcard-prev" class="flashcard-btn secondary">
                    ← Previous
                </button>

                <button id="flashcard-shuffle" class="flashcard-btn shuffle">
                    🔀 Shuffle
                </button>

                <button id="flashcard-next" class="flashcard-btn primary">
                    Next →
                </button>

            </div>

            <p class="flashcard-hint">
                Tip: Try answering the question before flipping the card!
            </p>

        </div>
    `;


    // 4. ADD FLASHCARD STYLES

    const style = document.createElement("style");

    style.textContent = `

        .flashcards-container {
            width: 100%;
            max-width: 750px;
            margin: 55px auto 0;
            padding: 25px 15px;
            text-align: center;
        }

        .flashcards-heading {
            margin-bottom: 30px;
        }

        .flashcards-tag {
            color: #54c8ff;
            font-size: 12px;
            letter-spacing: 3px;
            font-weight: bold;
        }

        .flashcards-heading h3 {
            color: white;
            font-size: 30px;
            margin: 12px 0;
        }

        .flashcards-heading p {
            color: #aab9ce;
            font-size: 15px;
        }

        .flashcard-progress {
            max-width: 550px;
            margin: 0 auto 22px;
            text-align: left;
        }

        #flashcard-counter {
            display: block;
            color: #54c8ff;
            font-size: 13px;
            margin-bottom: 10px;
        }

        .progress-track {
            width: 100%;
            height: 5px;
            background: #263c54;
            border-radius: 10px;
            overflow: hidden;
        }

        #flashcard-progress-bar {
            width: 10%;
            height: 100%;
            background: #35baff;
            border-radius: 10px;
            transition: width 0.3s ease;
        }

        .flashcard-scene {
            width: 100%;
            max-width: 550px;
            height: 300px;
            margin: auto;
            perspective: 1200px;
            cursor: pointer;
        }

        .flashcard {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.65s ease;
        }

        .flashcard.flipped {
            transform: rotateY(180deg);
        }

        .flashcard-face {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            padding: 30px;
            border-radius: 20px;
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            border: 1px solid rgba(84, 200, 255, 0.35);

            background:
                radial-gradient(
                    circle at top right,
                    rgba(44, 145, 210, 0.2),
                    transparent 55%
                ),
                linear-gradient(
                    145deg,
                    #153553,
                    #0a1b2e
                );

            box-shadow:
                0 15px 40px rgba(0, 0, 0, 0.25),
                inset 0 0 25px rgba(84, 200, 255, 0.04);
        }

        .flashcard-back {
            transform: rotateY(180deg);

            background:
                radial-gradient(
                    circle at bottom left,
                    rgba(48, 190, 160, 0.15),
                    transparent 55%
                ),
                linear-gradient(
                    145deg,
                    #123b45,
                    #0a1b2e
                );

            border-color: rgba(72, 220, 190, 0.4);
        }

        .card-label {
            position: absolute;
            top: 22px;
            left: 25px;
            font-size: 11px;
            letter-spacing: 2px;
            color: #54c8ff;
            font-weight: bold;
        }

        .flashcard-back .card-label {
            color: #59dfba;
        }

        .card-icon {
            font-size: 35px;
            margin-bottom: 15px;
        }

        .flashcard-face h3 {
            color: white;
            font-size: 23px;
            line-height: 1.5;
            max-width: 450px;
            margin: 0;
        }

        .flashcard-face p {
            color: #aab9ce;
            font-size: 12px;
            margin-top: 22px;
        }

        .flashcard-back h3 {
            color: #d4fff3;
        }

        .flashcard-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            flex-wrap: wrap;
            margin-top: 25px;
        }

        .flashcard-btn {
            padding: 12px 20px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 13px;
            font-weight: bold;
            transition: 0.25s;
        }

        .flashcard-btn:hover {
            transform: translateY(-3px);
        }

        .flashcard-btn:active {
            transform: scale(0.97);
        }

        .flashcard-btn.primary {
            background: #168bd1;
            color: white;
        }

        .flashcard-btn.primary:hover {
            background: #36b5ff;
        }

        .flashcard-btn.secondary {
            background: #203b55;
            color: #d7eaff;
            border: 1px solid #365875;
        }

        .flashcard-btn.secondary:hover {
            background: #2c5273;
        }

        .flashcard-btn.shuffle {
            background: transparent;
            color: #54c8ff;
            border: 1px solid #278bc2;
        }

        .flashcard-btn.shuffle:hover {
            background: rgba(84, 200, 255, 0.1);
        }

        .flashcard-hint {
            color: #829bb3;
            font-size: 12px;
            margin-top: 22px;
        }

        @media (max-width: 600px) {

            .flashcard-scene {
                height: 320px;
            }

            .flashcard-face {
                padding: 20px;
            }

            .flashcard-face h3 {
                font-size: 19px;
            }

            .flashcard-btn {
                padding: 11px 15px;
                font-size: 12px;
            }

            .flashcards-heading h3 {
                font-size: 25px;
            }

        }

    `;

    document.head.appendChild(style);


    // 5. GET FLASHCARD ELEMENTS

    const flashcard = document.getElementById("flashcard");

    const questionElement =
        document.getElementById("flashcard-question");

    const answerElement =
        document.getElementById("flashcard-answer");

    const counterElement =
        document.getElementById("flashcard-counter");

    const progressBar =
        document.getElementById("flashcard-progress-bar");

    const previousButton =
        document.getElementById("flashcard-prev");

    const nextButton =
        document.getElementById("flashcard-next");

    const shuffleButton =
        document.getElementById("flashcard-shuffle");

    const flashcardScene =
        document.getElementById("flashcard-scene");


    // 6. FLASHCARD STATE

    let currentIndex = 0;

    let shuffledCards = [...flashcards];


    // 7. DISPLAY CURRENT CARD

    function showCard() {

        const currentCard = shuffledCards[currentIndex];

        questionElement.textContent = currentCard.question;

        answerElement.textContent = currentCard.answer;

        counterElement.textContent =
            `Card ${currentIndex + 1} / ${shuffledCards.length}`;

        progressBar.style.width =
            `${((currentIndex + 1) / shuffledCards.length) * 100}%`;

        flashcard.classList.remove("flipped");

        previousButton.disabled = currentIndex === 0;

        previousButton.style.opacity =
            currentIndex === 0 ? "0.45" : "1";

        nextButton.textContent =
            currentIndex === shuffledCards.length - 1
                ? "Restart ↻"
                : "Next →";
    }


    // 8. FLIP CARD

    function flipCard() {

        flashcard.classList.toggle("flipped");

    }

    flashcardScene.addEventListener("click", flipCard);


    // 9. NEXT CARD

    function nextCard() {

        if (currentIndex < shuffledCards.length - 1) {

            currentIndex++;

        } else {

            currentIndex = 0;

        }

        showCard();

    }

    nextButton.addEventListener("click", nextCard);


    // 10. PREVIOUS CARD

    function previousCard() {

        if (currentIndex > 0) {

            currentIndex--;

            showCard();

        }

    }

    previousButton.addEventListener(
        "click",
        previousCard
    );


    // 11. SHUFFLE CARDS

    function shuffleCards() {

        for (let i = shuffledCards.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [
                shuffledCards[i],
                shuffledCards[j]
            ] = [
                shuffledCards[j],
                shuffledCards[i]
            ];

        }

        currentIndex = 0;

        showCard();

    }

    shuffleButton.addEventListener(
        "click",
        shuffleCards
    );


    // 12. KEYBOARD CONTROLS

    document.addEventListener("keydown", (event) => {

        if (event.key === "ArrowRight") {
            nextCard();
        }

        if (event.key === "ArrowLeft") {
            previousCard();
        }

        if (event.key === " " &&
            document.activeElement === document.body) {

            event.preventDefault();

            flipCard();

        }

    });


    // 13. START FLASHCARDS

    showCard();

}
