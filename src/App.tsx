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
} from "spartak-ui";
import "./App.css";
import { getNextUniqueRandomNumber, generateOptions } from "./utils/functions";

function App() {
  const [score, setScore] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Load record from local storage or default to 0
      return parseInt(localStorage.getItem("score-es") || "0", 10);
    } else {
      return 0;
    }
  });
  const [record, setRecord] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Load record from local storage or default to 0
      return parseInt(localStorage.getItem("record-es") || "0", 10);
    } else {
      return 0;
    }
  });
  const [number, setNumber] = useState(getNextUniqueRandomNumber());
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("score-es", score.toString());
    }
  }, [score]);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("record-es", record.toString());
    }
  }, [record]);

  const speakNumber = (number: number, speed: number = 1) => {
    // Check if window and speechSynthesis are available
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const synth = window.speechSynthesis;

      // Create a new utterance instance
      const utterance = new SpeechSynthesisUtterance(number.toString());

      // Set language and playback speed
      utterance.lang = "es-ES"; // Spanish language
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

  const optionsButtons = generateOptions(number).map((num) => {
    return (
      <Button
        key={num.toString()}
        size="lg"
        color="blue"
        css={{ width: "100%", margin: "3px" }}
        onClick={() => handleButtonClick(num)}
      >
        {num}
      </Button>
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
              What's your longest streak?
            </Text>
          </Heading>
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
        <CardFooter css={{}}>{isStarted && optionsButtons}</CardFooter>
      </Card>
    </>
  );
}

export default App;
