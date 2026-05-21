import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Environment } from '@react-three/drei';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';
import { albumCubeConfig } from '../config';
import { useIsMobile } from '../hooks/use-mobile';

gsap.registerPlugin(ScrollTrigger);

interface CubeProps {
  rotationProgress: number;
}

const Cube = ({ rotationProgress }: CubeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const textures = useTexture(albumCubeConfig.cubeTextures);
  const cubeSize = Math.min(viewport.width * 0.55, viewport.height * 0.35, 3);

  useFrame(() => {
    if (meshRef.current) {
      const targetRotationY = rotationProgress * Math.PI * 2;
      const targetRotationX = Math.sin(rotationProgress * Math.PI) * 0.3;

      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        targetRotationY,
        0.1
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        targetRotationX,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[cubeSize, cubeSize, cubeSize]} />
      {textures.map((texture, index) => (
        <meshStandardMaterial
          key={index}
          attach={`material-${index}`}
          map={texture}
          roughness={0.2}
          metalness={0.1}
        />
      ))}
    </mesh>
  );
};

const AlbumCube = () => {
  if (albumCubeConfig.albums.length === 0 || albumCubeConfig.cubeTextures.length === 0) {
    return null;
  }

  const isMobile = useIsMobile();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [rotationProgress, setRotationProgress] = useState(0);
  const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
  const [blurAmount, setBlurAmount] = useState(0);
  const [letterSpacing, setLetterSpacing] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: isMobile ? '+=120%' : '+=300%',
      scrub: 1,
      pin: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const progress = self.progress;
        setRotationProgress(progress);

        const albumIndex = Math.min(
          Math.floor(progress * 4),
          albumCubeConfig.albums.length - 1
        );
        setCurrentAlbumIndex(albumIndex);

        const velocity = Math.abs(self.getVelocity());
        const blurCap = isMobile ? 4 : 8;
        const spacingCap = isMobile ? 12 : 30;
        const targetBlur = Math.min(velocity / 500, blurCap);
        const targetSpacing = Math.min(velocity / 100, spacingCap);

        setBlurAmount((prev) => prev + (targetBlur - prev) * 0.2);
        setLetterSpacing((prev) => prev + (targetSpacing - prev) * 0.2);
      },
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      st.kill();
    };
  }, [isMobile]);

  const currentAlbum = albumCubeConfig.albums[currentAlbumIndex];

  return (
    <section
      id="albums"
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] h-screen bg-void-black overflow-hidden"
    >
      <div
        ref={titleRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 px-4"
        style={{
          filter: `blur(${blurAmount}px)`,
          letterSpacing: `${letterSpacing}px`,
        }}
      >
        <h2 className="font-display text-[14vw] sm:text-[20vw] text-white/5 uppercase text-center select-none leading-none">
          {currentAlbum.subtitle}
        </h2>
      </div>

      <div className="absolute inset-0 z-10">
        <Canvas
          camera={{ position: [0, 0, isMobile ? 7 : 6], fov: isMobile ? 50 : 45 }}
          gl={{ antialias: true, alpha: true }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={0.5} color="#9DC4FF" />
            <pointLight position={[0, 0, 5]} intensity={0.5} color="#00D4FF" />
            <Cube rotationProgress={rotationProgress} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-auto z-20 max-w-[calc(100vw-2rem)]">
        <p className="font-mono-custom text-[10px] sm:text-xs text-neon-soft/60 uppercase tracking-wider mb-1 sm:mb-2">
          {String(currentAlbum.id).padStart(2, '0')} / {String(albumCubeConfig.albums.length).padStart(2, '0')}
        </p>
        <h3 className="font-display text-3xl sm:text-5xl md:text-7xl text-white mb-1 transition-all duration-300 leading-tight">
          {currentAlbum.title}
        </h3>
        <p className="font-mono-custom text-xs sm:text-sm text-white/50 line-clamp-2">
          {currentAlbum.subtitle}
        </p>
      </div>

      <div className="absolute bottom-4 right-4 sm:bottom-12 sm:right-12 z-20 flex sm:flex-col items-center sm:items-stretch gap-2 sm:gap-3">
        {albumCubeConfig.albums.map((album, index) => (
          <div
            key={album.id}
            className={`rounded-full transition-all duration-300 ${
              index === currentAlbumIndex
                ? 'bg-neon-cyan w-6 h-2 sm:w-2 sm:h-8'
                : 'bg-white/20 w-2 h-2'
            }`}
          />
        ))}
      </div>

      <p className="hidden sm:block absolute bottom-12 right-12 z-20 font-mono-custom text-xs text-white/40 uppercase tracking-wider">
        {albumCubeConfig.scrollHint}
      </p>

      <div className="hidden sm:block absolute top-12 left-12 w-20 h-px bg-gradient-to-r from-neon-cyan/50 to-transparent" />
      <div className="hidden sm:block absolute top-12 left-12 w-px h-20 bg-gradient-to-b from-neon-cyan/50 to-transparent" />
    </section>
  );
};

export default AlbumCube;
