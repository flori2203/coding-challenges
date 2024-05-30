import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, PerspectiveCamera, Vector3 } from 'three';
import {
  Box,
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
  leftPaddleY: number;
  rightPaddleY: number;
  boardSize: { height: number; width: number };
}> = ({ leftPaddleY, rightPaddleY, boardSize }) => {
  const ref = useRef<any | null>(null);
  const velocity = useRef(new Vector3(0, 0, 0));
  const speed = 0.2; // Adjust the speed as needed

  useEffect(() => {
    const randomDirection = Math.random() < 0.5 ? -1 : 1;
    const randomAngle = Math.random() * 25 + 30;
    velocity.current = new Vector3(
      Math.cos(randomAngle) * randomDirection,
      Math.sin(randomAngle),
      0
    )
      .normalize()
      .multiplyScalar(speed);
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    const pos = ref.current.translation();

    // Check for collision with left and right walls (red frame elements)
    if (pos.x > boardSize.width / 2 + 1 || pos.x < -(boardSize.width / 2 + 1)) {
      velocity.current.set(0, 0, 0); // Stop the ball
    }

    // Check for collision with top and bottom walls
    if (
      pos.y > boardSize.height / 2 + 1 ||
      pos.y < -(boardSize.height / 2 + 1)
    ) {
      velocity.current.y *= -1;
    }

    // Check for collision with paddles
    if (
      pos.x < -(boardSize.width / 2 - 1) &&
      Math.abs(pos.y - leftPaddleY) < 2.5
    ) {
      velocity.current.x *= -1;
    } else if (
      pos.x > boardSize.width / 2 - 1 &&
      Math.abs(pos.y - rightPaddleY) < 2.5
    ) {
      velocity.current.x *= -1;
    }

    // Update ball position based on velocity
    ref.current.setNextKinematicTranslation({
      x: pos.x + velocity.current.x,
      y: pos.y + velocity.current.y,
      z: 0,
    });
  });

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
}: {
  leftPaddleY: number;
  rightPaddleY: number;
}) => {
  const leftPaddleRef = useRef<any | null>(null);
  const rightPaddleRef = useRef<any | null>(null);
  const boardSize = {
    width: 30,
    height: 15,
  };

  const { size, camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    const aspectRatio = size.width / size.height;
    perspectiveCamera.fov = 80 / aspectRatio;
    perspectiveCamera.position.z = (boardSize.width * 1.4) / aspectRatio;
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
        <Ball
          leftPaddleY={leftPaddleY}
          rightPaddleY={rightPaddleY}
          boardSize={boardSize}
        />
        <Frame boardSize={boardSize} />
        <Paddle position={[-(boardSize.width / 2), 0, 0]} ref={leftPaddleRef} />
        <Paddle position={[boardSize.width / 2, 0, 0]} ref={rightPaddleRef} />
      </Physics>
    </>
  );
};

const Pong = () => {
  const [leftPaddleY, setLeftPaddleY] = useState(0);
  const [rightPaddleY, setRightPaddleY] = useState(0);
  const [wsc, setWsc] = useState<WebSocket | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleButtonClick = () => {
    if (wsc) {
      wsc.send('Hello');
    }
  };

  useEffect(() => {
    const wsc = new WebSocket('ws://localhost:3000');
    setWsc(wsc);

    wsc.onmessage = function (message) {
      console.log('New notification: ' + message.data);
    };

    return () => {
      wsc.close();
      setWsc(null);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'w':
          setLeftPaddleY((prev) => Math.min(prev + 0.5, 5));
          break;
        case 's':
          setLeftPaddleY((prev) => Math.max(prev - 0.5, -5));
          break;
        case 'ArrowUp':
          setRightPaddleY((prev) => Math.min(prev + 0.5, 5));
          break;
        case 'ArrowDown':
          setRightPaddleY((prev) => Math.max(prev - 0.5, -5));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoggedIn]);

  return (
    <Stack
      sx={{
        height: (theme) => `calc(100vh - ${theme.appBarHeight})`,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isLoggedIn && (
        <>
          <button onClick={handleButtonClick}>Hallo</button>
          <Canvas shadows>
            <PongScene leftPaddleY={leftPaddleY} rightPaddleY={rightPaddleY} />
          </Canvas>
        </>
      )}

      {!isLoggedIn && (
        <Card variant={'outlined'}>
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Typography variant={'h4'} color="text.primary">
              Login
            </Typography>
            <Divider sx={{ borderColor: '#3f3f3f', mb: 2 }} />

            <Stack>
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'center'}
                spacing={2}
              >
                <Typography color="text.secondary">
                  Gib deinen Namen ein:
                </Typography>
                <TextField id="standard-basic" variant="standard" />
              </Stack>

              <TextField
                id="standard-basic"
                label="Spiel-Nummer"
                variant="standard"
              />
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
};

export default Pong;
