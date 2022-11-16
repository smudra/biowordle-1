import { Link as RouterLink } from "react-router-dom";
import { Box, Icon, Link } from "@chakra-ui/react";
import { MdKeyboardBackspace } from "react-icons/md";

export const BackButton = ({ color = "gray.100" }: { color?: string }) => (
  <Box
    alignItems="center"
    display="flex"
    justifyContent="center"
    w="100%"
    marginBottom="88px"
  >
    <Icon as={MdKeyboardBackspace} boxSize="18px" color={color} />
    <Link as={RouterLink} color={color} fontWeight="bold" to="/">
      Game
    </Link>
  </Box>
);
