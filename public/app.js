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

// Use the stored data in CheckedTranslation function
async function CheckedTranslation() {
    try {
        // Check if the fetchedData object is populated
        if (!fetchedData || !fetchedData.fullLanguage) {
            console.error("fullLanguage is missing in the fetched data:", fetchedData);
            alert("Error: fullLanguage is missing.");
            return;
        }

        var userInputTranslation = document.getElementById("userInputTranslation").value;
        var score = compareStrings(userInputTranslation, fetchedData.original);
        alert("Your score is: " + (100 - score));

        // Draw the pie chart
        drawPieChart(100 - score);
    } catch (error) {
        console.error('Error in Checked function:', error);
        alert("Error occurred while checking the language.");
    }
}

// Function to compare similarity of strings (Levenshtein Distance)
function compareStrings(s, t) {
    if (s === t) {
        return 0;
    }
    var n = s.length, m = t.length;
    if (n === 0 || m === 0) {
        return n + m;
    }
    var x = 0, y, a, b, c, d, g, h;
    var p = new Uint16Array(n);
    var u = new Uint32Array(n);
    for (y = 0; y < n;) {
        u[y] = s.charCodeAt(y);
        p[y] = ++y;
    }

    for (; (x + 3) < m; x += 4) {
        var e1 = t.charCodeAt(x);
        var e2 = t.charCodeAt(x + 1);
        var e3 = t.charCodeAt(x + 2);
        var e4 = t.charCodeAt(x + 3);
        c = x;
        b = x + 1;
        d = x + 2;
        g = x + 3;
        h = x + 4;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || b < c) {
                c = (a > b ? b + 1 : a + 1);
            }
            else {
                if (e1 !== u[y]) {
                    c++;
                }
            }

            if (c < b || d < b) {
                b = (c > d ? d + 1 : c + 1);
            }
            else {
                if (e2 !== u[y]) {
                    b++;
                }
            }

            if (b < d || g < d) {
                d = (b > g ? g + 1 : b + 1);
            }
            else {
                if (e3 !== u[y]) {
                    d++;
                }
            }

            if (d < g || h < g) {
                g = (d > h ? h + 1 : d + 1);
            }
            else {
                if (e4 !== u[y]) {
                    g++;
                }
            }
            p[y] = h = g;
            g = d;
            d = b;
            b = c;
            c = a;
        }
    }

    for (; x < m;) {
        var e = t.charCodeAt(x);
        c = x;
        d = ++x;
        for (y = 0; y < n; y++) {
            a = p[y];
            if (a < c || d < c) {
                d = (a > d ? d + 1 : a + 1);
            }
            else {
                if (e !== u[y]) {
                    d = c + 1;
                }
                else {
                    d = c;
                }
            }
            p[y] = d;
            c = a;
        }
        h = d;
    }

    return h;
}

function drawPieChart(score) {
    // Get the canvas element by its ID (should be #chartCanvas, not #chart-container)
    var chartCanvas = document.getElementById('chartCanvas');

    // Check if the canvas exists and get its context
    if (chartCanvas && chartCanvas.getContext) {
        var ctx = chartCanvas.getContext('2d');

        const data = {
            labels: [
                'Correct Translation',
                'Incorrect Translation'
            ],
            datasets: [{
                label: 'Translation Accuracy',
                data: [score, 100 - score],
                backgroundColor: [
                    'rgb(75, 192, 192)', // Correct
                    'rgb(255, 99, 132)', // Incorrect
                ],
                hoverOffset: 4
            }]
        };

        const config = {
            type: 'pie',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
                            }
                        }
                    }
                }
            }
        };

        new Chart(ctx, config); // Create the chart with the canvas context
    } else {
        console.error('Canvas context not found. Ensure the element is a canvas.');
    }
}



// Add event listener after the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Attach the Checked function to the button's click event
    const checkButton = document.getElementById("checkButton");
    checkButton.addEventListener("click", Checked);

    // Attach the CheckedTranslation function to the button's click event
    const checkButtonTranslation = document.getElementById("checkButtonTranslation");
    checkButtonTranslation.addEventListener("click", CheckedTranslation);

    // Call the function to fetch and display the sentence and translation
    fetchRandomSentence();
});
