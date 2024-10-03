import { useState, useEffect } from "react";
import {
  IconRepeat,
  IconPlayerPlayFilled,
  IconClock,
} from "@tabler/icons-react";
import { Switch } from "./components/Switch";
import {
  Heading,
  Text,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Select,
} from "spartak-ui";
import "./App.css";
import { getNextUniqueRandomNumber, generateOptions } from "./utils/functions";

const DEFAULT_LANG = "en";
enum LANGUAGES {
  de = "🇩🇪 German",
  es = "🇪🇸 Spanish",
  en = "🇬🇧 English",
  fr = "🇫🇷 French",
  it = "🇮🇹 Italian",
  ru = "🇷🇺 Russian",
}

function App() {
  const [currLang, setCurrLang] =
    useState<keyof typeof LANGUAGES>(DEFAULT_LANG);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(0);
  const [number, setNumber] = useState(getNextUniqueRandomNumber());
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // is app component loaded

  // load default settings
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Load last used language from the local storage or default to DEFAULT_LANG
      const lastOrDefaultLang =
        (localStorage.getItem(`last-used-lang`) as keyof typeof LANGUAGES) ||
        DEFAULT_LANG;
      setCurrLang(lastOrDefaultLang);

      // Load last score for the last used lang from local storage or default to 0
      setScore(
        parseInt(localStorage.getItem(`score-${lastOrDefaultLang}`) || "0", 10)
      );
      // Load last record for the last used lang from local storage or default to 0
      setRecord(
        parseInt(localStorage.getItem(`record-${lastOrDefaultLang}`) || "0", 10)
      );
    }
    setIsLoaded(true); // the component is loaded and has access to localStorage
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`score-${currLang}`, score.toString());
    }
  }, [score]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(`record-${currLang}`, record.toString());
    }
  }, [record]);

  useEffect(() => {
    if (isLoaded) {
      const langScore = parseInt(
        localStorage.getItem(`score-${currLang}`) || "0",
        10
      );
      setScore(langScore);
      const langRecord = parseInt(
        localStorage.getItem(`record-${currLang}`) || "0",
        10
      );
      setRecord(langRecord);

      // update last used language when user changes the language
      localStorage.setItem(`last-used-lang`, currLang);

      // when user changes the language regenerate number against cheating
      setNumber((prev) => getNextUniqueRandomNumber(prev));
    }
  }, [currLang]);

  const speakNumber = (number: number, speed: number = 1) => {
    // Check if window and speechSynthesis are available
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const synth = window.speechSynthesis;

      // Create a new utterance instance
      const utterance = new SpeechSynthesisUtterance(number.toString());

      // Set language and playback speed
      utterance.lang = `${currLang.toLowerCase()}-${currLang}`;
      utterance.rate = speed; // Speed (1 is default)

      // Speak the number
      synth.speak(utterance);
    } else {
      console.warn("Speech synthesis not supported in this environment.");
    }
  };

  useEffect(() => {
    if (isStarted) {
      speakNumber(number);
    }
  }, [number]);

  const selectOptions = Object.entries(LANGUAGES).map(
    ([langCode, langName]) => {
      return { value: langCode, label: langName, key: langCode };
    }
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrLang(e.target.value as keyof typeof LANGUAGES);
  };

  const optionsButtons = generateOptions(number).map((num) => {
    return (
      <div
        key={num.toString()}
        style={{
          flex: "1 1 45%",
          maxWidth: "45%",
        }}
      >
        <Button
          size="lg"
          color="blue"
          css={{ width: "100%", margin: "3px" }}
          onClick={() => handleButtonClick(num)}
        >
          {num}
        </Button>
      </div>
    );
  });

  const handleButtonClick = (guessedNumber: number) => {
    setScore((prevScore) => {
      if (guessedNumber === number) {
        const newScore = prevScore + 1;
        if (record < newScore) setRecord(newScore);
        return newScore;
      } else {
        return 0;
      }
    });
    setNumber((prev) => getNextUniqueRandomNumber(prev));
  };

  return (
    <>
      <Card css={{ height: "100%", textAlign: "center" }}>
        <CardHeader>
          <Switch />
          <Heading as="h1" size="xl">
            Numstr{" "}
            <Text size="lg" secondary>
              Listen and learn numbers
            </Text>
          </Heading>
          <br />
          <Card
            css={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="lg">I'm studying</Text>
            <Select
              css={{ minWidth: "140px" }}
              size="md"
              name="languages"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                handleSelectChange(e);
              }}
              value={currLang}
              options={selectOptions}
            />
          </Card>
          <br />
          <Text size="lg">
            Points{" "}
            <Badge size="lg" color="blue">
              {score}
            </Badge>{" "}
            Record{" "}
            <Badge size="lg" color="red">
              {record}
            </Badge>
          </Text>
        </CardHeader>
        <CardBody
          css={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isStarted ? (
            <>
              <Button
                css={{ marginRight: "5px" }}
                onClick={() => speakNumber(number)}
                variant="text"
                color="blue"
                size="lg"
                icon={<IconRepeat size={24} />}
              >
                Repeat
              </Button>
              <Button
                onClick={() => speakNumber(number, 0.6)}
                variant="text"
                color="blue"
                size="lg"
                icon={<IconClock size={24} />}
              >
                Slow
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                setIsStarted(true);
                speakNumber(number);
              }}
              color="blue"
              size="lg"
              icon={<IconPlayerPlayFilled size={24} />}
            >
              {score === 0 ? "Start" : "Continue"}
            </Button>
          )}
        </CardBody>
        <CardFooter
          css={{
            display: "flex",
            flexWrap: "wrap",
            rowGap: "5px",
            columnGap: "10px",
            justifyContent: "center",
          }}
        >
          {isStarted && optionsButtons}
        </CardFooter>
      </Card>
    </>
  );
}

export default App;
