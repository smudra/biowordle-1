import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  UnorderedList,
  ListItem,
  Link,
  Stack,
} from "@chakra-ui/react";
import { Link as RoutedLink } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose(): void;
};

export const HowToPlay = ({ isOpen, onClose }: Props) => (
  <Modal {...{ isOpen, onClose }}>
    <ModalOverlay />
    <ModalContent bgColor="rgb(18, 18, 19)">
      <ModalHeader color="#fff">How to play</ModalHeader>
      <ModalCloseButton color="gray.300" />
      <ModalBody>
        <Stack spacing="12px">
          <Text color="#fff">Guess the science based word in 6 tries.</Text>
          <UnorderedList color="#fff">
            <ListItem>
              Each guess must be a word in the dictionary or our own list.
            </ListItem>
            <ListItem>
              The color of the tiles will change to show how close your guess
              was to the word.
            </ListItem>
          </UnorderedList>
          <Image src="examples.png" width="70%" />
          <Text color="#fff">A new puzzle is released daily at midnight.</Text>
          <Text color="#fff">
            If you haven{"'"}t already,{" "}
            <Link as={RoutedLink} to="profile">
              sign up
            </Link>{" "}
            to keep track of your scores and compete for a top 10 spot on the
            leaderboard.
          </Text>
        </Stack>
      </ModalBody>
    </ModalContent>
  </Modal>
);
