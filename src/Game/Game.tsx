import { useState } from "react";
import { Box, Flex, Icon, Heading } from "@chakra-ui/react";
import { MdHelpOutline, MdBarChart } from "react-icons/md";

import { GameBoard } from "./GameBoard";
import { Keyboard } from "./Keyboard";

const WORD = "APPLE";

export enum TileColors {
  green = "rgb(83, 141, 78)",
  yellow = "rgb(181, 159, 59)",
  dark = "rgb(58, 58, 60)",
}

export const Game = () => {
  const [guessedWords, setGuessedWords] = useState([[]]);
  const [currentWord, setCurrentWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [tileColors, setTileColors] = useState<TileColors[]>([]);

  const handleDelete = () => {
    if (!currentWord) {
      return;
    }

    setCurrentWord((prevWord) => prevWord.slice(0, -1));
    setGuessedLetters((prevArr) => prevArr.slice(0, -1));
  };

  const clearBoard = () => {
    setCurrentWord("");
    setGuessedLetters([]);
    setTileColors([]);
  };

  function getIndicesOfLetter(letter, arr) {
    const indices = [];
    let idx = arr.indexOf(letter);
    while (idx != -1) {
      indices.push(idx);
      idx = arr.indexOf(letter, idx + 1);
    }
    return indices;
  }

  const getTileColor = (letter, index) => {
    const isCorrectLetter = WORD.toUpperCase().includes(letter.toUpperCase());

    if (!isCorrectLetter) {
      return TileColors.dark;
    }

    const letterInThatPosition = WORD.charAt(index).toUpperCase();
    const isCorrectPosition = letter.toUpperCase() === letterInThatPosition;

    if (isCorrectPosition) {
      return TileColors.green;
    }

    const isGuessedMoreThanOnce =
      currentWord.split("").filter((l) => l === letter).length > 1;

    if (!isGuessedMoreThanOnce) {
      return TileColors.yellow;
    }

    const existsMoreThanOnce =
      currentWord.split("").filter((l) => l === letter).length > 1;

    // is guessed more than once and exists more than once
    if (existsMoreThanOnce) {
      return TileColors.yellow;
    }

    const hasBeenGuessedAlready = currentWord.split("").indexOf(letter) < index;

    const indices = getIndicesOfLetter(letter, currentWord.split(""));
    const otherIndices = indices.filter((i) => i !== index);
    const isGuessedCorrectlyLater = otherIndices.some(
      (i) => i > index && currentWord.split("")[i] === letter
    );

    if (!hasBeenGuessedAlready && !isGuessedCorrectlyLater) {
      return TileColors.green;
    }

    return TileColors.yellow;
  };

  const handleSubmit = () => {
    if (currentWord.length !== WORD.length) {
      return;
    }

    // check if it's a word from the db
    // if not, check it's a word from the dictionary

    const interval = 200;
    currentWord.split("").forEach((letter, index) => {
      setTimeout(() => {
        const color = getTileColor(letter, index);
        setTileColors((prevColors) => [...prevColors, color]);
      }, index * interval);
    });

    console.log({ currentWord, WORD }, currentWord === WORD);
    if (currentWord.toUpperCase() === WORD.toUpperCase()) {
      setTimeout(() => {
        const okSelected = window.confirm("Well done!");
        if (okSelected) {
          clearBoard();
          showResult();
        }
        return;
      }, 1200);
    } else {
      setCurrentWord("");
    }
  };

  const handleLetterSelect = (letter: string) => {
    if (!currentWord || currentWord.length < 5) {
      setCurrentWord(currentWord + letter);
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
        <GameBoard {...{ guessedLetters, tileColors }} />
        <Keyboard
          onLetterSelect={handleLetterSelect}
          onEnter={handleSubmit}
          onDelete={handleDelete}
        />
      </Flex>
    </Flex>
  );
};
