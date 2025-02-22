// Constants
const UNSPLASH_ACCESS_KEY = 'ZyGAWLKApaJrfuiIdaqA4PR5LktN12C7yrzNvjpNC_s';

// Fallback quotes in case the API is unreachable
const fallbackQuotes = [
    {
        content: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    },
    {
        content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        content: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
    },
    {
        content: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        content: "The only limit to our realization of tomorrow will be our doubts of today.",
        author: "Franklin D. Roosevelt"
    }
];

// DOM Elements
const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');
const themeToggle = document.getElementById('themeToggle');
const backgroundElement = document.getElementById('background');

// Theme Management
function initializeTheme() {
    if (localStorage.theme === 'dark' || (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    }
}

// Toast Notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.style.display = 'none';
        toast.remove();
    }, 3000);
}

// Quote Management
async function fetchQuote() {
    try {
        const response = await fetch('https://api.quotable.io/random');
        if (!response.ok) throw new Error('Failed to fetch quote');
        return await response.json();
    } catch (error) {
        console.log('Using fallback quote system');
        return getFallbackQuote();
    }
}

function getFallbackQuote() {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
}

async function updateQuote() {
    try {
        const quoteData = await fetchQuote();
        
        // Reset animation
        quoteElement.parentElement.style.animation = 'none';
        quoteElement.parentElement.offsetHeight; // Trigger reflow
        quoteElement.parentElement.style.animation = null;
        
        quoteElement.textContent = `"${quoteData.content}"`;
        authorElement.textContent = `- ${quoteData.author}`;
    } catch (error) {
        showToast('Error fetching quote. Please try again.');
    }
}

// Background Image Management
async function updateBackground() {
    try {
        const response = await fetch(
            `https://api.unsplash.com/photos/random?query=nature,landscape,inspiration&orientation=landscape`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            }
        );
        
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const data = await response.json();
        backgroundElement.style.backgroundImage = `url(${data.urls.regular})`;
        backgroundElement.style.opacity = '1';
    } catch (error) {
        console.error('Error fetching background:', error);
        // Fallback to a gradient
        backgroundElement.style.backgroundImage = 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)';
    }
}

// Event Listeners
copyBtn.addEventListener('click', async () => {
    try {
        const text = `${quoteElement.textContent} ${authorElement.textContent}`;
        await navigator.clipboard.writeText(text);
        showToast('Quote copied to clipboard!');
    } catch (err) {
        showToast('Failed to copy quote');
    }
});

shareBtn.addEventListener('click', async () => {
    try {
        const text = `${quoteElement.textContent} ${authorElement.textContent}`;
        if (navigator.share) {
            await navigator.share({ text });
            showToast('Quote shared successfully!');
        } else {
            throw new Error('Share not supported');
        }
    } catch (err) {
        showToast('Share not supported on this device');
    }
});

newQuoteBtn.addEventListener('click', () => {
    updateQuote();
    updateBackground();
});

themeToggle.addEventListener('click', toggleTheme);

// Initialize
initializeTheme();
updateQuote();
updateBackground();
