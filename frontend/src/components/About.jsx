import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ScrollControls, useScroll, Html, Stars, Sparkles, Float, PerspectiveCamera, Cloud } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Award, Zap, Code, Database, Rocket, Cpu } from 'lucide-react';

// --- Configuration ---
const PRIMARY_COLOR = '#00f3ff';   // Neon Cyan
const SECONDARY_COLOR = '#0066ff'; // Electric Blue
const ACCENT_COLOR = '#ff0055';    // Warning/Action
const BG_COLOR = '#000000';
const STEPS = 8;

// --- Data with "Certificates" ---
const ROADMAP_DATA = [
    {
        t: 0.08,
        phase: "CERTIFICATION_01",
        title: "Frontend Foundations",
        desc: "Mastered the core building blocks of the web. Responsive design principles and semantic HTML5 architecture.",
        tags: ["HTML5", "CSS3", "Responsive UI"],
        icon: <Code size={24} />,
        color: PRIMARY_COLOR,
        img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.25,
        phase: "CERTIFICATION_02",
        title: "Advanced JavaScript",
        desc: "Deep dive into ES6+, asynchronous programming, closures, and modern DOM manipulation techniques.",
        tags: ["ES6+", "Async/Await", "DOM"],
        icon: <Zap size={24} />,
        color: "#facc15",
        img: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.42,
        phase: "CERTIFICATION_03",
        title: "React Architecture",
        desc: "Component-based design, state management with Hooks/Context, and Single Page Application routing.",
        tags: ["React 18", "Hooks", "Redux"],
        icon: <Cpu size={24} />,
        color: SECONDARY_COLOR,
        img: "https://images.unsplash.com/photo-1633356122102-3fe601e19153?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.58,
        phase: "CERTIFICATION_04",
        title: "Python Data Structures",
        desc: "Algorithmic problem solving, time complexity analysis, and data structure implementation in Python.",
        tags: ["Python", "DSA", "Algorithms"],
        icon: <Database size={24} />,
        color: "#10b981", // Emerald
        img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.75,
        phase: "CERTIFICATION_05",
        title: "Full Stack Systems",
        desc: "End-to-end application development. RESTful API design, database integration, and secure authentication.",
        tags: ["Node.js", "MongoDB", "Auth"],
        icon: <Rocket size={24} />,
        color: "#a855f7", // Purple
        img: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=300&auto=format&fit=crop"
    },
    {
        t: 0.95,
        phase: "VISION_2026",
        title: "Future Architect",
        desc: "Designing scalable cloud-native systems and exploring next-gen AI integration patterns.",
        tags: ["System Design", "Cloud", "AI"],
        icon: <Award size={24} />,
        color: "#ffffff",
        img: "https://images.unsplash.com/photo-1535378437803-dbfe5d034688?q=80&w=300&auto=format&fit=crop"
    }
];

// --- Sub-Components ---

function WarpParticles() {
    const mesh = useRef();
    useFrame(() => {
        mesh.current.rotation.z += 0.001; // Slow swirl
    });
    return (
        <group ref={mesh}>
            {/* Drift Particles */}
            <Sparkles count={300} scale={[20, 20, 100]} size={2} speed={0.4} opacity={0.5} noise={0.2} color="#ffffff" />
            {/* Distant Nebula Fog */}
            <Cloud opacity={0.05} speed={0.1} width={50} depth={5} segments={10} position={[0, -10, -50]} color="#001133" />
        </group>
    );
}

function GridRoad({ curve }) {
    const ref = useRef();
    const texture = useMemo(() => {
        const t = new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/grid.png');
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.repeat.set(50, 4);
        return t;
    }, []);

    useFrame(() => {
        if (ref.current) ref.current.map.offset.x -= 0.05; // High speed effect
    });

    const geometry = useMemo(() => new THREE.TubeGeometry(curve, 150, 4, 16, false), [curve]);

    return (
        <mesh geometry={geometry} receiveShadow castShadow>
            <meshStandardMaterial
                ref={ref}
                map={texture}
                color="#000000"
                emissive={PRIMARY_COLOR}
                emissiveIntensity={0.5}
                roughness={0.1}
                metalness={0.9}
                transparent
                opacity={0.6}
            />
        </mesh>
    );
}

function HolographicCards({ curve }) {
    const scroll = useScroll();
    const [active, setActive] = useState(null);

    useFrame(() => {
        const offset = scroll.offset;
        let nearest = null;
        let minDist = 0.06;

        ROADMAP_DATA.forEach((item, index) => {
            if (Math.abs(offset - item.t) < minDist) nearest = index;
        });

        if (nearest !== active) setActive(nearest);
    });

    return (
        <group>
            {ROADMAP_DATA.map((item, index) => {
                const point = curve.getPoint(item.t);
                const isActive = index === active;

                return (
                    <group key={index} position={point}>
                        {/* 3D Marker - Floating Crystal */}
                        <Float speed={4} rotationIntensity={0.5} floatIntensity={1}>
                            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                                <boxGeometry args={[1, 1, 1]} />
                                <meshPhysicalMaterial
                                    color={isActive ? item.color : '#333'}
                                    emissive={isActive ? item.color : '#000'}
                                    emissiveIntensity={isActive ? 2 : 0}
                                    transmission={1}
                                    thickness={0.5}
                                    roughness={0}
                                />
                            </mesh>
                        </Float>

                        {/* Connection Line */}
                        {isActive && (
                            <mesh position={[4, 1, 0]} rotation={[0, 0, Math.PI / 2]}>
                                <cylinderGeometry args={[0.02, 0.02, 6, 8]} />
                                <meshBasicMaterial color={item.color} transparent opacity={0.5} />
                            </mesh>
                        )}

                        {/* Glassmorphism UI Card */}
                        <Html
                            position={[7, 1, 0]} // Offset to the right
                            center
                            transform
                            occlude
                            distanceFactor={10}
                            style={{
                                opacity: isActive ? 1 : 0,
                                transform: `scale(${isActive ? 1 : 0.9})`,
                                transition: 'all 0.6s cubic-bezier(0.19, 1, 0.22, 1)',
                                pointerEvents: 'none'
                            }}
                        >
                            <div className="w-[450px] font-sans antialiased text-left">
                                {/* The Card Container */}
                                <div className={`
                                    relative overflow-hidden rounded-3xl p-[1px]
                                    bg-gradient-to-br from-white/20 via-white/5 to-transparent
                                    backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)]
                                `}>
                                    {/* Inner Content Content */}
                                    <div className="bg-black/40 rounded-3xl p-6 h-full relative z-10">

                                        {/* Header: Badge & Icon */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="bg-white/10 border border-white/10 rounded-full px-3 py-1 flex items-center gap-2 backdrop-blur-md">
                                                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color }} />
                                                <span className="text-[10px] font-bold tracking-widest text-white/90 uppercase">{item.phase}</span>
                                            </div>
                                            <div className="text-white/80 p-2 bg-white/5 rounded-full">
                                                {item.icon}
                                            </div>
                                        </div>

                                        {/* Title & Desc */}
                                        <h2 className="text-3xl font-medium text-white mb-3 tracking-tight">
                                            {item.title}
                                        </h2>
                                        <p className="text-sm text-gray-300 leading-relaxed mb-6 font-light">
                                            {item.desc}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {item.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-medium text-white/70 bg-white/5 px-2 py-1 rounded border border-white/5">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Certificate Preview/Footer */}
                                        <div className="mt-auto pt-4 border-t border-white/10 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
                                                {/* Placeholder for certificate image */}
                                                <img src={item.img} alt="cert" className="w-full h-full object-cover opacity-80" />
                                            </div>
                                            <div>
                                                <div className="text-xs text-white/50 uppercase tracking-widest mb-0.5">Verified Credential</div>
                                                <div className="text-sm text-white font-medium">View Certificate ↗</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Glow Effects */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                                </div>
                            </div>
                        </Html>
                    </group>
                );
            })}
        </group>
    );
}

function CameraRig({ curve }) {
    const scroll = useScroll();
    const { camera } = useThree();
    const vec = useMemo(() => new THREE.Vector3(), []);
    const lookAt = useMemo(() => new THREE.Vector3(), []);

    useFrame((state) => {
        const t = scroll.offset;
        const point = curve.getPoint(t);
        const nextPoint = curve.getPoint(Math.min(1, t + 0.05));

        // Position: "Chase Cam" - slightly above and behind current point? 
        // Or "Cockpit" - exactly on point? 
        // Let's go slightly above to see the road
        vec.copy(point).y += 2;

        // Add subtle sway
        const swayX = Math.sin(state.clock.elapsedTime * 0.5) * 0.5;
        const swayY = Math.cos(state.clock.elapsedTime * 0.3) * 0.2;
        const targetPos = vec.clone();
        targetPos.x += swayX;
        targetPos.y += swayY;

        // Smooth follow
        camera.position.lerp(targetPos, 0.08); // 0.08 damping

        // Look At target
        lookAt.copy(nextPoint).y += 1; // Look forward and slightly up
        camera.lookAt(lookAt);
    });

    return null;
}

function Scene() {
    const curve = useMemo(() => {
        const points = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -50),
            new THREE.Vector3(20, 5, -100),
            new THREE.Vector3(40, 0, -150),
            new THREE.Vector3(0, -10, -220),
            new THREE.Vector3(-30, 0, -300),
            new THREE.Vector3(0, 10, -400)
        ];
        return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
    }, []);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 4, 10]} fov={60} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 20, 0]} intensity={2} color="#ffffff" distance={100} />

            <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <WarpParticles />

            <GridRoad curve={curve} />
            <HolographicCards curve={curve} />
            <CameraRig curve={curve} />
        </>
    );
}

export default function About() {
    return (
        <div className="w-full h-screen bg-[#000000]">
            <Canvas dpr={[1, 1.5]} gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}>
                <color attach="background" args={[BG_COLOR]} />
                <ScrollControls pages={STEPS} damping={0.2}>
                    <Scene />
                </ScrollControls>

                <EffectComposer disableNormalPass>
                    {/* Cinematic Bloom */}
                    <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} radius={0.5} />
                    <ChromeAberration />
                    <Noise opacity={0.05} />
                    <Vignette offset={0.3} darkness={0.7} />
                </EffectComposer>
            </Canvas>

            {/* UI Overlay - Static HUD */}
            <div className="absolute top-8 left-8 text-white/30 font-mono text-xs tracking-widest">
                <div>SYSTEM.STATUS: ONLINE</div>
                <div>RENDER_ENGINE: WEBGL.2</div>
            </div>
        </div>
    );
}

// Helper for EffectComposer
function ChromeAberration() {
    return <ChromaticAberration offset={[0.002, 0.002]} />
}
