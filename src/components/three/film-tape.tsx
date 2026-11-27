"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type FilmTapeProps = {
  label: string;
  tools: string[];
};

const FILM_WIDTH = 0.68;
const SEGMENTS = 200;
const FRAME_COUNT = 16;

function createRibbonGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5.6, -1.35, 0.5),
    new THREE.Vector3(-3.1, 0.35, -0.35),
    new THREE.Vector3(-0.4, 1.35, 0.6),
    new THREE.Vector3(2.4, 0.55, -0.55),
    new THREE.Vector3(5.4, -1.45, 0.25),
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

    // A gentle twist makes the strip read as suspended film, not a flat band.
    side.applyAxisAngle(tangent, Math.sin(t * Math.PI * 1.6) * 0.34);

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

function createFilmTexture({ label, tools }: FilmTapeProps) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const width = canvas.width;
  const height = canvas.height;
  const band = 22;
  const gateTop = band + 8;
  const gateBottom = height - band - 8;

  const stock = context.createLinearGradient(0, 0, 0, height);
  stock.addColorStop(0, "#0b0d11");
  stock.addColorStop(0.5, "#15181e");
  stock.addColorStop(1, "#0b0d11");
  context.fillStyle = stock;
  context.fillRect(0, 0, width, height);

  // Sprocket bands with recessed, rounded perforations.
  context.fillStyle = "#050609";
  context.fillRect(0, 0, width, band);
  context.fillRect(0, height - band, width, band);

  const holeWidth = 19;
  const holeHeight = 12;
  const holeGap = 27;
  for (let x = 10; x < width - holeWidth; x += holeWidth + holeGap) {
    for (const y of [5, height - band + 5]) {
      context.beginPath();
      context.roundRect(x, y, holeWidth, holeHeight, 3);
      context.fillStyle = "#090b0f";
      context.fill();
      context.strokeStyle = "rgb(150 165 190 / 14%)";
      context.lineWidth = 1;
      context.stroke();
    }
  }

  context.fillStyle = "rgb(190 205 230 / 10%)";
  context.fillRect(0, band, width, 1);
  context.fillRect(0, height - band - 1, width, 1);

  const gap = 9;
  const frameWidth = (width - gap * (FRAME_COUNT + 1)) / FRAME_COUNT;
  const frameHeight = gateBottom - gateTop;
  const captions = [label, ...tools.filter(Boolean)];
  let grainSeed = 7;

  for (let index = 0; index < FRAME_COUNT; index += 1) {
    const x = gap + index * (frameWidth + gap);

    context.save();
    context.beginPath();
    context.rect(x, gateTop, frameWidth, frameHeight);
    context.clip();

    const still = context.createLinearGradient(x, gateTop, x + frameWidth, gateBottom);
    still.addColorStop(0, "#0f1218");
    still.addColorStop(0.45, "#20242c");
    still.addColorStop(1, "#0d0f14");
    context.fillStyle = still;
    context.fillRect(x, gateTop, frameWidth, frameHeight);

    // Soft raking light across each frame, like a graded shot.
    const streak = context.createLinearGradient(x, gateTop, x + frameWidth, gateBottom);
    streak.addColorStop(0, "rgb(220 230 250 / 0%)");
    streak.addColorStop(0.42, "rgb(220 230 250 / 7%)");
    streak.addColorStop(0.62, "rgb(220 230 250 / 0%)");
    context.fillStyle = streak;
    context.fillRect(x, gateTop, frameWidth, frameHeight);

    const glow = context.createRadialGradient(
      x + frameWidth * 0.7,
      gateTop + frameHeight * 0.32,
      2,
      x + frameWidth * 0.7,
      gateTop + frameHeight * 0.32,
      frameWidth * 0.62,
    );
    glow.addColorStop(0, "rgb(205 218 240 / 12%)");
    glow.addColorStop(1, "rgb(205 218 240 / 0%)");
    context.fillStyle = glow;
    context.fillRect(x, gateTop, frameWidth, frameHeight);

    context.fillStyle = "rgb(215 225 245 / 16%)";
    context.fillRect(x, gateTop + frameHeight * 0.74, frameWidth, 1);

    // Fine film grain, deterministic so the strip looks the same on every render.
    for (let dot = 0; dot < 90; dot += 1) {
      grainSeed = (grainSeed * 16807) % 2147483647;
      const px = x + ((grainSeed / 2147483647) * frameWidth);
      grainSeed = (grainSeed * 16807) % 2147483647;
      const py = gateTop + ((grainSeed / 2147483647) * frameHeight);
      context.fillStyle = `rgb(230 235 245 / ${dot % 3 === 0 ? 5 : 2}%)`;
      context.fillRect(px, py, 1, 1);
    }

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "rgb(232 235 242 / 62%)";
    context.font = "500 22px Inter, Arial, sans-serif";
    const caption = captions[index % captions.length] ?? label;
    context.fillText(caption, x + frameWidth / 2, gateTop + frameHeight * 0.38, frameWidth - 10);

    context.fillStyle = "rgb(180 190 210 / 38%)";
    context.font = "400 13px Inter, Arial, sans-serif";
    context.fillText(
      String(index + 1).padStart(2, "0"),
      x + frameWidth / 2,
      gateTop + frameHeight * 0.8,
    );

    context.restore();

    context.strokeStyle = "rgb(180 195 220 / 16%)";
    context.lineWidth = 1;
    context.strokeRect(x + 0.5, gateTop + 0.5, frameWidth - 1, frameHeight - 1);
  }

  const leak = context.createRadialGradient(
    width * 0.88,
    height * 0.5,
    4,
    width * 0.88,
    height * 0.5,
    width * 0.16,
  );
  leak.addColorStop(0, "rgb(205 190 175 / 12%)");
  leak.addColorStop(1, "rgb(205 190 175 / 0%)");
  context.fillStyle = leak;
  context.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;

  return texture;
}

function FilmStrip({ label, tools }: FilmTapeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = useMemo(() => createRibbonGeometry(), []);
  const texture = useMemo(
    () => createFilmTexture({ label, tools }),
    [label, tools],
  );
  const textureRef = useRef<THREE.CanvasTexture | null>(texture);

  useEffect(() => {
    textureRef.current = texture;

    return () => {
      geometry.dispose();
      texture?.dispose();
    };
  }, [geometry, texture]);

  useFrame((state, delta) => {
    const filmTexture = textureRef.current;
    if (filmTexture) {
      filmTexture.offset.x = (filmTexture.offset.x + delta * 0.011) % 1;
    }

    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.elapsedTime;
    group.rotation.y = Math.sin(time * 0.2) * 0.22;
    group.rotation.x = Math.sin(time * 0.16) * 0.05;
    group.position.y = Math.sin(time * 0.3) * 0.07;
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} rotation={[0.04, 0, -0.03]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          map={texture}
          side={THREE.DoubleSide}
          roughness={0.46}
          metalness={0.06}
          clearcoat={0.45}
          clearcoatRoughness={0.3}
        />
      </mesh>
    </group>
  );
}

export default function FilmTape({ label, tools }: FilmTapeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 6, 7]} intensity={1.55} />
      <directionalLight position={[-5, -2, 4]} intensity={0.45} />
      <directionalLight position={[0, 3, -5]} intensity={0.65} />
      <FilmStrip label={label} tools={tools} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.32}
          luminanceThreshold={0.78}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <Vignette offset={0.28} darkness={0.55} />
        <Noise opacity={0.028} premultiply />
      </EffectComposer>
    </Canvas>
  );
}
