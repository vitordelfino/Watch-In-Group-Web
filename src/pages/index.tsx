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
  useBreakpointValue,
  Heading,
  Spacer,
  HStack,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { EnterGroupId } from '../components/EnterGroupId';
import api from '../services/api';
import * as animationData from './lf30_editor_ouvnl3vy.json';
import Lottie from 'react-lottie';
import Head from 'next/head';

const Home: NextPage = () => {
  const [groupId, setGroupId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const lottieSize = useBreakpointValue({
    base: 500,
    sm: 200,
    md: 300,
    lg: 500,
  });
  const leftGridSpan = useBreakpointValue({ md: 0, lg: 2 });
  const rightGridSpan = useBreakpointValue({ md: 5, lg: 3 });
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
    <div>
      <Head>
        <title>watchvideoin.group</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        <meta name="twitter:card" content="summary" key="twcard" />
        <meta name="twitter:creator" content="vitordelfino" key="twhandle" />
        <meta
          name="twitter:image"
          content="https://i.imgur.com/nGWeBz7.png"
          key="twimage"
        />

        <meta property="og:url" content="www.watchvideosin.group" key="ogurl" />
        <meta
          property="og:image"
          content="https://i.imgur.com/nGWeBz7.png"
          key="ogimage"
        />
        <meta
          property="og:site_name"
          content="watchvideosin.group"
          key="ogsitename"
        />
        <meta
          property="og:title"
          content="Watch Video in Group"
          key="ogtitle"
        />
        <meta
          property="og:description"
          content="Watch videos from youtube in group"
          key="ogdesc"
        />
      </Head>
      <Center height="100vh" flexDirection="column">
        <VStack spacing="8">
          <Heading>Watch Videos In Group</Heading>
          <EnterGroupId onJoin={handleJoin} />
          <Button width="100%" onClick={handleGenerate}>Generate a group</Button>
        </VStack>
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
              <Button
                variant="outline"
                onClick={handleAction}
                isLoading={loading}
              >
                Next
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Center>
    </div>
  );
};

export default Home;
