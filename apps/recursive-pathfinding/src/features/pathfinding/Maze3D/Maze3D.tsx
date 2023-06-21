import { Canvas } from '@react-three/fiber';
import React, { Suspense } from 'react';
import { OrbitControls, Box } from '@react-three/drei';
import { Vector3 } from 'three';
import * as THREE from 'three';

interface CubeProps {
  color: string;
  size: number;
  position?: Vector3;
}

const Cube: React.FC<CubeProps> = ({ color, size, position }) => {
  return (
    <Box position={position} args={[size, size, size]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

interface Maze3DProps {
  maze: string[][];
  x: number;
  y: number;
}

const Maze3D: React.FC<Maze3DProps> = ({ maze, x, y }) => {
  const sizeOfOneField = 0.5;
  const gapBetweenFields = 0.1;
  const lengthOfBackground =
    maze.length * sizeOfOneField + (maze.length - 1) * gapBetweenFields;

  const getCubes = (maze: string[][]) => {
    const rows = maze.length;
    const cols = maze[0].length;
    const cubes: JSX.Element[] = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const position: Vector3 = new THREE.Vector3(
          i * sizeOfOneField +
            i * gapBetweenFields -
            lengthOfBackground / 2 +
            sizeOfOneField / 2,
          j * sizeOfOneField +
            j * gapBetweenFields -
            lengthOfBackground / 2 +
            sizeOfOneField / 2,
          0
        );

        if (maze[i][j] !== ' ') {
          const cubeColor =
            maze[i][j] === 'X'
              ? '#707070'
              : maze[i][j] === 'A'
              ? '#02e245'
              : maze[i][j] === 'Z'
              ? '#da2505'
              : maze[i][j] === 'P'
              ? '#f5f500'
              : maze[i][j] === 'B'
              ? '#07ebeb'
              : maze[i][j] === 'R'
              ? '#e76a74'
              : '#fafafa';

          cubes.push(
            <Cube
              color={cubeColor}
              size={sizeOfOneField}
              position={position}
              key={`${i},${j}, ${cubeColor}`}
            />
          );
        }
      }
    }

    return cubes;
  };

  const cubes = getCubes(maze);

  return (
    <Suspense>
      <Canvas>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 2]} intensity={0.6} />

        {cubes}

        <OrbitControls />
      </Canvas>
    </Suspense>
  );
};

export default Maze3D;
