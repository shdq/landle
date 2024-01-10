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
      // Save record to local storage whenever it changes
      localStorage.setItem("record-es", record.toString());
    }
  }, [record]);

  const audioSource = `/audio/${number}_es.mp3`;
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Play when the number is changing
  useEffect(() => {
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
    // Function to generate a random offset for similar numbers
    function getRandomOffset(): number {
      // You can adjust the range of the offset based on your requirements
      return Math.floor(Math.random() * 10) + 1;
    }

    // Function to shuffle an array using Fisher-Yates algorithm
    function shuffleArray(array: any[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    const optionsSet: Set<number> = new Set();

    // Add the original number to the set
    optionsSet.add(originalNumber);

    // Generate similar numbers until the set has 4 unique numbers
    while (optionsSet.size < 4) {
      const similarNumber = originalNumber + getRandomOffset();
      // Ensure the similar number does not exceed 99
      const boundedSimilarNumber = Math.min(similarNumber, 99);
      optionsSet.add(boundedSimilarNumber);
    }

    // Convert the set to an array and shuffle it
    const options: number[] = Array.from(optionsSet);
    shuffleArray(options);

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
          <audio ref={audioRef} src={audioSource} preload="auto" />
        </CardBody>
        <CardFooter css={{}}>{isStarted && optionsButtons}</CardFooter>
      </Card>
    </>
  );
}

export default App;
