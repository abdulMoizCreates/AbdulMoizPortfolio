"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";

type FilmTapeProps = {
  label: string;
  tools: string[];
  motion: RefObject<{ value: number }>;
};

const FILM_WIDTH = 1.15;
const SEGMENTS = 240;
const FRAME_COUNT = 14;

function createRibbonGeometry() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6.2, -1.6, 0.6),
    new THREE.Vector3(-3.4, 0.2, -0.5),
    new THREE.Vector3(-0.6, 1.5, 0.7),
    new THREE.Vector3(2.6, 0.7, -0.7),
    new THREE.Vector3(5.8, -1.7, 0.3),
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

    // The strip twists as it hangs, so the highlights travel across its face.
    side.applyAxisAngle(tangent, Math.sin(t * Math.PI * 1.8) * 0.2);

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

function createFilmTexture({ label, tools }: Pick<FilmTapeProps, "label" | "tools">) {
  const canvas = document.createElement("canvas");
  canvas.width = 4096;
  canvas.height = 512;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const width = canvas.width;
  const height = canvas.height;
  const band = 44;
  const gateTop = band + 14;
  const gateBottom = height - band - 14;

  const stock = context.createLinearGradient(0, 0, 0, height);
  stock.addColorStop(0, "#0b0e13");
  stock.addColorStop(0.5, "#1c212a");
  stock.addColorStop(1, "#0b0e13");
  context.fillStyle = stock;
  context.fillRect(0, 0, width, height);

  // Recessed sprocket bands with beveled perforations.
  context.fillStyle = "#050609";
  context.fillRect(0, 0, width, band);
  context.fillRect(0, height - band, width, band);

  const holeWidth = 34;
  const holeHeight = 22;
  const holeGap = 48;
  for (let x = 16; x < width - holeWidth; x += holeWidth + holeGap) {
    for (const y of [11, height - band + 11]) {
      context.beginPath();
      context.roundRect(x, y, holeWidth, holeHeight, 6);
      context.fillStyle = "#0a0c11";
      context.fill();
      context.strokeStyle = "rgb(160 178 210 / 18%)";
      context.lineWidth = 1.5;
      context.stroke();
      context.strokeStyle = "rgb(0 0 0 / 55%)";
      context.strokeRect(x + 1, y + holeHeight - 1, holeWidth - 2, 2);
    }
  }

  context.fillStyle = "rgb(200 215 240 / 12%)";
  context.fillRect(0, band, width, 2);
  context.fillRect(0, height - band - 2, width, 2);

  const gap = 16;
  const frameWidth = (width - gap * (FRAME_COUNT + 1)) / FRAME_COUNT;
  const frameHeight = gateBottom - gateTop;
  const captions = [label, ...tools.filter(Boolean)];
  let grainSeed = 17;

  for (let index = 0; index < FRAME_COUNT; index += 1) {
    const x = gap + index * (frameWidth + gap);

    context.save();
    context.beginPath();
    context.rect(x, gateTop, frameWidth, frameHeight);
    context.clip();

    const shot = context.createLinearGradient(x, gateTop, x + frameWidth, gateBottom);
    shot.addColorStop(0, "#161b24");
    shot.addColorStop(0.42, "#3b4452");
    shot.addColorStop(1, "#10141b");
    context.fillStyle = shot;
    context.fillRect(x, gateTop, frameWidth, frameHeight);

    // A soft key light and a horizon give each frame a graded still.
    const key = context.createRadialGradient(
      x + frameWidth * 0.68,
      gateTop + frameHeight * 0.3,
      4,
      x + frameWidth * 0.68,
      gateTop + frameHeight * 0.3,
      frameWidth * 0.72,
    );
    key.addColorStop(0, "rgb(225 234 248 / 30%)");
    key.addColorStop(1, "rgb(225 234 248 / 0%)");
    context.fillStyle = key;
    context.fillRect(x, gateTop, frameWidth, frameHeight);

    context.fillStyle = "rgb(6 8 12 / 55%)";
    context.beginPath();
    context.moveTo(x, gateTop + frameHeight * 0.78);
    context.lineTo(x + frameWidth * 0.3, gateTop + frameHeight * 0.56);
    context.lineTo(x + frameWidth * 0.52, gateTop + frameHeight * 0.78);
    context.lineTo(x + frameWidth * 0.78, gateTop + frameHeight * 0.46);
    context.lineTo(x + frameWidth, gateTop + frameHeight * 0.78);
    context.lineTo(x + frameWidth, gateBottom);
    context.lineTo(x, gateBottom);
    context.closePath();
    context.fill();

    context.fillStyle = "rgb(214 225 244 / 14%)";
    context.fillRect(x, gateTop + frameHeight * 0.78, frameWidth, 2);

    for (let bokeh = 0; bokeh < 5; bokeh += 1) {
      grainSeed = (grainSeed * 16807) % 2147483647;
      const bx = x + ((grainSeed / 2147483647) * frameWidth);
      grainSeed = (grainSeed * 16807) % 2147483647;
      const by = gateTop + ((grainSeed / 2147483647) * frameHeight * 0.6);
      grainSeed = (grainSeed * 16807) % 2147483647;
      const radius = 5 + ((grainSeed / 2147483647) * 14);
      context.beginPath();
      context.arc(bx, by, radius, 0, Math.PI * 2);
      context.fillStyle = "rgb(230 238 252 / 5%)";
      context.fill();
    }

    for (let dot = 0; dot < 200; dot += 1) {
      grainSeed = (grainSeed * 16807) % 2147483647;
      const px = x + ((grainSeed / 2147483647) * frameWidth);
      grainSeed = (grainSeed * 16807) % 2147483647;
      const py = gateTop + ((grainSeed / 2147483647) * frameHeight);
      context.fillStyle = `rgb(235 240 250 / ${dot % 4 === 0 ? 6 : 2}%)`;
      context.fillRect(px, py, 1, 1);
    }

    const caption = captions[index % captions.length] ?? label;
    context.textAlign = "left";
    context.textBaseline = "alphabetic";
    context.fillStyle = "rgb(232 237 246 / 92%)";
    context.font = "500 30px Inter, Arial, sans-serif";
    context.fillText(caption, x + 16, gateBottom - 18, frameWidth - 32);

    context.fillStyle = "rgb(190 202 222 / 55%)";
    context.font = "400 18px Inter, Arial, sans-serif";
    context.fillText(String(index + 1).padStart(2, "0"), x + 16, gateTop + 28);

    context.restore();

    context.strokeStyle = "rgb(190 205 230 / 18%)";
    context.lineWidth = 1;
    context.strokeRect(x + 0.5, gateTop + 0.5, frameWidth - 1, frameHeight - 1);
  }

  // Fine vertical scratches and a gentle warm light leak at the tail.
  for (let scratch = 0; scratch < 7; scratch += 1) {
    grainSeed = (grainSeed * 16807) % 2147483647;
    const sx = (grainSeed / 2147483647) * width;
    context.fillStyle = "rgb(230 236 248 / 4%)";
    context.fillRect(sx, gateTop, 1, frameHeight);
  }

  const leak = context.createRadialGradient(
    width * 0.87,
    height * 0.5,
    8,
    width * 0.87,
    height * 0.5,
    width * 0.18,
  );
  leak.addColorStop(0, "rgb(210 196 180 / 14%)");
  leak.addColorStop(1, "rgb(210 196 180 / 0%)");
  context.fillStyle = leak;
  context.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.anisotropy = 16;
  texture.needsUpdate = true;

  return texture;
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const glow = context.createRadialGradient(256, 128, 4, 256, 128, 250);
  glow.addColorStop(0, "rgb(225 234 248 / 30%)");
  glow.addColorStop(0.45, "rgb(225 234 248 / 9%)");
  glow.addColorStop(1, "rgb(225 234 248 / 0%)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 512, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function createMonitorTexture({ label, tools }: Pick<FilmTapeProps, "label" | "tools">) {
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const width = canvas.width;
  const height = canvas.height;

  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#171c24");
  sky.addColorStop(0.52, "#39414e");
  sky.addColorStop(1, "#0d1015");
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  const key = context.createRadialGradient(
    width * 0.7,
    height * 0.3,
    10,
    width * 0.7,
    height * 0.3,
    width * 0.45,
  );
  key.addColorStop(0, "rgb(238 243 252 / 34%)");
  key.addColorStop(1, "rgb(238 243 252 / 0%)");
  context.fillStyle = key;
  context.fillRect(0, 0, width, height);

  const ridge = (points: Array<[number, number]>, color: string) => {
    context.beginPath();
    context.moveTo(0, height);
    points.forEach(([x, y]) => context.lineTo(x * width, y * height));
    context.lineTo(width, height);
    context.closePath();
    context.fillStyle = color;
    context.fill();
  };

  ridge(
    [
      [0, 0.7],
      [0.18, 0.55],
      [0.34, 0.68],
      [0.52, 0.48],
      [0.72, 0.66],
      [0.88, 0.52],
      [1, 0.64],
    ],
    "rgb(10 13 18 / 62%)",
  );
  ridge(
    [
      [0, 0.82],
      [0.22, 0.72],
      [0.46, 0.84],
      [0.68, 0.7],
      [0.86, 0.8],
      [1, 0.72],
    ],
    "rgb(6 8 12 / 88%)",
  );

  context.fillStyle = "rgb(222 232 248 / 20%)";
  context.fillRect(0, height * 0.7, width, 2);

  let seed = 23;
  for (let index = 0; index < 14; index += 1) {
    seed = (seed * 16807) % 2147483647;
    const x = (seed / 2147483647) * width;
    seed = (seed * 16807) % 2147483647;
    const y = (seed / 2147483647) * height * 0.6;
    seed = (seed * 16807) % 2147483647;
    const radius = 4 + (seed / 2147483647) * 16;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = "rgb(235 241 252 / 6%)";
    context.fill();
  }

  for (let index = 0; index < 900; index += 1) {
    seed = (seed * 16807) % 2147483647;
    const x = (seed / 2147483647) * width;
    seed = (seed * 16807) % 2147483647;
    const y = (seed / 2147483647) * height;
    context.fillStyle = `rgb(235 240 250 / ${index % 5 === 0 ? 5 : 2}%)`;
    context.fillRect(x, y, 1, 1);
  }

  context.fillStyle = "#050609";
  context.fillRect(0, 0, width, 46);
  context.fillRect(0, height - 46, width, 46);

  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.fillStyle = "rgb(236 241 249 / 90%)";
  context.font = "500 42px Inter, Arial, sans-serif";
  context.fillText(label, 56, height - 74);

  context.fillStyle = "rgb(202 214 232 / 62%)";
  context.font = "400 24px Inter, Arial, sans-serif";
  context.fillText(tools.slice(0, 2).join("   /   "), 56, 82);

  const vignette = context.createRadialGradient(
    width / 2,
    height / 2,
    height * 0.22,
    width / 2,
    height / 2,
    width * 0.72,
  );
  vignette.addColorStop(0, "rgb(0 0 0 / 0%)");
  vignette.addColorStop(1, "rgb(0 0 0 / 58%)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return texture;
}

function ProgramMonitor({ label, tools }: Pick<FilmTapeProps, "label" | "tools">) {
  const texture = useMemo(
    () => createMonitorTexture({ label, tools }),
    [label, tools],
  );

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -1.6]}>
      <planeGeometry args={[9.4, 5.3]} />
      <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={0.94} />
    </mesh>
  );
}

function CameraRig({ motion }: Pick<FilmTapeProps, "motion">) {
  const { camera } = useThree();
  const cameraRef = useRef(camera);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  useFrame(() => {
    const activeCamera = cameraRef.current;
    const progress = motion.current?.value ?? 0;
    activeCamera.position.z = 8.6 - progress * 0.5;
    activeCamera.position.x = Math.sin(progress * Math.PI) * 0.16;
    activeCamera.rotation.y = Math.sin(progress * Math.PI) * 0.03;
  });

  return null;
}

function FilmStrip({ label, tools, motion }: FilmTapeProps) {
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
    const progress = motion.current?.value ?? 0;

    if (filmTexture) {
      filmTexture.offset.x =
        (filmTexture.offset.x + delta * (0.018 + progress * 0.05)) % 1;
    }

    const group = groupRef.current;
    if (!group) return;

    const time = state.clock.elapsedTime;
    group.rotation.y = Math.sin(time * 0.2) * 0.16 + progress * 0.12;
    group.rotation.x = Math.sin(time * 0.16) * 0.04 - progress * 0.03;
    group.position.y = Math.sin(time * 0.3) * 0.05;
    group.scale.setScalar(1 + progress * 0.06);
  });

  if (!texture) return null;

  return (
    <group ref={groupRef} rotation={[0.04, 0, -0.03]}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          map={texture}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.28}
          side={THREE.DoubleSide}
          roughness={0.38}
          metalness={0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.22}
        />
      </mesh>
    </group>
  );
}

function ProjectorGlow() {
  const texture = useMemo(() => createGlowTexture(), []);

  useEffect(() => {
    return () => texture?.dispose();
  }, [texture]);

  if (!texture) return null;

  return (
    <mesh position={[0, 0, -2.4]}>
      <planeGeometry args={[12, 5]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.22}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function FilmTape({ label, tools, motion }: FilmTapeProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8.6], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 8]} intensity={1.7} />
      <directionalLight position={[-6, -1, 3]} intensity={0.5} />
      <directionalLight position={[0, 3, -6]} intensity={0.8} />
      <pointLight position={[0, 0, 4]} intensity={10} distance={14} decay={2} />
      <ProjectorGlow />
      <ProgramMonitor label={label} tools={tools} />
      <FilmStrip label={label} tools={tools} motion={motion} />
      <CameraRig motion={motion} />
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.42}
          luminanceThreshold={0.72}
          luminanceSmoothing={0.3}
          mipmapBlur
        />
        <Vignette offset={0.25} darkness={0.6} />
        <Noise opacity={0.035} premultiply />
      </EffectComposer>
    </Canvas>
  );
}
