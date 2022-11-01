import { useState } from "react";
import { Flex, Icon, Heading } from "@chakra-ui/react";
import { MdHelpOutline, MdBarChart } from "react-icons/md";
import { format } from "date-fns";
import { useLoaderData } from "react-router-dom";

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

  const { words } = useLoaderData() as LoaderData;
  const { logIncorrectWord } = useIncorrectWords();

  const currentWord = words.find(
    ({ date }) => date === format(new Date(), FORMAT_STRING)
  );

  const handleDelete = () => {
    if (!guessedWord) {
      return;
    }

    setGuessedWord((prevWord) => prevWord.slice(0, -1));
    setGuessedLetters((prevArr) => prevArr.slice(0, -1));
  };

  const clearBoard = () => {
    setGuessedWord("");
    setGuessedLetters([]);
    setTileColors([]);
  };

  function getIndicesOfLetter(letter: string, arr: string[]) {
    const indices = [];
    let idx = arr.indexOf(letter);
    while (idx != -1) {
      indices.push(idx);
      idx = arr.indexOf(letter, idx + 1);
    }
    return indices;
  }

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
      guessedWord.split("").filter((l) => l === letter).length > 1;

    // is guessed more than once and exists more than once
    if (existsMoreThanOnce) {
      return TileColors.yellow;
    }

    const hasBeenGuessedAlready = guessedWord.split("").indexOf(letter) < index;

    const indices = getIndicesOfLetter(letter, guessedWord.split(""));
    const otherIndices = indices.filter((i) => i !== index);
    const isGuessedCorrectlyLater = otherIndices.some(
      (i) => i > index && guessedWord.split("")[i] === letter
    );

    if (!hasBeenGuessedAlready && !isGuessedCorrectlyLater) {
      return TileColors.green;
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
    guessedWord.split("").forEach((letter, index) => {
      setTimeout(() => {
        const color = getTileColor(letter, index);
        setTileColors((prevColors) => [...prevColors, color]);
      }, index * interval);
    });

    console.log({ guessedWord, currentWord });
    if (guessedWord.toUpperCase() === currentWord?.value?.toUpperCase()) {
      setTimeout(() => {
        const okSelected = window.confirm("Well done!");
        if (okSelected) {
          clearBoard();
          // showResult();
        }
        return;
      }, 1200);
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
          onDelete={handleDelete}
        />
      </Flex>
    </Flex>
  );
};
