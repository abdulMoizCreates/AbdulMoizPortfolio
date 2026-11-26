"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const FILM_WIDTH = 0.62;
const SEGMENTS = 180;

function createRibbonGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5.4, -1.2, 0.4),
    new THREE.Vector3(-2.6, 0.9, -0.4),
    new THREE.Vector3(0, 1.35, 0.5),
    new THREE.Vector3(2.6, 0.6, -0.5),
    new THREE.Vector3(5.2, -1.3, 0.2),
  ]);

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3();
  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();

  for (let index = 0; index <= SEGMENTS; index += 1) {
    const t = index / SEGMENTS;
    curve.getPointAt(t, point);
    curve.getTangentAt(t, tangent);

    side.copy(up).addScaledVector(tangent, -up.dot(tangent));

    if (side.lengthSq() < 0.0001) {
      side.set(1, 0, 0);
    } else {
      side.normalize();
    }

    const left = point.clone().addScaledVector(side, FILM_WIDTH / 2);
    const right = point.clone().addScaledVector(side, -FILM_WIDTH / 2);

    positions.push(left.x, left.y, left.z, right.x, right.y, right.z);
    uvs.push(t, 1, t, 0);

    if (index < SEGMENTS) {
      const a = index * 2;
      const b = a + 1;
      const c = a + 2;
      const d = a + 3;
      indices.push(a, b, c, b, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function createFilmTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const width = canvas.width;
  const height = canvas.height;

  context.fillStyle = "#111318";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#090a0d";
  context.fillRect(0, 0, width, 18);
  context.fillRect(0, height - 18, width, 18);

  const holeWidth = 18;
  const holeHeight = 11;
  const holeGap = 28;

  context.fillStyle = "#06070a";
  for (let x = 12; x < width - holeWidth; x += holeWidth + holeGap) {
    context.fillRect(x, 4, holeWidth, holeHeight);
    context.fillRect(x, height - 4 - holeHeight, holeWidth, holeHeight);
  }

  const frameCount = 18;
  const frameGap = 10;
  const frameWidth = (width - frameGap * (frameCount + 1)) / frameCount;
  const frameTop = 34;
  const frameHeight = height - frameTop * 2;

  for (let index = 0; index < frameCount; index += 1) {
    const x = frameGap + index * (frameWidth + frameGap);

    context.fillStyle = "#1b1e25";
    context.fillRect(x, frameTop, frameWidth, frameHeight);

    context.strokeStyle = "#2d313b";
    context.lineWidth = 2;
    context.strokeRect(x + 1, frameTop + 1, frameWidth - 2, frameHeight - 2);
  }

  context.fillStyle = "#2a2e37";
  context.fillRect(0, 18, width, 1);
  context.fillRect(0, height - 19, width, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return texture;
}

function FilmStrip() {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => createRibbonGeometry(), []);
  const texture = useMemo(() => createFilmTexture(), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      texture?.dispose();
    };
  }, [geometry, texture]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.elapsedTime;

    group.rotation.y = Math.sin(time * 0.22) * 0.26;
    group.rotation.x = Math.sin(time * 0.18) * 0.07;
    group.position.y = Math.sin(time * 0.35) * 0.08;
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} rotation={[0.05, 0, -0.04]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
          roughness={0.58}
          metalness={0.16}
        />
      </mesh>
    </group>
  );
}

export default function FilmTape() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 6, 7]} intensity={1.35} />
      <directionalLight position={[-5, -2, 4]} intensity={0.5} />
      <FilmStrip />
    </Canvas>
  );
}
