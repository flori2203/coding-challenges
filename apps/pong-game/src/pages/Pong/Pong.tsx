import React, { useRef, useState, useEffect, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, PerspectiveCamera, Vector3 } from 'three';
import { Stack } from '@mui/material';
import { Physics, RigidBody, RigidBodyProps } from '@react-three/rapier';
import {RapierRigidBody} from "@react-three/rapier/dist/declarations/src/types";

interface PaddleProps extends RigidBodyProps {
  position: [number, number, number];
}

const Frame = () => {
  return (
    <>
      <RigidBody type="fixed">
        <mesh position={[0, 6, 0]}>
          <boxGeometry args={[25, 1, 1]} />
          <meshStandardMaterial color={'white'} />
        </mesh>
        <mesh position={[0, -6, 0]}>
          <boxGeometry args={[25, 1, 1]} />
          <meshStandardMaterial color={'white'} />
        </mesh>
        <mesh position={[-12, 0, 0]}>
          <boxGeometry args={[1, 10, 1]} />
          <meshStandardMaterial color={'red'} />
        </mesh>
        <mesh position={[12, 0, 0]}>
          <boxGeometry args={[1, 10, 1]} />
          <meshStandardMaterial color={'red'} />
        </mesh>
      </RigidBody>
    </>
  );
};

const Paddle = React.forwardRef<any, PaddleProps>(({ position }, ref) => {
  return (
    <RigidBody ref={ref} type="kinematicPosition">
      <mesh position={position}>
        <boxGeometry args={[1, 5, 1]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    </RigidBody>
  );
});

Paddle.displayName = 'Paddle';

const Ball = () => {
  const ref = useRef<any>(null);
  const [velocity, setVelocity] = useState(new Vector3(0.1, 0.1, 0));

  useFrame((state, delta, frame) => {
    if (!ref.current) return;

    ref.current.applyImpulse(velocity.clone().multiplyScalar(0.01), true);

    const pos = ref.current.translation();

  });

  return (
    <RigidBody ref={ref} restitution={1} friction={0}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5]} />
        <meshStandardMaterial color={'white'} />
      </mesh>
    </RigidBody>
  );
};

const PongScene = ({ leftPaddleY, rightPaddleY }: { leftPaddleY: number; rightPaddleY: number }) => {
  const leftPaddleRef = useRef<any>(null);
  const rightPaddleRef = useRef<any>(null);

  const { size, camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    const aspectRatio = size.width / size.height;
    perspectiveCamera.fov = 80 / aspectRatio;
    perspectiveCamera.position.z = 30 / aspectRatio;
    perspectiveCamera.updateProjectionMatrix();
  }, [size, camera]);

  const movePaddle = (paddleRef: MutableRefObject<any | null>, positionY: number) => {
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
      <Physics >
        <Ball />
        <Frame />
        <Paddle position={[-10, 0, 0]} ref={leftPaddleRef} />
        <Paddle position={[10, 0, 0]} ref={rightPaddleRef} />
      </Physics>
    </>
  );
};

const Pong = () => {
  const [leftPaddleY, setLeftPaddleY] = useState(0);
  const [rightPaddleY, setRightPaddleY] = useState(0);

  useEffect(() => {
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
  }, []);

  return (
    <Stack sx={{ height: (theme) => `calc(100vh - ${theme.appBarHeight})`, width: '100%' }}>
      <Canvas shadows>
        <PongScene leftPaddleY={leftPaddleY} rightPaddleY={rightPaddleY} />
      </Canvas>
    </Stack>
  );
};

export default Pong;
