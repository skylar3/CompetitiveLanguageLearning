async function fetchRandomSentence() {
    try {
        // Call the backend to get the random sentence and its translation
        const response = await fetch('/get-translation');
        const data = await response.json();

        // Update the original and translated sentences in the HTML
        document.getElementById("language").textContent=data.language;
        document.getElementById('original-sentence').textContent = data.original;
        document.getElementById('translated-sentence').textContent = data.translated;
    } catch (error) {
        console.error('Error fetching sentence:', error);
        document.getElementById('original-sentence').textContent = 'Failed to fetch sentence.';
        document.getElementById('translated-sentence').textContent = 'Translation failed.';
    }
    //gotta make a commit
}

// Make sure to call the function at the right place (outside of the function definition)
fetchRandomSentence();  // Call the function to fetch and display the sentence and translation
