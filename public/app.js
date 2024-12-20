let fetchedData = {}; // Global variable to store fetched data

// Fetch and store sentence and language data
async function fetchRandomSentence() {
    try {
        const response = await fetch('/get-translation');
        fetchedData = await response.json();  // Store the response in the global variable

        // Log the fetched data to check its structure
        console.log('Fetched data in fetchRandomSentence:', fetchedData);

        // Update the original and translated sentences in the HTML
        document.getElementById("language").textContent = fetchedData.fullLanguage;
        document.getElementById('original-sentence').textContent = fetchedData.original;
        document.getElementById('translated-sentence').textContent = fetchedData.translated;

    } catch (error) {
        console.error('Error fetching sentence:', error);
        document.getElementById('original-sentence').textContent = 'Failed to fetch sentence.';
        document.getElementById('translated-sentence').textContent = 'Translation failed.';
    }
}

// Use the stored data in Checked function
async function Checked() {
    try {
        // Check if the fetchedData object is populated
        if (!fetchedData || !fetchedData.fullLanguage) {
            console.error("fullLanguage is missing in the fetched data:", fetchedData);
            alert("Error: fullLanguage is missing.");
            return;
        }

        var userInput = document.getElementById("userInput").value;

        if (userInput.trim().toLowerCase() === fetchedData.fullLanguage.toLowerCase()) {
            alert("You guessed the correct language!");
        } else {
            alert("Wrong language");
        }
    } catch (error) {
        console.error('Error in Checked function:', error);
        alert("Error occurred while checking the language.");
    }
}

// Add event listener after the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Attach the Checked function to the button's click event
    const checkButton = document.getElementById("checkButton");
    checkButton.addEventListener("click", Checked);

    // Call the function to fetch and display the sentence and translation
    fetchRandomSentence();
});
