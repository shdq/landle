import { Heading, Card, CardHeader, CardBody, Badge, Button } from "spartak-ui";
import { useState, useEffect } from "react";
import { IconRepeat } from "@tabler/icons-react";
import Logo from "../components/Logo";
import { speakNumber } from "../utils/functions";
import { useLang } from "./Root";

function Learn() {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [numbers, setNumbers] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [record, setRecord] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false); // is app component loaded
  const currLang = useLang();

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      // Load last record for the current language
      setRecord(parseInt(localStorage.getItem(`memory-record-${currLang}`) || "0", 10));
    }
    setIsLoaded(true);
  }, [currLang]);

  const resetGame = () => {
    const nums = new Set<number>();
    while (nums.size < 8) {
      nums.add(Math.floor(Math.random() * 99) + 1);
    }
    const pairs = [...Array.from(nums), ...Array.from(nums)];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setNumbers(shuffled);
    setFlippedCards([]);
    setMatchedPairs([]);
    setGameStarted(false);
    setTimer(0);
  };

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (gameStarted && matchedPairs.length < 16) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, matchedPairs.length]);

  // Save record when it changes
  useEffect(() => {
    if (isLoaded) {
      // Save record only for current language
      localStorage.setItem(`memory-record-${currLang}`, record.toString());
    }
  }, [record, isLoaded, currLang]);

  // Handle language change and initial mount
  useEffect(() => {
    if (isLoaded) {
      resetGame();
    }
  }, [currLang, isLoaded]);

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
        <Heading as="h2" size="xl">
          Learn
        </Heading>
        <br />
        <br />
        <div style={{ fontSize: "1.125rem" }}>
          Time{" "}
          <Badge size="lg" color="blue">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </Badge>{" "}
          Record{" "}
          <Badge size="lg" color="red">
            {Math.floor(record / 60)}:{(record % 60).toString().padStart(2, '0')}
          </Badge>
          {matchedPairs.length === 16 && (
            <>
              {" "}
              <Badge size="lg" color="green">
                Complete
              </Badge>
            </>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <div
          style={{
            position: "relative",
            maxWidth: "600px",
            margin: "0 auto",
            padding: "1rem",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1rem",
              filter: matchedPairs.length === 16 ? "blur(4px)" : "none",
              transition: "filter 0.3s ease-in-out",
            }}
          >
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              style={{
                perspective: "1000px",
                aspectRatio: "1",
              }}
              onClick={() => {
                // Don't allow flipping if card is already matched
                if (matchedPairs.includes(index)) return;
                
                // Don't allow flipping more than 2 cards
                if (flippedCards.length >= 2) return;
                
                // Don't allow flipping the same card
                if (flippedCards.includes(index)) return;
                
                const newFlipped = [...flippedCards, index];
                setFlippedCards(newFlipped);
                
                // Start timer on first card flip
                if (!gameStarted) {
                  setGameStarted(true);
                }
                
                // Pronounce the number when card is flipped
                speakNumber(numbers[index], currLang);
                
                // Check for match when 2 cards are flipped
                if (newFlipped.length === 2) {
                  const [first, second] = newFlipped;
                  const isMatch = numbers[first] === numbers[second];
                  
                  if (isMatch) {
                    // Calculate new matched pairs immediately
                    const newMatchedPairs = [...matchedPairs, first, second];
                    
                    // If this is the winning match, stop timer and update record immediately
                    if (newMatchedPairs.length === 16) {
                      setGameStarted(false);
                      if (record === 0 || timer < record) {
                        setRecord(timer);
                      }
                    }
                  }

                  // Wait for animation to complete before updating visual state
                  setTimeout(() => {
                    if (isMatch) {
                      // Update matched pairs for visual feedback
                      setMatchedPairs(prev => [...prev, first, second]);
                    }
                    setFlippedCards([]);
                  }, 1000);
                }
              }}
            >
              <Card
                variant="elevated"
                css={{
                  cursor: matchedPairs.includes(index) ? "default" : "pointer",
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  transition: "transform 0.6s, background-color 0.3s ease-in-out, opacity 0.3s ease-in-out",
                  transformStyle: "preserve-3d",
                  transform: flippedCards.includes(index) || matchedPairs.includes(index)
                    ? "rotateY(180deg)"
                    : "rotateY(0)",
                  backgroundColor: matchedPairs.includes(index)
                    ? "var(--colors-green600)"
                    : flippedCards.includes(index)
                    ? "transparent"
                    : "var(--colors-blue600)",
                  color: "var(--colors-foreground)",
                }}
              >
                <CardBody
                  css={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    margin: 0,
                    transform: "rotateY(0deg)",
                    padding: "15%",
                  }}
                >
                  <Logo color="white" disableLink={true} />
                </CardBody>
                <CardBody
                  css={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    margin: 0,
                    backgroundColor: matchedPairs.includes(index)
                      ? "var(--colors-green600)"
                      : "var(--colors-background)",
                    color: matchedPairs.includes(index)
                      ? "var(--colors-white)"
                      : "var(--colors-foreground)",
                    fontWeight: matchedPairs.includes(index) ? "bold" : "normal",
                  }}
                >
                  {numbers[index]}
                </CardBody>
              </Card>
            </div>
          ))}
          </div>
          {matchedPairs.length === 16 && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
            >
              <Button
                onClick={resetGame}
                color="red"
                size="lg"
                icon={<IconRepeat size={24} />}
              >
                Restart
              </Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default Learn;
