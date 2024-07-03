// wordOfTheDay.js

// Event listener for adding a new word of the day
document.getElementById('addWordButton').addEventListener('click', () => {
  const word = document.getElementById('wordOfDayInput').value;
  console.log(`Adding word of the day: ${word}`);
  if (word) {
    addWordOfDay(word); // Function call to add the word to local storage
    displayWordList(); // Function call to update and display the word list
    showAlert('Word added successfully.', 'success'); // Function call to show a success alert
  }
});

// Function to add a word of the day to local storage
function addWordOfDay(word) {
  console.log(`Adding ${word} to local storage...`);
  let words = getWordsOfDay();
  words.push(word); // Adding the new word to the array
  localStorage.setItem('wordsOfDay', JSON.stringify(words)); // Saving the updated array to local storage
}

// Function to retrieve words of the day from local storage
function getWordsOfDay() {
  console.log('Fetching words of the day from local storage...');
  return JSON.parse(localStorage.getItem('wordsOfDay')) || []; // Retrieving and parsing stored words, or initializing an empty array
}

// Function to display the list of words of the day on the page
function displayWordList() {
  console.log('Displaying words of the day...');
  const wordListDiv = document.getElementById('wordList');
  wordListDiv.innerHTML = ''; // Clearing previous content

  const words = getWordsOfDay();
  words.forEach((word, index) => {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'list-group-item d-flex justify-content-between align-items-center';

    // Input field to display the word
    const wordText = document.createElement('input');
    wordText.type = 'text';
    wordText.value = word;
    wordText.className = 'form-control mr-2';
    wordText.disabled = true; // Disable the text box by default
    wordDiv.appendChild(wordText);

    // Speaker icon for text-to-speech
    const speakerIcon = document.createElement('i');
    speakerIcon.className = 'fas fa-volume-up ml-2';
    speakerIcon.style.cursor = 'pointer';
    speakerIcon.addEventListener('click', () => {
      const audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/${wordText.value}.mp3`);
      audio.play();
    });
    wordDiv.appendChild(speakerIcon);

    // Lookup button to fetch detailed information about the word
    const lookupButton = document.createElement('button');
    lookupButton.textContent = 'Lookup';
    lookupButton.className = 'btn btn-info btn-sm ml-2';
    lookupButton.addEventListener('click', () => {
      lookupWord(wordText.value);
    });
    wordDiv.appendChild(lookupButton);

    // Update button to edit the word
    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.className = 'btn btn-warning btn-sm ml-2';
    updateButton.addEventListener('click', () => {
      if (wordText.disabled) {
        wordText.disabled = false; // Enable editing
        updateButton.textContent = 'Save';
      } else {
        wordText.disabled = true; // Disable editing
        updateButton.textContent = 'Update';
        updateWordOfDay(index, wordText.value); // Update word in local storage
        showAlert('Word updated successfully.', 'secondary'); // Show update success alert
      }
    });
    wordDiv.appendChild(updateButton);

    // Delete button to remove the word
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'btn btn-danger btn-sm ml-2';
    deleteButton.addEventListener('click', () => {
      console.log(`Deleting word: ${word}`);
      deleteWordOfDay(index); // Delete word from local storage
      displayWordList(); // Update and display the word list
      showAlert('Word deleted successfully.', 'danger'); // Show delete success alert
    });
    wordDiv.appendChild(deleteButton);

    wordListDiv.appendChild(wordDiv); // Append word div to the word list container
  });
}

// Function to update a word of the day in local storage
function updateWordOfDay(index, newWord) {
  console.log(`Updating word at index ${index} with ${newWord}...`);
  let words = getWordsOfDay();
  words[index] = newWord; // Updating the word at the specified index
  localStorage.setItem('wordsOfDay', JSON.stringify(words)); // Saving the updated array to local storage
}

// Function to delete a word of the day from local storage
function deleteWordOfDay(index) {
  console.log(`Deleting word at index ${index} from local storage...`);
  let words = getWordsOfDay();
  words.splice(index, 1); // Removing the word at the specified index
  localStorage.setItem('wordsOfDay', JSON.stringify(words)); // Saving the updated array to local storage
}

// Function to look up detailed information about a word using an API
function lookupWord(word) {
  console.log(`Looking up the word: ${word}`);
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        console.log('Data fetched from API:', data);
        displayLookupResult(data[0]); // Display detailed word information
        showAlert('Word lookup successful.', 'info'); // Show lookup success alert
      } else {
        console.log('Word not found.');
        displayLookupResult(null); // Display message for word not found
        showAlert('Word not found.', 'warning'); // Show word not found alert
      }
    })
    .catch(error => {
      console.error('Error:', error);
      displayLookupResult(null); // Display message for error
      showAlert('Error fetching word details.', 'danger'); // Show error alert
    });
}

// Function to display detailed information about a word
function displayLookupResult(wordData) {
  const detailsDiv = document.getElementById('wordDetails');
  detailsDiv.innerHTML = ''; // Clear previous content

  if (wordData) {
    // Display word title with pronunciation and speaker icon
    const wordElement = document.createElement('div');
    wordElement.className = 'word-title d-flex align-items-center';

    const wordText = document.createElement('h2');
    wordText.textContent = wordData.word;
    wordText.className = 'mr-2';
    wordElement.appendChild(wordText);

    const speakerIcon = document.createElement('i');
    speakerIcon.className = 'fas fa-volume-up ml-2';
    speakerIcon.style.cursor = 'pointer';
    speakerIcon.addEventListener('click', () => {
      const audio = new Audio(wordData.phonetics[0].audio);
      audio.play();
    });
    wordElement.appendChild(speakerIcon);

    detailsDiv.appendChild(wordElement); // Append word title to details container

    // Display phonetic notation
    const phoneticElement = document.createElement('p');
    phoneticElement.className = 'text-muted';
    phoneticElement.textContent = wordData.phonetic || '';
    detailsDiv.appendChild(phoneticElement);

    // Display meanings and definitions
    wordData.meanings.forEach(meaning => {
      const partOfSpeech = document.createElement('h3');
      partOfSpeech.textContent = meaning.partOfSpeech;
      partOfSpeech.className = 'text-primary';
      detailsDiv.appendChild(partOfSpeech);

      meaning.definitions.forEach(definition => {
        const definitionElement = document.createElement('p');
        definitionElement.textContent = definition.definition;
        definitionElement.className = 'mb-2';
        detailsDiv.appendChild(definitionElement);

        if (definition.example) {
          const exampleElement = document.createElement('p');
          exampleElement.textContent = `Example: ${definition.example}`;
          exampleElement.className = 'text-info';
          detailsDiv.appendChild(exampleElement);
        }

        if (definition.synonyms.length > 0) {
          const synonymsElement = document.createElement('p');
          synonymsElement.textContent = `Synonyms: ${definition.synonyms.join(', ')}`;
          synonymsElement.className = 'text-success';
          detailsDiv.appendChild(synonymsElement);
        }

        if (definition.antonyms.length > 0) {
          const antonymsElement = document.createElement('p');
          antonymsElement.textContent = `Antonyms: ${definition.antonyms.join(', ')}`;
          antonymsElement.className = 'text-danger';
          detailsDiv.appendChild(antonymsElement);
        }
      });
    });
  } else {
    // Display message for word not found
    const notFoundElement = document.createElement('div');
    notFoundElement.className = 'alert alert-warning';
    notFoundElement.textContent = 'Word not found.';
    detailsDiv.appendChild(notFoundElement);
  }
}

// Function to show an alert message
function showAlert(message, type) {
  const alertPlaceholder = document.getElementById('alertPlaceholder');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.role = 'alert';
  alert.textContent = message;
  alertPlaceholder.appendChild(alert); // Append alert to placeholder

  setTimeout(() => {
    alert.remove(); // Remove alert after 3 seconds
  }, 3000);
}

// Display word list on page load
displayWordList();
