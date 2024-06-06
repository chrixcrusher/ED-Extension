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


