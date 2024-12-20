import express from 'express';
import fetch from 'node-fetch';  // If you're using Node.js, you need node-fetch
import * as deepl from 'deepl-node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Set up the Deepl translator
const authKey = process.env.DEEPL_KEY;
if (!authKey) {
    console.error('API key is missing. Please check your .env file.');
    process.exit(1);
}
const translator = new deepl.Translator(authKey);

// Serve static files (like your HTML file)
app.use(express.static('public'));

// List of available languages for translation
const availableLanguages = [
    'en', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'ru', 'ja', 'zh', 'pt', 'da', 'fi', 'sv', 'no', 'tr', 'cs', 'el', 'ro', 'hu', 'bg', 'hr', 'lt', 'lv', 'et', 'sk', 'sl'
];

const languageMap = {
    'en': 'English',
    'de': 'German',
    'fr': 'French',
    'es': 'Spanish',
    'it': 'Italian',
    'nl': 'Dutch',
    'pl': 'Polish',
    'ru': 'Russian',
    'ja': 'Japanese',
    'zh': 'Chinese',
    'pt': 'Portuguese',
    'da': 'Danish',
    'fi': 'Finnish',
    'sv': 'Swedish',
    'no': 'Norwegian',
    'tr': 'Turkish',
    'cs': 'Czech',
    'el': 'Greek',
    'ro': 'Romanian',
    'hu': 'Hungarian',
    'bg': 'Bulgarian',
    'hr': 'Croatian',
    'lt': 'Lithuanian',
    'lv': 'Latvian',
    'et': 'Estonian',
    'sk': 'Slovak',
    'sl': 'Slovenian'
};

// Endpoint to get a random sentence from Wikipedia and translate it to a random language
app.get('/get-translation', async (req, res) => {
    try {
        console.log('Fetching random Wikipedia page...');
        // Fetch a random Wikipedia page summary
        const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
        const data = await response.json();
        
        if (!data.extract) {
            throw new Error('Failed to fetch a valid Wikipedia page summary');
        }
        
        // Extract the page content (summary)
        const pageContent = data.extract;
        
        // Split the summary into sentences and randomly pick one sentence
        const sentences = pageContent.split(/[.!?]\s*/);
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];

        // Randomly select a language (except for English, because the page is in English)
        const randomLanguage = availableLanguages[Math.floor(Math.random() * availableLanguages.length)];
        const randomLanguageFull = languageMap[randomLanguage];
        
        console.log(`Selected language for translation: ${randomLanguageFull} (${randomLanguage})`);
        
        // Translate the sentence into the random language
        const result = await translator.translateText(randomSentence, 'en', randomLanguage);
        
        console.log('Translation successful: ', result.text);

        // Send back the original sentence, translated sentence, and language
        res.json({
            original: randomSentence,
            translated: result.text,
            language: randomLanguage,
            fullLanguage: randomLanguageFull
        });
    } catch (error) {
        console.error('Error fetching or translating:', error);
        res.status(500).json({ error: 'An error occurred while fetching or translating the sentence.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
