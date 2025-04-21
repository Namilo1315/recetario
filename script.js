document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const recipes = document.querySelectorAll('.recipe');
    const speakItems = document.querySelectorAll('[data-speak]');

    // --- Tab Switching Logic ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tabs and recipes
            tabs.forEach(t => t.classList.remove('active'));
            recipes.forEach(r => r.classList.remove('active'));

            // Activate clicked tab
            tab.classList.add('active');

            // Activate corresponding recipe
            const recipeId = tab.getAttribute('data-recipe');
            const activeRecipe = document.getElementById(recipeId);
            if (activeRecipe) {
                activeRecipe.classList.add('active');
            }
        });
    });

    // --- Text-to-Speech Logic ---
    const synth = window.speechSynthesis;
    let utterance = null; // To hold the SpeechSynthesisUtterance instance

    // Function to stop any ongoing speech
    const stopSpeech = () => {
        if (synth.speaking) {
            synth.cancel(); // Stop current speech
        }
        if (utterance) {
            utterance.onend = null; // Remove listener to prevent issues
        }
    };

    // Add click listeners to items/steps with data-speak
    speakItems.forEach(item => {
        item.addEventListener('click', (event) => {
            // Prevent clicks on nested elements from triggering multiple times if needed
            // event.stopPropagation();

            const textToSpeak = item.getAttribute('data-speak');

            if (textToSpeak && synth) {
                stopSpeech(); // Stop any previous speech before starting new

                utterance = new SpeechSynthesisUtterance(textToSpeak);
                utterance.lang = 'es-ES'; // Set language to Spanish (Spain)
                utterance.pitch = 1.1; // Slightly higher pitch for fun
                utterance.rate = 0.9; // Slightly slower rate for clarity

                // Optional: Highlight item while speaking
                item.classList.add('speaking');
                utterance.onend = () => {
                    item.classList.remove('speaking'); // Remove highlight when done
                    utterance = null; // Clear the utterance instance
                };
                utterance.onerror = (e) => {
                    console.error('SpeechSynthesisUtterance.onerror', e);
                    item.classList.remove('speaking'); // Ensure highlight is removed on error
                    utterance = null;
                }

                synth.speak(utterance);
            } else if (!synth) {
                console.warn('Speech Synthesis not supported in this browser.');
            } else {
                console.warn('No text to speak for this item.');
            }
        });
    });

     // Add a visual cue for speaking state if desired (optional)
     const style = document.createElement('style');
     style.textContent = `
         .speaking {
             outline: 3px solid #ffcc00; /* Yellow outline when speaking */
             box-shadow: 0 0 10px #ffcc00;
             background-color: #fffacd !important; /* Lemon chiffon highlight */
         }
     `;
     document.head.appendChild(style);


    // Ensure the first tab is active on load (if not already handled by HTML)
    if (!document.querySelector('.tab-button.active')) {
        const firstTab = document.querySelector('.tab-button');
        const firstRecipe = document.querySelector('.recipe');
        if (firstTab && firstRecipe) {
            firstTab.classList.add('active');
            firstRecipe.classList.add('active');
        }
    }
});