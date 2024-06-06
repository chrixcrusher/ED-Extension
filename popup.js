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
      const [seedKeyStr, multiplierStr] = seedMultiplier.split('-');
    
      // Regex to ensure only digits
      const digitRegex = /^\d+$/;
    
      // Check if seedKeyStr and multiplierStr are digits only
      if (!digitRegex.test(seedKeyStr) || !digitRegex.test(multiplierStr)) {
        alert('Invalid format. Please enter a valid format like "1-2".');
        return;
      }
    
      const seedKey = Number(seedKeyStr);
      const multiplier = Number(multiplierStr);
      const message = messageField.value.trim(); // Ensure this line is included
  
      // Debugging logs
      console.log(`Action: ${action}`);
      console.log(`Seed Key: ${seedKey}, Multiplier: ${multiplier}`);
      console.log(`Message: ${message}`);
  
  
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
  