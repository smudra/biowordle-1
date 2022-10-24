import { useState } from "react";
import { Box, Flex, Icon, Heading } from "@chakra-ui/react";
import { MdHelpOutline, MdBarChart } from "react-icons/md";

import { GameBoard } from "./GameBoard";
import { Keyboard } from "./Keyboard";
import { useGetWords } from "./useGetWords";

export enum TileColors {
  green = "rgb(83, 141, 78)",
  yellow = "rgb(181, 159, 59)",
  dark = "rgb(58, 58, 60)",
}

export const Game = () => {
  const [guessedWord, setGuessedWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [tileColors, setTileColors] = useState<TileColors[]>([]);

  const { currentWord, newWords, usedWords } = useGetWords();

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
    const isCorrectLetter = currentWord
      .toUpperCase()
      .includes(letter.toUpperCase());

    if (!isCorrectLetter) {
      return TileColors.dark;
    }

    const letterInThatPosition = currentWord.charAt(index).toUpperCase();
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
    const isUsedWord = usedWords?.some(
      (w) => w.toUpperCase() === word.toUpperCase()
    );

    const isNewWord = newWords?.some(
      (w) => w.toUpperCase() === word.toUpperCase()
    );

    return isUsedWord || isNewWord;
  };

  const checkIsWordFromDictionary = async (word: string) => {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${guessedWord.toLowerCase()}`
    );

    if (!res.ok) {
      throw Error();
    }
  };

  const handleSubmit = async () => {
    if (guessedWord.length !== currentWord.length) {
      return;
    }

    const isWordFromLibrary = checkIsWordFromLibrary(guessedWord);
    if (!isWordFromLibrary) {
      checkIsWordFromDictionary(guessedWord);
    }

    const interval = 200;
    guessedWord.split("").forEach((letter, index) => {
      setTimeout(() => {
        const color = getTileColor(letter, index);
        setTileColors((prevColors) => [...prevColors, color]);
      }, index * interval);
    });

    console.log({ guessedWord, currentWord });
    if (guessedWord.toUpperCase() === currentWord.toUpperCase()) {
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
    if (!guessedWord || guessedWord.length < 5) {
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
