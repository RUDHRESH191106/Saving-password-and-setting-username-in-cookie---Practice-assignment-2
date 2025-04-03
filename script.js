const MIN = 100;
const MAX = 999;
const pinInput = document.getElementById('pin');
const sha256HashView = document.getElementById('sha256-hash');
const resultView = document.getElementById('result');
const checkButton = document.getElementById('check');

// Store value in local storage
function store(key, value) {
  localStorage.setItem(key, value);
}

// Retrieve value from local storage
function retrieve(key) {
  return localStorage.getItem(key);
}

// Generate a random 3-digit number
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Clear local storage
function clearStorage() {
  localStorage.clear();
}

// Generate SHA256 hash of a given string
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Get SHA256 hash, storing it if not already generated
async function getSHA256Hash() {
  let cachedHash = retrieve('sha256');
  if (!cachedHash) {
    const randomNumber = getRandomArbitrary(MIN, MAX).toString();
    cachedHash = await sha256(randomNumber);
    store('sha256', cachedHash);
  }
  return cachedHash;
}

// Display the SHA256 hash when the page loads
async function main() {
  sha256HashView.innerHTML = 'Calculating...';
  const hash = await getSHA256Hash();
  sha256HashView.innerHTML = hash;
}

// Validate the user input and check if it matches the stored hash
async function test() {
  const pin = pinInput.value.trim();

  if (pin.length !== 3) {
    resultView.innerHTML = '💡 Enter a 3-digit number';
    resultView.classList.remove('hidden');
    return;
  }

  const hashedPin = await sha256(pin);
  const storedHash = retrieve('sha256');

  if (hashedPin === storedHash) {
    resultView.innerHTML = '🎉 Success!';
    resultView.classList.add('success');
  } else {
    resultView.innerHTML = '❌ Incorrect!';
  }
  resultView.classList.remove('hidden');
}

// Ensure pinInput only accepts numbers and is 3 digits long
pinInput.addEventListener('input', (e) => {
  pinInput.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Attach the test function to the button
checkButton.addEventListener('click', test);

// Run main function to generate the hash on page load
main();
