import { Input } from '@chakra-ui/input';
import { Flex, Spacer } from '@chakra-ui/layout';
import { Button, FormControl, FormLabel, HStack } from '@chakra-ui/react';
import React, { useCallback } from 'react';

type EnterGroupIdProps = {
  onJoin: (groupId: string) => void;
};

export const EnterGroupId: React.FC<EnterGroupIdProps> = ({ onJoin }) => {
  const [groupId, setGroupId] = React.useState('');
  const handleJoin = useCallback(() => {
    onJoin(groupId);
  }, [groupId, onJoin]);

  return (
    <HStack alignItems="self-end" width="100%">
      <FormControl id="groupId">
        <FormLabel>Insert group id</FormLabel>
        <Input
          bg="whiteAlpha.200"
          borderColor="blue.700"
          _hover={{ borderColor: 'blue.900' }}
          placeholder="Enter Group ID"
          onChange={(e) => setGroupId(e.target.value)}
        />
      </FormControl>
      <Spacer />
      <Button onClick={handleJoin}>Join</Button>
    </HStack>
  );
};
