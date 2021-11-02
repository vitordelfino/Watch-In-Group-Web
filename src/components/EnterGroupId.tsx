import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Button, FormControl, FormLabel } from '@chakra-ui/react';
import React, { useCallback } from 'react';

type EnterGroupIdProps = {
  onJoin: (groupId: string) => void;
}

export const EnterGroupId: React.FC<EnterGroupIdProps> = ({ onJoin }) => {

  const [groupId, setGroupId] = React.useState('');
  const handleJoin = useCallback(() => {
    onJoin(groupId)
  }, [groupId, onJoin]);

  return (
    <Flex w="xl" justifyContent="space-around" alignItems="self-end">
      <FormControl id="groupId">
        <FormLabel>Insert group id</FormLabel>
        <Input
          w="md"
          bg="whiteAlpha.200"
          borderColor="blue.700"
          _hover={{ borderColor: "blue.900" }}
          placeholder="Enter Group ID"
          onChange={(e) => setGroupId(e.target.value)}
        />
      </FormControl>

      <Button onClick={handleJoin} mb="0.5">Join</Button>
    </Flex>
  );
};
