const CHAR_SET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';

// Function to encrypt a message
function encryptMessage(message, seedKey, multiplier) {
  const keyDict = generateKey(seedKey, multiplier);
  return message.split('').map(char => keyDict[char] || char).join('');
}

function generateKey(seedKey, multiplier) {
  const keyDict = {};
  const charList = CHAR_SET.split('');
  // Seed the random number generator
  Math.seedrandom(seedKey.toString());
  for (const char of CHAR_SET) {
    if (multiplier === 1) {
      const randomIndex = Math.floor(Math.random() * charList.length);
      keyDict[char] = charList[randomIndex];
      charList.splice(randomIndex, 1);
    } else {
      charList.sort(() => Math.random() - 0.5);
      keyDict[char] = charList.slice(0, multiplier).join('');
    }
  }
  return keyDict;
}

function decryptMessage(encryptedMessage, seedKey, multiplier) {
  const keyDict = generateKey(seedKey, multiplier);
  const reverseKeyDict = {};
  for (const key in keyDict) {
    const value = keyDict[key];
    if (multiplier === 1) {
      reverseKeyDict[value] = key;
    } else {
      const chunks = value.match(new RegExp(`.{1,${multiplier}}`, 'g'));
      for (const chunk of chunks) {
        reverseKeyDict[chunk] = key;
      }
    }
  }
  let decryptedMessage = '';
  let i = 0;
  while (i < encryptedMessage.length) {
    let found = false;
    for (let j = multiplier; j > 0; j--) {
      const chunk = encryptedMessage.slice(i, i + j);
      if (reverseKeyDict[chunk]) {
        decryptedMessage += reverseKeyDict[chunk];
        i += j;
        found = true;
        break;
      }
    }
    if (!found) {
      decryptedMessage += encryptedMessage[i];
      i++;
    }
  }
  return decryptedMessage;
}


// Add event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {

  // Select the radio buttons and title element
  const encryptRadio = document.getElementById('encrypt');
  const decryptRadio = document.getElementById('decrypt');
  const title = document.getElementById('title');
  const messageField = document.getElementById('message');
  const fileInput = document.getElementById('file-input');
  const fileLabel = document.getElementById('file-label');
  const clearFileButton = document.getElementById('clear-file-btn');


  // Add event listener to the "Decrypt" radio button
  decryptRadio.addEventListener('change', function() {
    if (decryptRadio.checked) {
      title.textContent = 'Decrypt your message...';
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } 
  });

  // Add event listener to the "Encrypt" radio button
  encryptRadio.addEventListener('change', function() {
    if (encryptRadio.checked) {
      title.textContent = 'Encrypt your message...';
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } 
  });

  clearFileButton.addEventListener('click', function() {
    fileInput.value = ''; // Clear the selected file
    messageField.disabled = false;
    messageField.placeholder = 'Enter your message';
  });

  // Disabled Message when file selected
  fileInput.addEventListener('change', function() {
    messageField.disabled = true;
    messageField.placeholder = 'Message is disabled when file is selected.';
    messageField.value = '';
  });

  // Add event listener for process button hover effect
  const processBtn = document.getElementById('process-btn');

  processBtn.addEventListener('mouseover', function() {
    if (encryptRadio.checked) {
      processBtn.textContent = "Encrypt";
    } else if (decryptRadio.checked) {
      processBtn.textContent = "Decrypt";
    }
  });
  
  processBtn.addEventListener('mouseout', function() {
    if (encryptRadio.checked) {
      processBtn.textContent = "Process";
    } else if (decryptRadio.checked) {
      processBtn.textContent = "Process";
    }
  });

// Add event listener for file input hover effect
fileInput.addEventListener('mouseover', function() {
  fileLabel.textContent = "Only accept txt & json files:";
});

fileInput.addEventListener('mouseout', function() {
  fileLabel.textContent = "File:";
});

  // Add event listener for file input change to validate file format
  fileInput.addEventListener('change', function() {
    const allowedFormats = ['text/plain', 'application/json']; // Only works for txt and json files properly
    const file = fileInput.files[0];
    if (file && !allowedFormats.includes(file.type)) {
      alert('Invalid file format. Please select a valid text file.');
      fileInput.value = ''; // Clear the selected file
      messageField.disabled = false;
      messageField.placeholder = 'Enter your message';
    } else {
      messageField.disabled = true;
      messageField.placeholder = 'Message is disabled when file is selected.';
      messageField.value = '';
    }
  });

  document.getElementById('process-btn').addEventListener('click', () => {
    const action = document.querySelector('input[name="action"]:checked').value;
    const seedMultiplier = document.getElementById('seed-multiplier').value.trim();
    const [seedKey, multiplier] = seedMultiplier.split('-').map(Number);
    const message = messageField.value.trim();

    // Debugging logs
    console.log(`Action: ${action}`);
    console.log(`Seed Key: ${seedKey}, Multiplier: ${multiplier}`);
    console.log(`Message: ${message}`);

    //Check if seedKey and multiplier are valid
    if (isNaN(seedKey) || isNaN(multiplier)) {
      alert('Invalid seed key and multiplier format. Please enter a valid format like "1-2".');
      return;
    }

    // Check if seedKey is a positive integer
    if (!Number.isInteger(seedKey) || seedKey <= 0) {
      alert('Seed key must be a positive integer.');
      return;
    }

    // Check if multiplier is a positive integer
    if (!Number.isInteger(multiplier) || multiplier <= 0) {
      alert('Multiplier must be a positive integer.');
      return;
    }

    // Check if multiplier is less than 50
    if (multiplier > 50) {
      alert('Multiplier cannot exceed 50.');
      return;
    }

    let result;
    try {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
          const fileContent = e.target.result;
          if (action === 'encrypt') {
            result = encryptMessage(fileContent, seedKey, multiplier);
          } else if (action === 'decrypt') {
            result = decryptMessage(fileContent, seedKey, multiplier);
          }
          document.getElementById('output').value = result;
        };
        reader.readAsText(file);
        messageField.disabled = true;
        messageField.placeholder = 'Message is disabled when file is selected.';
      } else {
        if (action === 'encrypt') {
          result = encryptMessage(message, seedKey, multiplier);
        } else if (action === 'decrypt') {
          result = decryptMessage(message, seedKey, multiplier);
        }
        document.getElementById('output').value = result;
        messageField.disabled = false;
        messageField.placeholder = 'Enter your message';
      }
    } catch (error) {
      console.error(`Error: ${error}`);
      alert('An error occurred while processing the message.');
    }
  });

  document.getElementById('copy-btn').addEventListener('click', () => {
    const output = document.getElementById('output');
    output.select();
    document.execCommand('copy');
    // alert('Output copied to clipboard.');
  });

  document.getElementById('export-btn').addEventListener('click', () => {
    const output = document.getElementById('output').value;
    // Check if the output is empty to prevent exporting an empty file
    if (output.trim() === '') {
      // alert('Output is empty. Cannot export a file.');
      return; // Exit the function if the output is empty
    }
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Distinguishing between encryption and decryption actions
    const action = document.querySelector('input[name="action"]:checked').value;
    if (action === 'encrypt') {
      a.download = 'e_msg.txt';
    } else if (action === 'decrypt') {
      a.download = 'd_msg.txt';
    }
  
    a.click();
  });
  

});
