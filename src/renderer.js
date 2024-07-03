// renderer.js

// Add event listener to the lookup button
document.getElementById('lookupButton').addEventListener('click', () => {
  // Get the word from the input field
  const word = document.getElementById('wordInput').value;
  console.log(`Looking up the word: ${word}`);
  
  // Fetch data from the dictionary API for the entered word
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
      console.log('Data fetched from API:', data);
      // Display word details using the fetched data
      displayWordDetails(data[0]);
    })
    .catch(error => {
      console.error('Error:', error);
      // Display message if word not found or error occurs
      displayWordDetails(null);
    });
});

// Function to display word details
function displayWordDetails(wordData) {
  console.log('Displaying word details...');
  const detailsDiv = document.getElementById('wordDetails');
  detailsDiv.innerHTML = ''; // Clear previous details

  if (wordData) {
    // Create a div to display the word and its phonetic pronunciation
    const wordElement = document.createElement('div');
    wordElement.className = 'word-title d-flex align-items-center';
    
    const wordText = document.createElement('h2');
    wordText.textContent = wordData.word;
    wordText.className = 'mr-2';
    wordElement.appendChild(wordText);

    // Add a speaker icon to play the word pronunciation audio
    const speakerIcon = document.createElement('i');
    speakerIcon.className = 'fas fa-volume-up ml-2';
    speakerIcon.style.cursor = 'pointer';
    speakerIcon.addEventListener('click', () => {
      const audio = new Audio(wordData.phonetics[0].audio);
      audio.play(); // Play the pronunciation audio
    });
    wordElement.appendChild(speakerIcon);

    detailsDiv.appendChild(wordElement);

    // Display the phonetic transcription of the word
    const phoneticElement = document.createElement('p');
    phoneticElement.className = 'text-muted';
    phoneticElement.textContent = wordData.phonetic || '';
    detailsDiv.appendChild(phoneticElement);

    // Iterate through each meaning of the word and display part of speech
    wordData.meanings.forEach(meaning => {
      const partOfSpeech = document.createElement('h3');
      partOfSpeech.textContent = meaning.partOfSpeech;
      partOfSpeech.className = 'text-primary';
      detailsDiv.appendChild(partOfSpeech);

      // Iterate through each definition and display it
      meaning.definitions.forEach(definition => {
        const definitionElement = document.createElement('p');
        definitionElement.textContent = definition.definition;
        definitionElement.className = 'mb-2';
        detailsDiv.appendChild(definitionElement);

        // Display example sentence if available
        if (definition.example) {
          const exampleElement = document.createElement('p');
          exampleElement.textContent = `Example: ${definition.example}`;
          exampleElement.className = 'text-info';
          detailsDiv.appendChild(exampleElement);
        }

        // Display synonyms if available
        if (definition.synonyms.length > 0) {
          const synonymsElement = document.createElement('p');
          synonymsElement.textContent = `Synonyms: ${definition.synonyms.join(', ')}`;
          synonymsElement.className = 'text-success';
          detailsDiv.appendChild(synonymsElement);
        }

        // Display antonyms if available
        if (definition.antonyms.length > 0) {
          const antonymsElement = document.createElement('p');
          antonymsElement.textContent = `Antonyms: ${definition.antonyms.join(', ')}`;
          antonymsElement.className = 'text-danger';
          detailsDiv.appendChild(antonymsElement);
        }
      });
    });
  } else {
    // Display a warning message if the word is not found
    const notFoundElement = document.createElement('div');
    notFoundElement.className = 'alert alert-warning';
    notFoundElement.textContent = 'Word not found.';
    detailsDiv.appendChild(notFoundElement);
  }
}
