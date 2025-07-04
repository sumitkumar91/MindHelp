const questions = [
    {
        text: "Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you been bothered by trouble concentrating on things?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you been bothered by moving or speaking slowly, or being fidgety/restless?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    },
    {
        text: "Over the last 2 weeks, how often have you had thoughts that you would be better off dead or hurting yourself?",
        options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
    }
];

let currentQuestion = 0;
let answers = [];
let selectedMood = null;
let moodData = JSON.parse(localStorage?.getItem('moodData') || '[]');

function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

function startAssessment() {
    document.getElementById('assessment-start').style.display = 'none';
    document.getElementById('assessment-questions').style.display = 'block';
    currentQuestion = 0;
    answers = [];
    showQuestion();
}

function showQuestion() {
    const question = questions[currentQuestion];
    const container = document.getElementById('question-container');
    
    container.innerHTML = `
        <div class="question-card">
            <div class="question-text">${question.text}</div>
            <div class="options">
                ${question.options.map((option, index) => `
                    <label class="option">
                        <input type="radio" name="answer" value="${index}" onchange="selectAnswer(${index})">
                        <span>${option}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('progress').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById('next-btn').disabled = true;
}

function selectAnswer(value) {
    answers[currentQuestion] = value;
    document.getElementById('next-btn').disabled = false;
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questions.length) {
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('assessment-questions').style.display = 'none';
    document.getElementById('assessment-results').style.display = 'block';
    
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);
    const maxScore = questions.length * 3; // Max 3 points per question
    
    document.getElementById('score-display').textContent = `${totalScore}/${maxScore}`;
    document.getElementById('date-completed').textContent = new Date().toLocaleDateString();
    
    let interpretation = '';
    let severity = '';
    
    if (totalScore <= 7) {
        severity = 'Minimal';
        interpretation = `
            <h3 style="color: #28a745;">✅ Minimal Symptoms</h3>
            <p>Your responses suggest minimal symptoms of depression or anxiety. This is a positive sign! Continue taking care of your mental health through:</p>
            <ul>
                <li>Regular exercise and healthy eating</li>
                <li>Maintaining social connections</li>
                <li>Getting adequate sleep</li>
                <li>Practicing stress management techniques</li>
            </ul>
        `;
    } else if (totalScore <= 14) {
        severity = 'Mild';
        interpretation = `
            <h3 style="color: #ffc107;">⚠️ Mild Symptoms</h3>
            <p>Your responses suggest mild symptoms that may benefit from attention. Consider:</p>
            <ul>
                <li>Talking to a counselor or therapist</li>
                <li>Increasing self-care activities</li>
                <li>Monitoring your symptoms</li>
                <li>Reaching out to supportive friends or family</li>
            </ul>
        `;
    } else if (totalScore <= 21) {
        severity = 'Moderate';
        interpretation = `
            <h3 style="color: #fd7e14;">🔶 Moderate Symptoms</h3>
            <p>Your responses suggest moderate symptoms. We recommend:</p>
            <ul>
                <li>Speaking with a mental health professional</li>
                <li>Consider therapy or counseling</li>
                <li>Talk to your primary care doctor</li>
                <li>Use the crisis resources if needed</li>
            </ul>
        `;
    } else {
        severity = 'Severe';
        interpretation = `
            <h3 style="color: #dc3545;">🚨 Significant Symptoms</h3>
            <p>Your responses suggest significant symptoms. It's important to:</p>
            <ul>
                <li><strong>Seek professional help immediately</strong></li>
                <li>Contact a mental health provider</li>
                <li>Consider calling crisis resources</li>
                <li>Reach out to trusted friends or family</li>
            </ul>
            <div style="background: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 15px;">
                <strong>Remember:</strong> If you're having thoughts of self-harm, please call 988 (Suicide Prevention Lifeline) or 911 immediately.
            </div>
        `;
    }
    
    document.getElementById('interpretation').innerHTML = interpretation;
}

function resetAssessment() {
    document.getElementById('assessment-results').style.display = 'none';
    document.getElementById('assessment-start').style.display = 'block';
}

function selectMood(element, mood) {
    // Remove previous selection
    document.querySelectorAll('.mood-day').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Select current mood
    element.classList.add('selected');
    selectedMood = mood;
}

function saveMood() {
    if (selectedMood === null) {
        alert('Please select a mood first!');
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    // Remove existing entry for today if it exists
    moodData = moodData.filter(entry => entry.date !== today);
    
    // Add new entry
    moodData.push({
        date: today,
        mood: selectedMood,
        timestamp: Date.now()
    });
    
    // Keep only last 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    moodData = moodData.filter(entry => entry.timestamp > thirtyDaysAgo);
    
    // Save to localStorage if available
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('moodData', JSON.stringify(moodData));
    }
    
    alert('Mood saved successfully!');
    updateMoodChart();
    
    // Reset selection
    document.querySelectorAll('.mood-day').forEach(day => {
        day.classList.remove('selected');
    });
    selectedMood = null;
}

function updateMoodChart() {
    const chartContainer = document.getElementById('mood-chart');
    
    if (moodData.length === 0) {
        chartContainer.innerHTML = '<p>Start tracking to see your mood patterns!</p>';
        return;
    }
    
    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const moodEntry = moodData.find(entry => entry.date === dateStr);
        const moodEmojis = ['', '😢', '😟', '😐', '🙂', '😊', '😁', '🤩'];
        
        last7Days.push({
            day: dayName,
            date: dateStr,
            mood: moodEntry ? moodEntry.mood : null,
            emoji: moodEntry ? moodEmojis[moodEntry.mood] : '⭕'
        });
    }
    
    const chartHTML = `
        <div style="display: flex; justify-content: space-between; align-items: end; height: 150px; border-bottom: 2px solid #e9ecef; padding-bottom: 10px;">
            ${last7Days.map(day => `
                <div style="text-align: center; flex: 1;">
                    <div style="font-size: 2rem; margin-bottom: 10px;">
                        ${day.emoji}
                    </div>
                    <div style="font-size: 0.8rem; color: #666;">
                        ${day.day}
                    </div>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 15px;">
            <p><strong>Average mood:</strong> ${calculateAverageMood()}</p>
            <p><small>Track daily to see trends and patterns in your mental health.</small></p>
        </div>
    `;
    
    chartContainer.innerHTML = chartHTML;
}

function calculateAverageMood() {
    if (moodData.length === 0) return 'No data yet';
    
    const sum = moodData.reduce((total, entry) => total + entry.mood, 0);
    const average = sum / moodData.length;
    
    const moodLabels = ['', 'Very Low', 'Low', 'Neutral', 'Good', 'Very Good', 'Great', 'Excellent'];
    return moodLabels[Math.round(average)] || 'Calculating...';
}

// Initialize mood chart on load
document.addEventListener('DOMContentLoaded', function() {
    updateMoodChart();
});