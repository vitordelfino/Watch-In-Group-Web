import { CloseIcon, CopyIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export const Header = () => {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }, [copied]);
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
        <CopyToClipboard
          text={router.query.groupId as string}
          onCopy={() => setCopied(true)}
        >
          <CopyIcon
            ml="2"
            color={copied ? 'green' : 'white'}
            cursor="pointer"
          />
        </CopyToClipboard>
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
