import { CloseIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

export const Header = () => {
  const router = useRouter();

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      w="100%"
      h="20"
      p="5"
      bgColor="blue.800"
      borderBottomRadius="xl"
      boxShadow="0px 10px 10px -4px"
    >
      <Text color="#FFF">
        <b>Group: </b>
        {router.query.groupId}
      </Text>
      <IconButton
        variant="solid"
        isRound
        aria-label="Close"
        icon={<CloseIcon />}
      />
    </Flex>
  );
};
