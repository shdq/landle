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

type VoicePreferences = {
  [lang: string]: string[];
};
const preferredVoices: VoicePreferences = {
  en: ["Samantha"],
  es: ["Paulina"],
  ru: ["Milena"],
  fr: ["Amélie"],
  de: ["Anna"],
  it: ["Alice"],
};

function getPreferredVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();

  // Try finding by preferred voice names
  const preferences = preferredVoices[lang.toLowerCase()];
  if (preferences) {
    for (const preferredName of preferences) {
      const found = voices.find((v) => v.name === preferredName);
      if (found) return found;
    }
  }

  // Fallback: Match by language code
  return voices.find((voice) =>
    voice.lang.toLowerCase().startsWith(lang.toLowerCase())
  ) || null;
}

export function speakNumber(
  number: number,
  language: string,
  speed: number = 0.8
) {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    const synth = window.speechSynthesis;

    // Cancel any ongoing speech before starting a new one
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(number.toString());

    // Pick a specific voice
    const voice = getPreferredVoice(language);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang; // use actual voice language
    } else {
      utterance.lang = `${language.toLowerCase()}-${language}`; // fallback
    }

    utterance.rate = speed;

    synth.speak(utterance);
  } else {
    console.warn("Speech synthesis not supported in this environment.");
  }
}
