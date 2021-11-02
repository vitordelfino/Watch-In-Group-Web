/* eslint-disable react-hooks/exhaustive-deps */
import {
  Flex,
  Button,
  Center,
  Input,
  Text,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { EnterGroupId } from '../components/EnterGroupId';
import api from '../services/api';
import * as animationData from './lf30_editor_ouvnl3vy.json';
import Lottie from 'react-lottie';

const Home: NextPage = () => {
  const [groupId, setGroupId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const generateAction = (username: string) => {
    console.log('generateAction');
    async function generateRoom() {
      try {
        setLoading(true);
        const response = await api.post('/rooms', { owner: username });
        const roomId = response.data.id;
        sessionStorage.setItem('roomId', roomId);
        sessionStorage.setItem('username', username);
        setLoading(false);
        router.push(`/group/${roomId}`);
      } catch (error) {
        setLoading(false);
        console.error('error', error);
      }
    }
    generateRoom();
  };

  const joinAction = (group: string, user: string) => {
    sessionStorage.setItem('roomId', group);
    sessionStorage.setItem('username', user);
    router.push(`/group/${group}`);

  };

  const [action, setAction] = useState<'join' | 'generate'>('join');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleGenerate = useCallback(() => {
    setAction('generate');
    onOpen();
  }, [onOpen, generateAction]);

  const handleJoin = useCallback(
    (group: string) => {
      setGroupId(group);
      setAction('join');
      onOpen();
    },
    [onOpen, joinAction]
  );

  const handleAction = useCallback(() => {
    if (action === 'generate') {
      generateAction(username);
    } else {
      joinAction(groupId, username);
    }
  }, [groupId, username, action]);

  // return (
    // <Center w="100%" h="100%" flexDirection="column">
    //   <VStack spacing="16">
    //     <Text fontSize="5xl">Watch Videos In Group</Text>
    //     <EnterGroupId onJoin={handleJoin} />

    //   </VStack>
    // </Center>
  // );

  return (
    <Grid templateColumns="repeat(5, 1fr)" h="100vh" w="100vw" gap={6}>
      <GridItem bg="blue.900" colSpan={2}>
        <Center flexDirection="column" height="80%">
          {/* <Img src="/estoque.gif" w="md" mb="7" /> */}
          <Lottie
            isClickToPauseDisabled={true}
            options={{
              loop: true,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            height={500}
            width={500}
          />
          <Text
            filter="drop-shadow(0.2rem 0.2rem 0.5rem #ebf8ff)"
            fontSize="4xl"
            color="blue.100"
            mt="10"
            fontWeight="medium"
          >
            Watch Videos In Group
          </Text>
        </Center>
      </GridItem>
      <GridItem colSpan={3}>
        <Center flexDirection="column" height="100%">
          {/* <Heading top="-20" position="relative" color="purple.900">
            Gerenciador de Estoque
          </Heading> */}

            <EnterGroupId onJoin={handleJoin} />
            <Text fontSize="2xl">or</Text>
            <Flex w="xl">
              <Button w="100%" onClick={handleGenerate}>Generate a group</Button>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Insert your username</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Input
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </ModalBody>

                <ModalFooter>
                  <Button mr={3} onClick={onClose}>
                    Close
                  </Button>
                  <Button variant="outline" onClick={handleAction} isLoading={loading}>
                    Next
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
        </Center>
      </GridItem>
    </Grid>
  );
};

export default Home;
