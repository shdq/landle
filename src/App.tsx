import { useState, useEffect, useRef } from "react";
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

const getRandomNumber = () => Math.floor(Math.random() * 99) + 1;

function App() {
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Load record from local storage or default to 0
      return parseInt(localStorage.getItem("record-es") || "0", 10);
    } else {
      return 0;
    }
  });
  const [number, setNumber] = useState(getRandomNumber());
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("record-es", record.toString());
    }
  }, [record]);

  const audioRef = useRef<HTMLAudioElement>(new Audio());

  const playAudio = (speed: number = 1) => {
    if (audioRef.current) {
      // Check if the audio is paused or has ended before playing
      if (audioRef.current.paused || audioRef.current.ended) {
        // Update the playback speed
        audioRef.current.playbackRate = speed;

        // Play the audio
        audioRef.current.play();
      }
    }
  };

  useEffect(() => {
    audioRef.current.src = `/audio/${number}_es.mp3`;
    playAudio();
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
    setNumber(getRandomNumber());
  };

  function generateOptions(originalNumber: number): number[] {
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
          {isStarted && (
            <>
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
            </>
          )}
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
                onClick={() => playAudio()}
                variant="text"
                color="blue"
                size="lg"
                icon={<IconRepeat size={24} />}
              >
                Repeat
              </Button>
              <Button
                onClick={() => playAudio(0.6)}
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
                playAudio();
              }}
              color="blue"
              size="lg"
              icon={<IconPlayerPlayFilled size={24} />}
            >
              Start
            </Button>
          )}
          <audio ref={audioRef} />
        </CardBody>
        <CardFooter css={{}}>{isStarted && optionsButtons}</CardFooter>
      </Card>
    </>
  );
}

export default App;
