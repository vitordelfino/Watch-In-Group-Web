import { Button, Center, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import api from '../../services/api';
import { Room } from '../../types';
import socket, { io, Socket } from 'socket.io-client';
import ReactPlayer from 'react-player'
type GroupPageProps = {
  room: Room;
  groupId: string;
};

const Group: NextPage<GroupPageProps> = ({room}) => {
  const router = useRouter();
  const [socketIo, setIo] = React.useState<Socket>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [users, setUsers] = React.useState(Object.keys(room.users).map(userId => room.users[userId].name));
  const [videos, setVideos] = React.useState(Object.keys(room.videos));
  const [videoUrl, setVideoUrl] = React.useState('');
  const [playing, setPlaying] = React.useState(false);
  const getRoomInfo = useCallback(() => {
    console.log('getRoomInfo')
    async function fetch() {
      try {
        const { data } = await api.get<Room>(`/rooms/${room.id}`);
        const { users: usersRequested, videos: videosRequested } = data;
        const usersMapped = Object.keys(usersRequested).map(userId => usersRequested[userId].name);
        console.log('usersMapped', usersMapped)
        setUsers(usersMapped)
        setVideos(Object.keys(videosRequested))
      } catch(e) {
        console.log(e);
      }
    }

    fetch();
  }, [room])

  const handleAddVideo = useCallback(() => {
    console.log('handleAddVideo');
    if(socketIo) {
      socketIo.emit('add-video', { room: room.id, video: videoUrl });
      onClose();
    }else {
      console.log('socketIo é nulo')
    }
  }, [socketIo, room.id, videoUrl, onClose])

  const handlePlayVideo = useCallback(() => {
    console.log('handlePlayVideo');
    if(socketIo) {
    socketIo.emit('play-video', {room: room.id, video: ''});
    }
  }, [socketIo, room])

  const handlePauseVideo = useCallback(() => {
    console.log('handlePlayVideo');
    if(socketIo) {
    socketIo.emit('pause-video', {room: room.id, video: ''});
    }
  }, [socketIo, room])

  useEffect(() => {
    console.log('useEffect')
    const  io = socket('http://localhost:5000');
    setIo(io)
    io.on('connect', () => {
      const user = sessionStorage.getItem('username');
      console.log('connected', user);
      io.emit('enter-on-room', { room: room.id, user });
    })

    io.on('user-entered-room', () => {
      console.log('user-entered-room')
      getRoomInfo();
    });

    io.on('user-left-room', () => {
      console.log('user-left-room')
      getRoomInfo();
    });

    io.on('video-added', () => {
      console.log('video-added')
      getRoomInfo();

    })

    io.on('play', () => {
      console.log('play')
      setPlaying(true);
    })

    io.on('pause', () => {
      console.log('pause')
      setPlaying(false);
    })



    io.on('exception', exception => {
      io.emit('left-room', room.id);
      router.push('/')
    })

    return () => {
      console.log('left room and disconnect')
      io.emit('left-room', room.id);
      io.disconnect();
    }
  }, [getRoomInfo, room, router])

  return (
    <Center w="100%" h="100%" flexDirection="column">
      <Text fontSize="5xl">Group: {router.query.groupId}</Text>
      <Text fontSize="5xl">Owner: {room.owner.name}</Text>
      <Button onClick={onOpen}>Add Video</Button>
      {users.map(user => (
        <Text fontSize="2xl" key={user}>Usuário: {user}</Text>

      ))}
      {videos[0] && (
          <ReactPlayer
            key={videos[0]}
            url={videos[0]}
            playing={playing}
            onPlay={handlePlayVideo}
            onPause={handlePauseVideo}
            />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add video to watch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="video url"
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant="outline" onClick={handleAddVideo}>
                Next
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </Center>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ groupId: string }>
): Promise<GetServerSidePropsResult<{ groupId: string, room: Room }>> => {
  const { groupId } = ctx.params!;
  try {
    const response = await api.get<Room>(`/rooms/${groupId}`)
    return {
      props: {
        groupId,
        room: response.data
      },
    };

  } catch(e) {

    return {
      notFound: true,
      props: {
        groupId,
        room: {} as Room,
      },
    };
  }
};

export default Group;
