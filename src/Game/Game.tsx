import { useState, useCallback, useEffect } from "react";
import {
  Flex,
  Icon,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useBoolean,
  Text,
} from "@chakra-ui/react";
import { MdHelpOutline, MdBarChart } from "react-icons/md";
import { format } from "date-fns";
import { useLoaderData } from "react-router-dom";
import invariant from "tiny-invariant";

import { GameBoard } from "./GameBoard";
import { Keyboard } from "./Keyboard";
import { useIncorrectWords } from "./useIncorrectWords";

export enum TileColors {
  green = "rgb(83, 141, 78)",
  yellow = "rgb(181, 159, 59)",
  dark = "rgb(58, 58, 60)",
}

type LoaderData = {
  words: { value: string; date: string }[];
};

const FORMAT_STRING = "y-L-d";

export const Game = () => {
  const [guessedWord, setGuessedWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [tileColors, setTileColors] = useState<TileColors[]>([]);
  const [score, setScore] = useState<number | null>(null);

  const [isShowingResult, setShowingResult] = useBoolean();
  const [isShowingLosingModal, setShowLosingModal] = useBoolean();

  const { words } = useLoaderData() as LoaderData;
  const { logIncorrectWord } = useIncorrectWords();

  const currentWord = words.find(
    ({ date }) => date === format(new Date(), FORMAT_STRING)
  );

  invariant(
    currentWord,
    "There is no word set for today. Please contact game admin!"
  );

  const loadGameState = useCallback(() => {
    const gameStateString = window.localStorage.getItem("gameState");
    if (!gameStateString) {
      return;
    }

    const gameState = JSON.parse(gameStateString);
    if (gameState?.currentWordValue !== currentWord.value) {
      window.localStorage.removeItem("gameState");
      return;
    }

    setGuessedLetters(gameState.guessedLetters);
    setTileColors(gameState.tileColors);
  }, [currentWord]);

  const storeGameState = useCallback(
    (tileColors: TileColors[]) => {
      if (!guessedLetters.length) {
        return;
      }

      const storedGameState = window.localStorage.getItem("gameState");
      const gameState = {
        currentWordValue: currentWord.value,
        guessedLetters,
        tileColors,
      };

      const gameStateString = JSON.stringify(gameState);
      if (gameStateString === storedGameState) {
        return;
      }

      window.localStorage.setItem("gameState", JSON.stringify(gameState));
    },
    [currentWord, guessedLetters]
  );

  useEffect(() => {
    loadGameState();
  }, [loadGameState]);

  const handleDelete = useCallback(() => {
    setGuessedWord((prevWord) => prevWord.slice(0, -1));
    setGuessedLetters((prevArr) => prevArr.slice(0, -1));
  }, []);

  // const clearBoard = () => {
  //   setGuessedWord("");
  //   setGuessedLetters([]);
  //   setTileColors([]);
  // };

  const calculateScore = () => {
    const numberOfCharacters = currentWord.value.length;
    const numberOfGuesses = guessedLetters.length / numberOfCharacters;
    const triesRemaining = 6 - numberOfGuesses;

    setScore(numberOfCharacters * (triesRemaining + 1));
  };

  const showResult = () => {
    calculateScore();
    setShowingResult.on();
  };

  const getIndicesOfLetter = (letter: string, arr: string[]) => {
    const indices = [];
    let idx = arr.indexOf(letter);
    while (idx != -1) {
      indices.push(idx);
      idx = arr.indexOf(letter, idx + 1);
    }
    return indices;
  };

  const getTileColor = (letter: string, index: number) => {
    const isCorrectLetter = currentWord?.value
      ?.toUpperCase()
      .includes(letter.toUpperCase());

    if (!isCorrectLetter) {
      return TileColors.dark;
    }

    const letterInThatPosition = currentWord?.value.charAt(index).toUpperCase();
    const isCorrectPosition = letter.toUpperCase() === letterInThatPosition;

    if (isCorrectPosition) {
      return TileColors.green;
    }

    const isGuessedMoreThanOnce =
      guessedWord.split("").filter((l) => l === letter).length > 1;

    if (!isGuessedMoreThanOnce) {
      return TileColors.yellow;
    }

    const existsMoreThanOnce =
      currentWord.value.split("").filter((l) => l === letter).length > 1;

    const hasBeenGuessedAlready = guessedWord.split("").indexOf(letter) < index;

    const indices = getIndicesOfLetter(letter, currentWord.value.split(""));
    const otherIndices = indices.filter((i) => i !== index);
    const isGuessedCorrectlyLater = otherIndices.some(
      (i) => i > index && guessedWord.split("")[i] === letter
    );

    if (isGuessedCorrectlyLater && !existsMoreThanOnce) {
      return TileColors.dark;
    }

    if (hasBeenGuessedAlready && !existsMoreThanOnce) {
      return TileColors.dark;
    }

    return TileColors.yellow;
  };

  const checkIsWordFromLibrary = (word: string) => {
    const isAlreadyUsed = words?.some(
      ({ value }) => value.toUpperCase() === word.toUpperCase()
    );

    return isAlreadyUsed;
  };

  const checkIsWordFromDictionary = async (word: string) => {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`
    );

    return res.ok;
  };

  const handleSubmit = async () => {
    if (guessedWord.length !== currentWord?.value.length) {
      return;
    }

    const isWordFromLibrary = checkIsWordFromLibrary(guessedWord);
    if (!isWordFromLibrary) {
      const isWordFromDisctionary = await checkIsWordFromDictionary(
        guessedWord
      );

      if (!isWordFromDisctionary) {
        logIncorrectWord(guessedWord, currentWord?.value);
        return;
      }
    }

    const interval = 200;
    const colors = guessedWord
      .split("")
      .map((letter, index) => getTileColor(letter, index));

    let i = 0;
    const timer = setInterval(() => {
      const tileColor = colors[i];
      if (!tileColor) {
        i = 0;
        clearInterval(timer);
        return;
      }

      setTileColors((prevColors) => [...prevColors, tileColor]);
      i++;
    }, interval);

    storeGameState([...tileColors, ...colors]);

    if (guessedWord.toUpperCase() === currentWord?.value?.toUpperCase()) {
      setTimeout(() => {
        showResult();
      }, interval * (currentWord.value.length + 1));
    } else if (guessedLetters.length === currentWord.value.length * 6) {
      setTimeout(() => {
        setShowLosingModal.on();
        setGuessedWord("");
      }, interval * (currentWord.value.length + 1));
    } else {
      setGuessedWord("");
    }
  };

  const handleLetterSelect = (letter: string) => {
    if (!currentWord?.value) {
      return;
    }

    if (!guessedWord || guessedWord.length < currentWord.value.length) {
      setGuessedWord((prevWord) => prevWord + letter);
      setGuessedLetters((currentLetters) => [...currentLetters, letter]);
    }
  };

  return (
    <>
      <Flex
        bgColor="rgb(18, 18, 19)"
        alignItems="center"
        flexDirection="column"
        height="100%"
        width="100%"
      >
        <Flex
          alignItems="center"
          maxWidth="500px"
          height="100%"
          flexDirection="column"
          width="100%"
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            borderBottom="1px solid rgb(58, 58, 60)"
            width="100%"
            padding="12px"
          >
            <Icon as={MdHelpOutline} color="#fff" boxSize="24px" />
            <Heading as="h1" color="#fff" margin="0">
              Bio Wordle
            </Heading>
            <Icon as={MdBarChart} color="#fff" boxSize="24px" />
          </Flex>
          <GameBoard
            wordLength={currentWord?.value?.length || 5}
            {...{ guessedLetters, tileColors }}
          />
          <Keyboard
            onLetterSelect={handleLetterSelect}
            onEnter={handleSubmit}
            onDelete={guessedWord ? handleDelete : undefined}
          />
        </Flex>
      </Flex>

      <Modal isOpen={isShowingResult} onClose={setShowingResult.off}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Congrats!</ModalHeader>
          <ModalCloseButton />
          <ModalBody marginBottom="36px">
            <Text marginBottom="24px">
              You successfully guessed {"today's"} word{" "}
              <Text as="span" fontWeight="bold">
                {currentWord.value}
              </Text>
              , earning yourself {score} points!
            </Text>
            <Text>Check back tomorrow to play the next word.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isShowingLosingModal} onClose={setShowLosingModal.off}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Too bad!</ModalHeader>
          <ModalCloseButton />
          <ModalBody marginBottom="36px">
            <Text marginBottom="24px">
              Great effort but unfortunately you did not guess the correct word
              today, which was{" "}
              <Text as="span" fontWeight="bold">
                {currentWord.value}
              </Text>
              .
            </Text>
            <Text>Check back tomorrow to play the next word.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
