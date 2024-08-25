document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    const nextButton = document.getElementById('next-question');
    const resultsDiv = document.getElementById('results');

    let quizData;
    let currentQuestion = 0;
    let score = 0;

    // Fetch quiz questions from JSON file
    function loadQuiz() {
        fetch('quiz-questions.json')
            .then(response => response.json())
            .then(data => {
                quizData = data;
                resetQuiz();
                displayQuestion();
            })
            .catch(error => console.error('Error loading quiz questions:', error));
    }

    function displayQuestion() {
        if (currentQuestion < quizData.questions.length) {
            const q = quizData.questions[currentQuestion];
            quizContainer.innerHTML = `
                <h3>კითხვა ${currentQuestion + 1}: ${q.question}</h3>
                <div class="answers">
                    ${q.answers.map((answer, i) => `
                        <label>
                            <input type="radio" name="q${currentQuestion}" value="${i}">
                            ${answer}
                        </label>
                    `).join('')}
                </div>
            `;
            nextButton.style.display = 'block';
            resultsDiv.textContent = '';
        } else {
            showResults();
        }
    }

    function showResults() {
        nextButton.style.display = 'none';
        const percentageScore = Math.round((score / quizData.questions.length) * 100);
        resultsDiv.innerHTML = `
            <div class="results-container">
                <h1 class="results-title">შენი შედეგები</h1>
                <div class="score-details">
                    <p class="score-text">შენ დააგროვე <strong>${score} - ${quizData.questions.length} </strong> -დან<strong> </strong>.</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${percentageScore}%;"></div>
                    </div>
                </div>
                <p class="result-message">${score >= quizData.questions.length / 2 ? 'მშვენიერი შედეგია!' : 'სცადე კიდევ ერთხელ!'}</p>
                <button id="play-again" class="button">ახლიდან ცდა</button>
            </div>
        `;
        quizContainer.innerHTML = ''; // Clear the quiz container
        quizContainer.appendChild(resultsDiv); // Move results into quiz container
        document.getElementById('play-again').addEventListener('click', resetQuiz);
    }

    function resetQuiz() {
        currentQuestion = 0;
        score = 0;
        displayQuestion();
    }

    nextButton.addEventListener('click', () => {
        const selectedAnswer = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
        if (selectedAnswer) {
            if (parseInt(selectedAnswer.value) === quizData.questions[currentQuestion].correctAnswer) {
                score++;
            }
            currentQuestion++;
            displayQuestion();
        } else {
            alert('გთხოვთ აირჩიოთ პასუხი');
        }
    });

    // Initial load
    loadQuiz();
});