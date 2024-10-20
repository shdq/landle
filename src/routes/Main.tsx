import { useState, useEffect } from "react";
import {
  IconRepeat,
  IconPlayerPlayFilled,
  IconClock,
} from "@tabler/icons-react";
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
import {
  getNextUniqueRandomNumber,
  generateOptions,
  speakNumber,
} from "../utils/functions";

import { useLang } from "./Root";

function Main() {
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState(0);
  const [number, setNumber] = useState(getNextUniqueRandomNumber());
  const [isStarted, setIsStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // is app component loaded

  const currLang = useLang();

  // load default settings
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Load last score for the last used lang from local storage or default to 0
      setScore(parseInt(localStorage.getItem(`score-${currLang}`) || "0", 10));
      // Load last record for the last used lang from local storage or default to 0
      setRecord(
        parseInt(localStorage.getItem(`record-${currLang}`) || "0", 10)
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

  useEffect(() => {
    if (isStarted) {
      speakNumber(number, currLang);
    }
  }, [number]);

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
          css={{ width: "100%" }}
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
    <Card
      css={{
        height: "100%",
        textAlign: "center",
        paddingTop: "97px",
        paddingBottom: "97px",
      }}
    >
      <CardHeader>
        <Heading as="h1" size="xxl">
          Landle{" "}
          <Text size="lg" secondary>
            Listen and learn
          </Text>
        </Heading>
        <br />
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
              onClick={() => speakNumber(number, currLang)}
              variant="text"
              color="blue"
              size="lg"
              icon={<IconRepeat size={24} />}
            >
              Repeat
            </Button>
            <Button
              onClick={() => speakNumber(number, currLang, 0.1)}
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
              speakNumber(number, currLang);
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
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {isStarted && optionsButtons}
      </CardFooter>
    </Card>
  );
}

export default Main;
