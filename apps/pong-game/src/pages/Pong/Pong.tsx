import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, PerspectiveCamera, Vector3 } from 'three';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Physics, RigidBody, RigidBodyProps } from '@react-three/rapier';
import SchulzLogoSvg from 'apps/pong-game/src/assets/schulzLogos/Logo_SCHULZ.svg';
import { useWsConnection } from '@pong-game/context/WsConnectionContext';

interface PaddleProps extends RigidBodyProps {
  position: [number, number, number];
}

const Frame: React.FC<{ boardSize: { height: number; width: number } }> = ({
  boardSize,
}) => {
  const theme = useTheme();

  return (
    <>
      <RigidBody type="fixed">
        <mesh position={[0, boardSize.height / 2 + 2, 0]}>
          <boxGeometry args={[boardSize.width + 5, 1, 1]} />
          <meshStandardMaterial color={'white'} />
        </mesh>
        <mesh position={[0, -(boardSize.height / 2 + 2), 0]}>
          <boxGeometry args={[boardSize.width + 5, 1, 1]} />
          <meshStandardMaterial color={'white'} />
        </mesh>
        <mesh position={[-(boardSize.width / 2 + 2), 0, 0]}>
          <boxGeometry args={[1, boardSize.height + 2, 1]} />
          <meshStandardMaterial color={'red'} />
        </mesh>
        <mesh position={[boardSize.width / 2 + 2, 0, 0]}>
          <boxGeometry args={[1, boardSize.height + 2, 1]} />
          <meshStandardMaterial color={'red'} />
        </mesh>
        <mesh position={[0, 0, -1]}>
          <boxGeometry args={[boardSize.width + 5, boardSize.height + 5, 1]} />
          <meshStandardMaterial color={theme.palette.background.paper} />
        </mesh>
      </RigidBody>
    </>
  );
};

const Paddle = React.forwardRef<any, PaddleProps>(({ position }, ref) => {
  return (
    <RigidBody
      ref={ref}
      type="kinematicPosition"
      onIntersectionEnter={() => console.log('Collision')}
    >
      <mesh position={position}>
        <boxGeometry args={[1, 5, 1]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    </RigidBody>
  );
});

Paddle.displayName = 'Paddle';

const Ball: React.FC<{
  position: { x: number; y: number };
}> = ({ position }) => {
  const ref = useRef<any | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.setNextKinematicTranslation({
        x: position.x,
        y: position.y,
        z: 0,
      });
    }
  }, [position]);

  return (
    <RigidBody ref={ref} type="kinematicPosition">
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    </RigidBody>
  );
};

const PongScene = ({
  leftPaddleY,
  rightPaddleY,
  ballPos,
  boardSize,
}: {
  leftPaddleY: number;
  rightPaddleY: number;
  ballPos: {
    x: number;
    y: number;
  };
  boardSize: {
    width: number;
    height: number;
  };
}) => {
  const leftPaddleRef = useRef<any | null>(null);
  const rightPaddleRef = useRef<any | null>(null);

  const { size, camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    const aspectRatio = size.width / size.height;
    perspectiveCamera.fov = 80 / aspectRatio;
    perspectiveCamera.position.z = (boardSize.width * 1.6) / aspectRatio;
    perspectiveCamera.updateProjectionMatrix();
  }, [size, camera]);

  const movePaddle = (
    paddleRef: MutableRefObject<any | null>,
    positionY: number
  ) => {
    if (paddleRef.current) {
      paddleRef.current.setNextKinematicTranslation({
        x: paddleRef.current.translation().x,
        y: positionY,
        z: paddleRef.current.translation().z,
      });
    }
  };

  useFrame(() => {
    movePaddle(leftPaddleRef, leftPaddleY);
    movePaddle(rightPaddleRef, rightPaddleY);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 30]} />
      <Physics gravity={[0, 0, 0]}>
        <Ball position={ballPos} />
        <Frame boardSize={boardSize} />
        <Paddle position={[-(boardSize.width / 2), 0, 0]} ref={leftPaddleRef} />
        <Paddle position={[boardSize.width / 2, 0, 0]} ref={rightPaddleRef} />
      </Physics>
    </>
  );
};

const Pong = () => {
  const { ws, game } = useWsConnection();

  if (!game) {
    return (
      <Stack
        sx={{
          height: (theme) => `calc(100vh - ${theme.appBarHeight})`,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant={'h4'}>Loading...</Typography>
      </Stack>
    );
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          ws.send(
            JSON.stringify({
              type: 'movePaddle',
              gameId: game.id,
              move: 'up',
            })
          );
          break;
        case 'ArrowDown':
          ws.send(
            JSON.stringify({
              type: 'movePaddle',
              gameId: game.id,
              move: 'down',
            })
          );
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Stack
      sx={{
        height: (theme) => `calc(100vh - ${theme.appBarHeight})`,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Canvas shadows>
        <PongScene
          leftPaddleY={game.positions.leftPaddleY}
          rightPaddleY={game.positions.rightPaddleY}
          ballPos={game.positions.ball}
          boardSize={game.boardSize}
        />
      </Canvas>
      <Backdrop open={!game.isStarted} sx={{ backdropFilter: 'blur(5px)' }}>
        {game.winner && (
          <>
            <Typography sx={{ fontSize: 130 }}>WINNER:</Typography>
            <Typography sx={{ fontSize: 130 }}>{game.winner.name}</Typography>
          </>
        )}
        {!game.winner && (
          <Typography sx={{ fontSize: 130 }}>{game.countDown}</Typography>
        )}
      </Backdrop>
    </Stack>
  );
};

export default Pong;
