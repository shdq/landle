export const getNextUniqueRandomNumber = (prevNumber = 1) => {
  const getRandomNumber = () => Math.floor(Math.random() * 99) + 1;
  let newNumber = getRandomNumber();
  while (prevNumber === newNumber) {
    newNumber = getRandomNumber();
  }
  return newNumber;
};

export function generateOptions(originalNumber: number): number[] {
  // Generates a random number between -9 and 9
  function getRandomOffset(): number {
    return Math.floor(Math.random() * 19) - 9;
  }

  const optionsSet: Set<number> = new Set();

  optionsSet.add(originalNumber);

  while (optionsSet.size < 4) {
    const offset = getRandomOffset();
    // Ensure the similar number stays between 1 and 99
    const similarNumber = Math.min(Math.max(originalNumber + offset, 1), 99);
    optionsSet.add(similarNumber);
  }

  // Convert the set to an array and shuffle it
  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);

  return options;
}

export function speakNumber(
  number: number,
  language: string,
  speed: number = 0.8
) {
  // Check if window and speechSynthesis are available
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const synth = window.speechSynthesis;

    // Cancel any ongoing speech before starting a new one
    synth.cancel();

    // Create a new utterance instance
    const utterance = new SpeechSynthesisUtterance(number.toString());

    // Set language and playback speed
    utterance.lang = `${language.toLowerCase()}-${language}`;
    utterance.rate = speed; // Speed (1 is default)

    // Speak the number
    synth.speak(utterance);
  } else {
    console.warn("Speech synthesis not supported in this environment.");
  }
}
