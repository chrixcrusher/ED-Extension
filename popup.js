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
    // Add event listener to the "Decrypt" radio button
    decryptRadio.addEventListener('change', function() {
      if (decryptRadio.checked) {
        title.textContent = 'Decrypt your message...';
      } 
    });
    // Add event listener to the "Encrypt" radio button
    encryptRadio.addEventListener('change', function() {
      if (encryptRadio.checked) {
        title.textContent = 'Encrypt your message...';
      } 
    });


  document.getElementById('process-btn').addEventListener('click', () => {
    const action = document.querySelector('input[name="action"]:checked').value;
    const seedMultiplier = document.getElementById('seed-multiplier').value.trim();
    const [seedKey, multiplier] = seedMultiplier.split('-').map(Number);
    const message = document.getElementById('message').value.trim();

    // Debugging logs
    console.log(`Action: ${action}`);
    console.log(`Seed Key: ${seedKey}, Multiplier: ${multiplier}`);
    console.log(`Message: ${message}`);

    if (isNaN(seedKey) || isNaN(multiplier) || multiplier <= 0) {
      alert('Invalid seed key and multiplier format. Please enter a valid format like "1-2".');
      return;
    }

    let result;
    try {
      if (action === 'encrypt') {
        result = encryptMessage(message, seedKey, multiplier);
      } else if (action === 'decrypt') {
        result = decryptMessage(message, seedKey, multiplier);
      }
      document.getElementById('output').value = result;
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
});
