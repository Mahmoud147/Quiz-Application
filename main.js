// QuerySelector
let countSpan = document.querySelector(".count span");
let bollets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let qAree = document.querySelector(".quiz-area");
let ansArea = document.querySelector(".answers-area");
let submitButtonn = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownT = document.querySelector(".countdown");


// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;

            // Create Bullets + Set Questions Count 
            createBullets(questionsCount);

            // Add Questio Data mhm
            addQuestionData(questionsObject[currentIndex], questionsCount);

            // countdown
            countdown(1800, questionsCount);
            
            // Click On Submit 
            submitButtonn.onclick =  () => {
                // Get Right Answer 
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                // Increase Index 
                currentIndex++;
                // Check THe Answer
                checkAnswer(theRightAnswer, questionsCount);

                // Remove Previous Question
                qAree.innerHTML = "";
                ansArea.innerHTML = "";

                // Add Questio Data mhm
                addQuestionData(questionsObject[currentIndex], questionsCount);

                // Handle Bullets Class
                handleBullets();

                // Show Results 
                showResults(questionsCount);

            };
        };
    };

    myRequest.open("GET", "html_question.json", true);
    myRequest.send();
};
getQuestions();
// ReadyState M3nah Lma 7alh El Requst Tt3`er He7sl Aeh Bqa ? 
// Htbda T3ml Tt4k 3 ReadyState
// Mthla 3ndna Arqam Mn (0) Ele (4)
// (0) Y3ne El Requst Lsh Mbda4 
// (1) M3nah Anh At3mlo Konkt M3 Elserfr
// (2) M3nah Anh Astlm ElRequest Mn ElrkostRsef
// (3) M3nah Anh Be3ml Brossng ll Requst 
// (4) M3anh An ElRequst Antht Wel Response Elherg3lk Gahz 
// Ama 7oar El Status200 De ElResponse Code W 200 Y3ne Elmlf Tmam


function createBullets(num) {
    countSpan.innerHTML = num ;

    // Create Spans 
    for (let i = 0 ; i < num; i++) {
        // Create Bullet
        let theBullet = document.createElement("span");

        // Check If Its First Span
        if (i === 0) {
            theBullet.className = "on";
        }

        // Append Bullets To Main Bullet Container
        bulletsSpanContainer.appendChild(theBullet);
    }

};
// aol 7agh hn3mlha he hngeb 3dd el2s2lh whnDefha hna elaol (.count span ) tkon denamk
// wb3d kda hnn4a2 3dd elSpans hna (.bullets .spans) 3 7sb 3dd el2s2lh de qd aeh ?


function addQuestionData(obj, count) {
    if (currentIndex < count) {
        // Create H2 Question Title 
        let qTitle = document.createElement("h2")

        // Create Question Text
        let qText = document.createTextNode(obj['title']);

        // Append Text To H2
        qTitle.appendChild(qText);

        // Append The H2 To The Quiz Aree
        qAree.appendChild(qTitle);

        // Create The Answers
        for(let i = 1; i <= 4; i++) {
            // Create Main Answer Div
            let mainLabel = document.createElement("label"); ///
            mainLabel.className = 'answer';
            mainLabel.htmlFor = `answer_${i}`;

            // Create Radio Input 
            let rInput = document.createElement("input");
            // Add Type + Name + Id + Data-Attribute 
            rInput.name = 'question';
            rInput.type = 'radio';
            rInput.id = `answer_${i}`;
            rInput.dataset.answer = obj[`answer_${i}`];

            // Make First Option Selecter
            if (i === 1) {
                rInput.checked = true;
            }

            // Create Label
            let theLabel = document.createElement("label");
            theLabel.htmlFor = `answer_${i}`;
            // Create Label Text 
            let theLabelText = document.createTextNode(obj[`answer_${i}`]);
            
            // Add The Text To Label 
            theLabel.appendChild(theLabelText);

            // Add Input + Label To Main Div 
            mainLabel.appendChild(rInput);
            mainLabel.appendChild(theLabel);

            //Append All Divs To Answers Area 
            ansArea.appendChild(mainLabel);
        }
    }
};
// whna 5lena kl 7agh denamk els2al walgoab w elradeo w ...


function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    
    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
        console.log(`Good Answer`)
    }
};

function handleBullets() {
    let bullSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan = Array.from(bullSpans);
    arrayOfSpan.forEach((span, index) => {

        if (currentIndex === index) {
            span.className = 'on';
        }
    })
};

function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        qAree.remove();
        ansArea.remove();
        submitButtonn.remove();
        bollets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class="goog">B+</span>`;
        } else if (rightAnswers === count) {
            theResults = `<span class="perfect">A+</span>`;
        }else {
            theResults = `<span class="bad">F</span>`;
        }

        resultsContainer.innerHTML = theResults;
    };
};

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds
        countdownInterval = setInterval(function() {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds; 
            countdownT.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButtonn.click();
            }
        },1000);
    }
};