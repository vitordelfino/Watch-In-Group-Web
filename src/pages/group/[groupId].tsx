import {
    Box,
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  useBreakpointValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import api from '../../services/api';
import { Room, YoutubeVideo } from '../../types';
import socket, { io, Socket } from 'socket.io-client';
import ReactPlayer from 'react-player';
import { Header } from '../../components/Header';
import { AddIcon } from '@chakra-ui/icons';
import YouTube from 'react-youtube';

type GroupPageProps = {
  room: Room;
  groupId: string;
};

function YouTubeGetID(url: string){
  url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
}

const Group: NextPage<GroupPageProps> = ({ room }) => {
  const router = useRouter();
  const [socketIo, setIo] = React.useState<Socket>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [users, setUsers] = React.useState(
    Object.keys(room.users).map((userId) => room.users[userId].name)
  );
  const [videos, setVideos] = React.useState(Object.keys(room.videos));
  const [videoUrl, setVideoUrl] = React.useState('');
  const [playing, setPlaying] = React.useState(false);
  const [currentVideo, setCurrentVideo] = React.useState<YoutubeVideo | undefined>();
  const getRoomInfo = useCallback(() => {
    console.log('getRoomInfo');
    async function fetch() {
      try {
        const { data } = await api.get<Room>(`/rooms/${room.id}`);
        const { users: usersRequested, videos: videosRequested } = data;
        const usersMapped = Object.keys(usersRequested).map(
          (userId) => usersRequested[userId].name
        );
        console.log('usersMapped', usersMapped);
        setUsers(usersMapped);
        setVideos(Object.keys(videosRequested));
        setCurrentVideo(data.currentVideo);
      } catch (e) {
        console.log(e);
      }
    }

    fetch();
  }, [room]);

  const handleAddVideo = useCallback(() => {
    console.log('handleAddVideo');
    if (socketIo) {
      socketIo.emit('add-video', { room: room.id, video: videoUrl });
      onClose();
    } else {
      console.log('socketIo é nulo');
    }
  }, [socketIo, room.id, videoUrl, onClose]);

  const handlePlayVideo = useCallback(() => {
    console.log('handlePlayVideo');
    if (socketIo) {
      socketIo.emit('play-video', { room: room.id, video: '' });
    }
  }, [socketIo, room]);

  const handlePauseVideo = useCallback(() => {
    console.log('handlePlayVideo');
    if (socketIo) {
      socketIo.emit('pause-video', { room: room.id, video: '' });
    }
  }, [socketIo, room]);


  const handleChangeCurrentVideo = useCallback((videoUrl) => {
    console.log('handleChangeCurrentVideo');
    if (socketIo) {
      socketIo.emit('change-current-video', { room: room.id, video: videoUrl });
    }
  }, [socketIo, room]);

  useEffect(() => {
    if (videos.length) {
      const video = videos[videos.length - 1];
      console.log(video, 'can play', ReactPlayer.canPlay(video.url));
    }
  }, [videos]);

  useEffect(() => {
    console.log('useEffect');
    const io = socket(String(process.env.NEXT_PUBLIC_API_URL));
    setIo(io);
    io.on('connect', () => {
      const user = sessionStorage.getItem('username');
      console.log('connected', user);
      io.emit('enter-on-room', { room: room.id, user });
    });

    io.on('user-entered-room', () => {
      console.log('user-entered-room');
      getRoomInfo();
    });

    io.on('user-left-room', () => {
      console.log('user-left-room');
      getRoomInfo();
    });

    io.on('video-added', () => {
      console.log('video-added');
      getRoomInfo();
    });

    io.on('play', () => {
      console.log('play');
      setPlaying(true);
    });

    io.on('pause', () => {
      console.log('pause');
      setPlaying(false);
    });

    io.on('exception', (exception) => {
      io.emit('left-room', room.id);
      router.push('/');
    });

    io.on('video-removed', () => {
      console.log('video-removed');
      setPlaying(false);
      getRoomInfo();
    });

    io.on('current-video-changed', () => {
      console.log('current-video-changed');
      setPlaying(false);
      getRoomInfo();
    });

    return () => {
      console.log('left room and disconnect');
      io.emit('left-room', room.id);
      io.disconnect();
    };
  }, [getRoomInfo, room, router]);
  const reactPlayerWidth = useBreakpointValue({
    base: '350px',
    sm: '300px',
    md: '500px',
    lg: '700px',
  });
  const reactPlayerHeight = useBreakpointValue({
    base: '200px',
    sm: '200px',
    md: '400px',
    lg: '500px',
  });
const reactPlayerWidthThumb = useBreakpointValue({
    base: '90px',
    sm: '90px',
    md: '200px',
    lg: '300px',
  });
  const reactPlayerHeightThumb = useBreakpointValue({
    base: '80px',
    sm: '200px',
    md: '400px',
    lg: '500px',
  });
  return (
    <div style={{
      alignItems: 'stretch',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '1px',
      height: '100%',
      position: 'relative',
    }}>
    <Header />
          <VStack spacing="4" height="100%" p="8">
            <Text fontSize="sm">{videos.length} videos</Text>
            {videos.length === 0 && (
              <Text>Nothin to watchm, please add a video</Text>
            )}
            {currentVideo && (
              <VStack spacing="2">
              <Flex minHeight="10" alignItems="flex-end">
              <Text fontSize={["xs", "lg"]} noOfLines={[2,3]}>
                <b>
                  {currentVideo.item.snippet.title}
                </b>
              </Text>
              </Flex>
              <ReactPlayer
                width={reactPlayerWidth}
                height={reactPlayerHeight}
                key={currentVideo.url}
                url={currentVideo.url}
                playing={playing}
                onPlay={handlePlayVideo}
                onPause={handlePauseVideo}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 },
                  },
                  twitch: {
                    options: {},
                  },
                }}
              />
              </VStack>
            )}
            <Flex flexWrap="wrap" alignItems="flex-start">
              {videos.map((video) => (
                <Box
                  key={video}
                  maxW={reactPlayerWidthThumb}
                  boderWidth="1px"
                  borderRadius="md"
                  overflow="hidden"
                  m="2"
                  cursor="pointer"
                  onClick={() => handleChangeCurrentVideo(video)}
                >
                  <Image src={`https://img.youtube.com/vi/${YouTubeGetID(video)}/hqdefault.jpg`} />
                </Box>
              ))}
            </Flex>
          <IconButton
              position="fixed"
              isRound
              bottom="5"
              right="5"
              size="lg"
              onClick={onOpen}
              aria-label="Add video"
              icon={<AddIcon />}
            />

          </VStack>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
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
        </div>
  );
};

export const getServerSideProps = async (
  ctx: GetServerSidePropsContext<{ groupId: string }>
): Promise<GetServerSidePropsResult<{ groupId: string; room: Room }>> => {
  const { groupId } = ctx.params!;
  try {
    const response = await api.get<Room>(`/rooms/${groupId}`);
    return {
      props: {
        groupId,
        room: response.data,
      },
    };
  } catch (e) {
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
