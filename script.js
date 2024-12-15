import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvIbZO07qLD_PD5VMJP1pr6pSznMH9ai0",
  authDomain: "numerocalculator.firebaseapp.com",
  projectId: "numerocalculator",
  storageBucket: "numerocalculator.firebasestorage.app",
  messagingSenderId: "375702424621",
  appId: "1:375702424621:web:955ef101817d8384b5fca4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Calculate numerology numbers
function calculateNumerology(name, birthdate) {
  const numbers = {
    destiny: 0,
    soul: 0,
    personality: 0,
    birthday: 0,
    lifePath: 0,
  };

  // Example logic for calculation (simplified for demo purposes)
  const letters = name.replace(/[^a-zA-Z]/g, "").toUpperCase();
  numbers.destiny = [...letters].reduce((sum, char) => sum + (char.charCodeAt(0) - 64), 0) % 9 || 9;

  const vowels = letters.replace(/[^AEIOU]/g, "");
  numbers.soul = [...vowels].reduce((sum, char) => sum + (char.charCodeAt(0) - 64), 0) % 9 || 9;

  const consonants = letters.replace(/[AEIOU]/g, "");
  numbers.personality = [...consonants].reduce((sum, char) => sum + (char.charCodeAt(0) - 64), 0) % 9 || 9;

  const birthNumbers = birthdate.split("-").join("");
  numbers.birthday = parseInt(birthNumbers.slice(-2)) % 9 || 9;

  numbers.lifePath = [...birthNumbers].reduce((sum, digit) => sum + parseInt(digit), 0) % 9 || 9;

  return numbers;
}

// Fetch numerology data from Firestore
async function fetchNumerologyData(numbers) {
  const numerologyCollection = collection(db, "numerology");

  const q = query(
    numerologyCollection,
    where("destiny_number", "==", numbers.destiny),
    where("soul_number", "==", numbers.soul),
    where("personality_number", "==", numbers.personality),
    where("birthday_number", "==", numbers.birthday),
    where("life_path_number", "==", numbers.lifePath)
  );

  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        displayResult(data.description);
      });
    } else {
      displayResult("No match found for the given numerology numbers.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    displayResult("An error occurred while fetching the numerology data.");
  }
}

// Display result in the HTML
function displayResult(description) {
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = description;
  resultDiv.style.visibility = "visible";
}

// Add event listener to calculate button
document.getElementById("calculateButton").addEventListener("click", () => {
  const name = document.getElementById("name").value.trim();
  const birthdate = document.getElementById("birthdate").value;

  if (!name || !birthdate) {
    displayResult("Please enter both your full name and birthdate.");
    return;
  }

  const numbers = calculateNumerology(name, birthdate);
  fetchNumerologyData(numbers);
});