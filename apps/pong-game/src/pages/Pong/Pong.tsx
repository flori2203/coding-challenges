import React, { useRef, useState, useEffect, MutableRefObject, useMemo  } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Mesh, PerspectiveCamera, Object3D, Raycaster, Vector3 } from 'three';
import { Stack } from '@mui/material';
import {RigidBody, useFixedJoint} from "@react-three/rapier";

const useForwardRaycast = (obj: {current: Object3D|null}) => {

  const raycaster = useMemo(() => new Raycaster(), [])
  const pos = useMemo(() => new Vector3(), [])
  const dir = useMemo(() => new Vector3(), [])
  const scene = useThree(state => state.scene)

  return () => {
    if (!obj.current)
      return []
    raycaster.set(
      obj.current.getWorldPosition(pos),
      obj.current.getWorldDirection(dir))
    return raycaster.intersectObjects(scene.children)
  }
}

interface PaddleProps {
  position: [number, number, number];
}

const Frame = () => {
  return (
    <>
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[25, 1, 1]}/>
        <meshStandardMaterial color={'white'}/>
      </mesh>
      <mesh position={[0, -6, 0]}>
        <boxGeometry args={[25, 1, 1]}/>
        <meshStandardMaterial color={'white'}/>
      </mesh>
      <mesh position={[-12, 0, 0]}>
        <boxGeometry args={[1, 10, 1]}/>
        <meshStandardMaterial color={'red'}/>
      </mesh>
      <mesh position={[12, 0, 0]}>
        <boxGeometry args={[1, 10, 1]}/>
        <meshStandardMaterial color={'red'}/>
      </mesh>
    </>
  );
}

const Paddle = React.forwardRef<Mesh, PaddleProps>(({position}, ref) => {
  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={[1, 5, 1]} />
      <meshStandardMaterial color={'white'} />
    </mesh>
  );
});

Paddle.displayName = 'Paddle';

const Ball = () => {
  const ref = useRef<Mesh>(null);
  const [velocity] = useState<[number, number]>([0.01, 0.01]);
  // const raycast = useForwardRaycast(ref)

  useFrame((state, delta) => {
    if (!ref.current) return;
    // ref.current.rotation.y += delta
    // const intersections = raycast()
    // console.log(intersections.length)

    ref.current.position.x += velocity[0];
    ref.current.position.y += velocity[1];


    ref.current.position.x += velocity[0];
    ref.current.position.y += velocity[1];

    // Bounce off top and bottom
    if (ref.current.position.y > 5 || ref.current.position.y < -5) {
      velocity[1] = -velocity[1];
    }

    // Bounce off left and right
    if (ref.current.position.x > 10 || ref.current.position.x < -10) {
      velocity[0] = -velocity[0];
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color={'white'} />
    </mesh>
  );
};

const PongScene = ({ leftPaddleY, rightPaddleY }: { leftPaddleY: number; rightPaddleY: number }) => {
  const leftPaddleRef = useRef<Mesh>(null);
  const rightPaddleRef = useRef<Mesh>(null);

  const { size, camera } = useThree();

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    const aspectRatio = size.width / size.height;
    perspectiveCamera.fov = 80 / aspectRatio;
    perspectiveCamera.position.z = 30 / aspectRatio;
    perspectiveCamera.updateProjectionMatrix();
  }, [size, camera]);

  const movePaddle = (paddleRef: MutableRefObject<Mesh | null>, positionY: number) => {
    if (paddleRef.current) {
      paddleRef.current.position.y = positionY;
    }
  };

  useFrame(() => {
    movePaddle(leftPaddleRef, leftPaddleY);
    movePaddle(rightPaddleRef, rightPaddleY);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0,0,30]} />

      <Ball />

      <Frame />
      <Paddle position={[-10, 0, 0]} ref={leftPaddleRef} />
      <Paddle position={[10, 0, 0]} ref={rightPaddleRef} />
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
      <Canvas shadows >
        <PongScene leftPaddleY={leftPaddleY} rightPaddleY={rightPaddleY} />
      </Canvas>
    </Stack>
  );
};

export default Pong;
