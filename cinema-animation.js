/* ═══════════════════════════════════════════════════════
   CINEMA ANIMATION — Standalone 3D Particle Engine
   Adapted for & CONTI website (conti-comigo-main)
   ═══════════════════════════════════════════════════════ */
(() => {
    'use strict';

    // ═══════════════════════════════════════════
    //  CONFIGURATION
    // ═══════════════════════════════════════════
    const CONFIG = {
        ASSEMBLE_DURATION: 0.15,
        HOLD_DURATION: 0.45,
        FOCAL_LENGTH: 1200,
        SHARD_COUNT: 1800,
        IA_TEXT: "I A"
    };

    const canvas = document.getElementById('cinema-canvas');
    if (!canvas) return; // Safety: don't run if canvas not found
    const ctx = canvas.getContext('2d');
    const steps = document.querySelectorAll('.step-section');
    if (!steps.length) return; // Safety: don't run if no step sections

    let W, H;
    const cameraZ = 1000;
    const centerOffset = { x: 0, y: 0 };

    function updateLayout() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;

        if (W > 900) {
            centerOffset.x = W * 0.22;
            centerOffset.y = 0;
        } else {
            centerOffset.x = 0;
            centerOffset.y = 0; // Centralizado verticalmente no mobile
        }
    }

    // ═══════════════════════════════════════════
    //  GEOMETRIES
    // ═══════════════════════════════════════════
    const Geometries = {
        cloud: () => ({
            x: (Math.random() - 0.5) * (W * 0.5 + 400),
            y: (Math.random() - 0.5) * (H * 0.5 + 400),
            z: (Math.random() - 0.5) * 600
        }), // More compact initial state
        iphone: () => {
            const r = Math.random();
            const w = 340, h = 680, rad = 50; // Main dimensions

            // 45% Boundary (Rounded Rectangle Frame)
            if (r < 0.45) {
                const step = Math.random() * (2 * (w + h));
                let x, y;
                if (step < w) { x = step - w / 2; y = -h / 2; }
                else if (step < w + h) { x = w / 2; y = (step - w) - h / 2; }
                else if (step < 2 * w + h) { x = w / 2 - (step - (w + h)); y = h / 2; }
                else { x = -w / 2; y = h / 2 - (step - (2 * w + h)); }

                // Slight rounding effect logic
                const cornerDist = 40;
                if (Math.abs(x) > w / 2 - cornerDist && Math.abs(y) > h / 2 - cornerDist) {
                    // Just keep it square-ish for performance or add arc logic if needed
                    // Adding simple depth
                }
                return { x, y, z: (Math.random() - 0.5) * 40 };
            }

            // 35% Inner Screen (Bezel)
            if (r < 0.8) {
                const sw = w - 40, sh = h - 140;
                return {
                    x: (Math.random() - 0.5) * sw,
                    y: (Math.random() - 0.5) * sh - 10,
                    z: 5
                };
            }

            // 10% Home Button (Circle at bottom)
            if (r < 0.9) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 35;
                return {
                    x: Math.cos(angle) * dist,
                    y: h / 2 - 60,
                    z: 10
                };
            }

            // 10% Top Speaker & Details
            return {
                x: (Math.random() - 0.5) * 80,
                y: -h / 2 + 50,
                z: 10
            };
        },
        bulb: () => {
            const r = Math.random();
            const headR = 180;

            // 60% Glass Head (Sphere)
            if (r < 0.6) {
                const u = Math.random() * Math.PI * 2;
                const v = Math.random() * Math.PI;
                return {
                    x: headR * Math.sin(v) * Math.cos(u),
                    y: headR * Math.sin(v) * Math.sin(u) - 100,
                    z: headR * Math.cos(v)
                };
            }

            // 30% Base (Cylinder)
            if (r < 0.9) {
                const h = 120;
                const t = Math.random();
                const y = t * h + 80;
                const radius = 60;
                const angle = Math.random() * Math.PI * 2;
                return { x: Math.cos(angle) * radius, y: y, z: Math.sin(angle) * radius };
            }

            // 10% Filament (Center line)
            return { x: 0, y: (Math.random() - 0.5) * 100 - 80, z: 0 };
        },
        penTool: () => {
            const r = Math.random();
            const size = 450;
            const handleLen = 220;

            // 20% Main Anchor Point (Square in the middle)
            if (r < 0.20) {
                const s = 40;
                return {
                    x: (Math.random() - 0.5) * s,
                    y: (Math.random() - 0.5) * s,
                    z: 10
                };
            }

            // 30% Tangent Handles (Two straight lines)
            if (r < 0.50) {
                const side = Math.random() > 0.5 ? 1 : -1;
                const t = Math.random();
                // Angled handles
                const angle = -Math.PI / 6 * side;
                return {
                    x: Math.cos(angle) * (t * handleLen) * side,
                    y: Math.sin(angle) * (t * handleLen) * side,
                    z: 0
                };
            }

            // 15% Control Points (Little squares at ends of handles)
            if (r < 0.65) {
                const side = Math.random() > 0.5 ? 1 : -1;
                const angle = -Math.PI / 6 * side;
                const s = 25;
                return {
                    x: Math.cos(angle) * handleLen * side + (Math.random() - 0.5) * s,
                    y: Math.sin(angle) * handleLen * side + (Math.random() - 0.5) * s,
                    z: 5
                };
            }

            // 35% Bezier Curve Segments (Two arcs)
            const side = Math.random() > 0.5 ? 1 : -1;
            const p = Math.random(); // Progress along curve
            // Simple Quadratic Bezier approximation for the shard target
            // P0=(0,0), P1=(side*150, -200), P2=(side*300, 50)
            const x = (1 - p) * (1 - p) * 0 + 2 * (1 - p) * p * (side * 150) + p * p * (side * 300);
            const y = (1 - p) * (1 - p) * 0 + 2 * (1 - p) * p * (-250) + p * p * (100);

            return { x, y, z: -10 };
        },
        camera: () => {
            const r = Math.random();
            // 50% Body (Larger Box)
            if (r < 0.5) {
                const w = 340, h = 240, d = 80;
                return {
                    x: (Math.random() - 0.5) * w,
                    y: (Math.random() - 0.5) * h,
                    z: (Math.random() - 0.5) * d
                };
            }
            // 30% Lens (Larger Cylinder)
            if (r < 0.8) {
                const angle = Math.random() * Math.PI * 2;
                const rad = 95; // Bigger lens
                const len = 100;
                return {
                    x: Math.cos(angle) * rad,
                    y: Math.sin(angle) * rad,
                    z: 60 + Math.random() * len
                };
            }
            // 20% Flash / Buttons
            const isFlash = Math.random() > 0.5;
            if (isFlash) {
                // Flash Box
                return {
                    x: 120 + Math.random() * 50,
                    y: -140 - Math.random() * 30,
                    z: (Math.random() - 0.5) * 50
                };
            } else {
                // Shutter Button
                return {
                    x: -120 + Math.random() * 40,
                    y: -130 - Math.random() * 20,
                    z: 0
                };
            }
        },
        rocket: () => {
            const r = Math.random();
            const bodyW = 140;
            const bodyH = 340;

            // 50% Main Body (Cylindrical/Bullet shape)
            if (r < 0.5) {
                const angle = Math.random() * Math.PI * 2;
                const h = (Math.random() - 0.5) * bodyH;
                const rad = 60 + (1 - Math.abs(h) / (bodyH / 2)) * 20; // Taper top/bottom
                return {
                    x: Math.cos(angle) * rad,
                    y: h,
                    z: Math.sin(angle) * rad
                };
            }

            // 30% Fins (3 fins at bottom)
            if (r < 0.8) {
                const finId = Math.floor(Math.random() * 3);
                const angle = (finId * Math.PI * 2) / 3;
                const dist = 70 + Math.random() * 60;
                const h = bodyH / 2 - Math.random() * 80;
                return {
                    x: Math.cos(angle) * dist,
                    y: h,
                    z: Math.sin(angle) * dist
                };
            }

            // 20% Window / Exhaust
            const angle = Math.random() * Math.PI * 2;
            return {
                x: Math.cos(angle) * 30,
                y: -bodyH / 2 + Math.random() * 40 - 20, // Window near top
                z: Math.sin(angle) * 30 + 10
            };
        },
        mediaControls: () => {
            const r = Math.random();
            const playSize = 250;
            const pauseBarW = 75;
            const pauseBarGap = 60;
            const pauseTotalW = pauseBarW * 2 + pauseBarGap;
            const centerGap = 120; // Espaço entre os ícones

            const totalW = pauseTotalW + centerGap + playSize;
            const startX = -totalW / 2; // Início à esquerda para centralização

            // 50% Pause Bars (LADO ESQUERDO)
            if (r < 0.5) {
                const barId = Math.random() > 0.5 ? 0 : 1;
                const xInBar = (Math.random() - 0.5) * pauseBarW;
                const yInBar = (Math.random() - 0.5) * 320;
                const barX = startX + (barId === 0 ? pauseBarW / 2 : pauseTotalW - pauseBarW / 2);
                return {
                    x: barX + xInBar,
                    y: yInBar,
                    z: 0
                };
            }

            // 50% Play Triangle (LADO DIREITO + Apontando para DIREITA)
            const playStartX = startX + pauseTotalW + centerGap;
            const u = Math.random(); // 0 (base) to 1 (tip)
            const yRange = (1 - u); // Afunila para a ponta
            const v = (Math.random() - 0.5) * yRange;

            return {
                x: playStartX + u * playSize,
                y: v * playSize * 1.5,
                z: 0
            };
        },
        target: () => {
            const r = Math.random();

            // 80% Concentric Rings
            if (r < 0.8) {
                const ringId = Math.floor(Math.random() * 3);
                const radii = [100, 200, 300];
                const angle = Math.random() * Math.PI * 2;
                const radius = radii[ringId] + (Math.random() - 0.5) * 5;
                return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 };
            }

            // 20% Crosshair
            const side = Math.random() > 0.5;
            const t = (Math.random() - 0.5) * 700;
            return { x: side ? t : 0, y: side ? 0 : t, z: 10 };
        },
        atom: () => {
            const r = Math.random();
            const size = 300;
            const orbitR = 300;
            const electronR = 40;

            // 70% Three Elliptical Orbits
            if (r < 0.7) {
                const ringId = Math.floor(Math.random() * 3);
                const angle = Math.random() * Math.PI * 2;
                const tilt = ringId * (Math.PI / 3); // 60 degrees rotation

                let x = Math.cos(angle) * orbitR;
                let y = Math.sin(angle) * orbitR * 0.4; // Flattened for elliptical look
                let z = 0;

                // Rotate coordinates based on ringId
                const rx = x * Math.cos(tilt) - y * Math.sin(tilt);
                const ry = x * Math.sin(tilt) + y * Math.cos(tilt);

                return { x: rx, y: ry, z: (Math.random() - 0.5) * 20 };
            }

            // 30% Electrons (Spheres on the orbits)
            const electronPos = [0, Math.PI * 0.6, Math.PI * 1.2, Math.PI * 1.8];
            const eId = Math.floor(Math.random() * electronPos.length);
            const orbitId = Math.floor(Math.random() * 3);
            const tilt = orbitId * (Math.PI / 3);

            const baseAngle = electronPos[eId];
            const ex = Math.cos(baseAngle) * orbitR;
            const ey = Math.sin(baseAngle) * orbitR * 0.4;

            // Sphere distribution around the electron point
            const u = Math.random() * Math.PI * 2;
            const v = Math.random() * Math.PI;
            const rad = electronR * Math.pow(Math.random(), 0.5);

            let lx = ex + rad * Math.sin(v) * Math.cos(u);
            let ly = ey + rad * Math.sin(v) * Math.sin(u);
            let lz = rad * Math.cos(v);

            // Final Rotation
            const frx = lx * Math.cos(tilt) - ly * Math.sin(tilt);
            const fry = lx * Math.sin(tilt) + ly * Math.cos(tilt);

            return { x: frx, y: fry, z: lz };
        },
        logo: (targetPts) => {
            if (targetPts && targetPts.length) {
                const p = targetPts[Math.floor(Math.random() * targetPts.length)];
                return { x: p.x, y: p.y, z: 0, isLogo: true };
            }
            return { x: 0, y: 0, z: 0 };
        },
        iaText: (iaPts) => {
            if (iaPts && iaPts.length) {
                const p = iaPts[Math.floor(Math.random() * iaPts.length)];
                return { x: p.x, y: p.y, z: 0 };
            }
            return { x: 0, y: 0, z: 0 };
        },
        megaphone: () => {
            const r = Math.random();
            const L = 320;
            const minR = 40;
            const maxR = 180;

            // 60% Conical Shell (Profile view along X axis)
            if (r < 0.6) {
                const t = Math.random(); // 0 to 1 along length
                const angle = Math.random() * Math.PI * 2;
                const radius = minR + t * (maxR - minR);
                return {
                    x: t * L - L / 2,
                    y: Math.cos(angle) * radius,
                    z: Math.sin(angle) * radius
                };
            }
            // 15% Handle (Vertical box at the back)
            if (r < 0.75) {
                return {
                    x: -L / 2 + Math.random() * 60,
                    y: Math.random() * 120,
                    z: (Math.random() - 0.5) * 40
                };
            }
            // 10% Back cap
            if (r < 0.85) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * minR;
                return { x: -L / 2, y: Math.cos(angle) * dist, z: Math.sin(angle) * dist };
            }
            // 15% Sound Waves (Arcs in front)
            const waveId = Math.floor(Math.random() * 3);
            const waveDist = L / 2 + 40 + waveId * 60;
            const waveAngle = (Math.random() - 0.5) * Math.PI * 0.6; // Arc
            const spread = 1.2;
            return {
                x: waveDist + Math.random() * 10,
                y: Math.sin(waveAngle) * waveDist * spread,
                z: Math.cos(waveAngle) * waveDist * 0.2 // Slight depth
            };
        },
        aiChip: () => {
            const r = Math.random();
            const size = 420;

            // 60% Chip Square (Grid-like texture)
            if (r < 0.6) {
                // Focus on edges and a few internal grid lines
                if (Math.random() > 0.4) {
                    const isX = Math.random() > 0.5;
                    const gridPos = (Math.round(Math.random() * 8) / 8 - 0.5) * size;
                    const vary = (Math.random() - 0.5) * size;
                    return { x: isX ? gridPos : vary, y: isX ? vary : gridPos, z: 0 };
                }
                return {
                    x: (Math.random() - 0.5) * size,
                    y: (Math.random() - 0.5) * size,
                    z: 5
                };
            }
            // 40% Connection Pins (Protruding lines)
            const side = Math.floor(Math.random() * 4);
            const t = (Math.random() - 0.5) * (size * 0.8);
            const pinLen = 120;
            const depth = (Math.random() - 0.5) * 20;
            if (side === 0) return { x: -size / 2 - Math.random() * pinLen, y: t, z: depth };
            if (side === 1) return { x: size / 2 + Math.random() * pinLen, y: t, z: depth };
            if (side === 2) return { x: t, y: -size / 2 - Math.random() * pinLen, z: depth };
            return { x: t, y: size / 2 + Math.random() * pinLen, z: depth };
        },
        stories: () => {
            // Simplified Instagram Stories layout (Portrait rect)
            const r = Math.random();
            const w = 320, h = 560;
            if (r < 0.5) {
                const edge = Math.floor(Math.random() * 4);
                let x, y;
                if (edge === 0) { x = (Math.random() - 0.5) * w; y = -h / 2; }
                else if (edge === 1) { x = w / 2; y = (Math.random() - 0.5) * h; }
                else if (edge === 2) { x = (Math.random() - 0.5) * w; y = h / 2; }
                else { x = -w / 2; y = (Math.random() - 0.5) * h; }
                return { x, y, z: 0 };
            }
            // Inner circle for profile
            if (r < 0.65) {
                const a = Math.random() * Math.PI * 2;
                return { x: Math.cos(a) * 40 - 80, y: -h / 2 + 60, z: 10 };
            }
            // 35% Pen (Thin cylinder on the right)
            const penX = w / 2 + 30;
            const t = Math.random();
            const angle = Math.random() * Math.PI * 2;
            const rad = 6;
            return {
                x: penX + Math.cos(angle) * rad,
                y: -h / 2 + 100 + t * (h - 200),
                z: Math.sin(angle) * rad
            };
        },
        drone: () => {
            const r = Math.random();
            const armW = 350; // Total horizontal span

            // 20% Central Body (Rounded core)
            if (r < 0.20) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 80;
                return {
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist - 20,
                    z: (Math.random() - 0.5) * 80
                };
            }

            // 20% Horizontal Arms (Profile view)
            if (r < 0.40) {
                const side = Math.random() > 0.5 ? 1 : -1;
                const px = side * (80 + Math.random() * (armW - 80));
                const py = -40 + (Math.random() - 0.5) * 20;
                return { x: px, y: py, z: (Math.random() - 0.5) * 20 };
            }

            // 15% Gimbal & Camera (Hanging below)
            if (r < 0.55) {
                if (Math.random() > 0.4) {
                    // Camera lens/box
                    return {
                        x: (Math.random() - 0.5) * 60,
                        y: 80 + (Math.random() - 0.5) * 60,
                        z: 40
                    };
                } else {
                    // Gimbal neck
                    return { x: (Math.random() - 0.5) * 20, y: 30 + Math.random() * 50, z: 10 };
                }
            }

            // 25% Heavy Landing Gear (Robust Trapezoidal Structure)
            if (r < 0.70) {
                const side = Math.random() > 0.5 ? 1 : -1;
                const gearR = Math.random();

                if (gearR < 0.7) {
                    // Main Struts (Thicker, angled)
                    const t = Math.random();
                    const x = side * (40 + t * 90);
                    const y = -10 + t * 180;
                    // Add significant girth to the struts
                    const offset = (Math.random() - 0.5) * 25; // Thickened legs
                    return { x: x + offset, y: y, z: (Math.random() - 0.5) * 45 };
                } else {
                    // Heavy Skids (Shorter base as requested)
                    const t = Math.random();
                    const x = side * (100 + t * 60); // Centered and shrunk skids
                    const y = 175 + (Math.random() - 0.5) * 15; // Solid footing
                    return { x: x, y: y, z: (Math.random() - 0.5) * 60 };
                }
            }

            // 30% Rotors & Spinning Propellers
            const side = Math.random() > 0.5 ? 1 : -1;
            const rx = side * armW;
            const ry = -60;
            const rotorId = side === 1 ? 0 : 1;

            if (Math.random() > 0.4) {
                // Motor/Rotor Base
                return { x: rx + (Math.random() - 0.5) * 40, y: ry + Math.random() * 40, z: 0 };
            } else {
                // Propeller Blades (Animated)
                const dist = (Math.random() - 0.5) * 180;
                return {
                    x: rx + dist,
                    y: ry,
                    z: 20,
                    rotorX: rx,
                    rotorY: ry,
                    isPropeller: true,
                    rotorId: rotorId
                };
            }
        }
    };

    // ═══════════════════════════════════════════
    //  LOGO SAMPLING
    // ═══════════════════════════════════════════
    let logoPoints = [];
    let iaPoints = [];
    function sampleTexts() {
        const off = document.createElement('canvas');
        const ox = off.getContext('2d');

        // 1. Sample LOGO
        let tw = W > 1200 ? 1800 : 1200;
        off.width = tw; off.height = 600;
        let fs = tw > 1400 ? 280 : 160;
        ox.font = `900 ${fs}px 'Outfit', sans-serif`;
        ox.textAlign = "center";
        ox.textBaseline = "middle";
        ox.fillStyle = "black";
        ox.fillText("& CONTI", tw / 2, 300);

        let data = ox.getImageData(0, 0, tw, 600).data;
        let pts = [];
        let step = 3;
        for (let y = 0; y < 600; y += step) {
            for (let x = 0; x < tw; x += step) {
                if (data[(y * tw + x) * 4 + 3] > 80) { // Increased density
                    pts.push({ x: x - tw / 2, y: y - 300 });
                }
            }
        }
        logoPoints = pts;

        // 2. Sample "I A"
        ox.clearRect(0, 0, tw, 600);
        fs = tw > 1400 ? 500 : 350; // Bigger letters for IA
        ox.font = `900 ${fs}px 'Outfit', sans-serif`;
        ox.fillText(CONFIG.IA_TEXT, tw / 2, 300);
        data = ox.getImageData(0, 0, tw, 600).data;
        pts = [];
        for (let y = 0; y < 600; y += step) {
            for (let x = 0; x < tw; x += step) {
                if (data[(y * tw + x) * 4 + 3] > 80) { // Increased density
                    pts.push({ x: x - tw / 2, y: y - 300 });
                }
            }
        }
        iaPoints = pts;
    }

    // ═══════════════════════════════════════════
    //  SHARD CLASS
    // ═══════════════════════════════════════════
    class Shard {
        constructor() {
            this.targets = [];

            // Larger particles on mobile for visibility
            const sizeBase = (W < 900) ? 2.5 : 3;
            const sizeVar = (W < 900) ? 3.5 : 5;
            this.size = sizeBase + Math.random() * sizeVar;

            const dice = Math.random();
            if (dice > 0.6) this.color = [15, 23, 42];  // Slate-900 (Deep Black)
            else if (dice > 0.3) this.color = [30, 41, 59]; // Slate-800 (Dark Gray)
            else this.color = [51, 65, 85]; // Slate-700 (Steel Gray)

            this.junk = {
                x: (Math.random() - 0.5) * W * 3,
                y: (Math.random() - 0.5) * H * 3,
                z: (Math.random() - 0.5) * 1500
            };
            this.phase = Math.random() * Math.PI * 2;
        }

        generateAllTargets() {
            this.targets = [
                // 0. Intro (Cloud)
                Geometries.cloud(),
                // 1. REDES SOCIAIS -> Megaphone
                Geometries.megaphone(),
                // 2. CONTEÚDO -> Stories (New mapping)
                Geometries.stories(),
                // 3. AUDIOVISUAL -> Camera (Swapped)
                Geometries.camera(),
                // 4. EVENTOS -> Play/Pause (Swapped)
                Geometries.mediaControls(),
                // 5. TRÁFEGO -> Target
                Geometries.target(),
                // 6. BRANDING -> Atom
                Geometries.atom(),
                // 7. SITES -> iPhone
                Geometries.iphone(),
                // 8. DRONE -> Drone
                Geometries.drone(),
                // 9. Final Reveal -> Logo
                Geometries.logo(logoPoints)
            ];
            this.junk = {
                x: (Math.random() - 0.5) * W * 3,
                y: (Math.random() - 0.5) * H * 3,
                z: (Math.random() - 0.5) * 1500
            };
        }

        draw(ctx, fStep, time) {
            const idx = Math.floor(fStep);
            const t = fStep - idx;

            let T1 = this.targets[idx] || this.junk;
            let T2 = this.targets[idx + 1] || this.targets[idx];

            let ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            let lx = T1.x + (T2.x - T1.x) * ease;
            let ly = T1.y + (T2.y - T1.y) * ease;
            let lz = T1.z + (T2.z - T1.z) * ease;

            // --- ANIMATION OVERRIDE: Spinning Propellers ---
            // Rotate only if both T1 and T2 are propellers (keeps spinning during hold, stops during move to non-propeller)
            if (T1.isPropeller && T2.isPropeller) {
                const rx = T1.rotorX;
                const ry = T1.rotorY;
                const rID = T1.rotorId;

                const relX = lx - rx;
                const relY = ly - ry;

                const speed = 12.0;
                const dir = (rID === 0 || rID === 2) ? 1 : -1;
                const angle = time * speed * dir;

                const cosA = Math.cos(angle);
                const sinA = Math.sin(angle);

                lx = rx + (relX * cosA - relY * sinA);
                ly = ry + (relX * sinA + relY * cosA);
            }
            // -----------------------------------------------

            let explosion = 0;
            // Calmed explosion for a more "solid" feel during transitions
            if (idx >= 0 && idx < 8) {
                explosion = Math.sin(Math.PI * t) * 0.4; // Cap explosion scatter at 40%
                explosion = Math.pow(explosion, 0.5);
            }

            const x = lx * (1 - explosion) + this.junk.x * explosion;
            const y = ly * (1 - explosion) + this.junk.y * explosion;
            const z = lz * (1 - explosion) + this.junk.z * explosion;

            let noiseAmp = 0;
            if (t > 0.05 && t < 0.95) noiseAmp = Math.sin(t * Math.PI) * 70; // Halved noise for stability

            const nx = x + Math.cos(this.phase + time) * noiseAmp;
            const ny = y + Math.sin(this.phase + time) * noiseAmp;
            const nz = z + Math.sin(this.phase * 2.5) * noiseAmp;

            // Mobile scaling for objects (Increased for better visibility)
            const objScale = (W < 900) ? 0.85 : 1.0;
            const scale = (CONFIG.FOCAL_LENGTH / (CONFIG.FOCAL_LENGTH + nz + cameraZ)) * objScale;

            let curOffset = centerOffset.x;

            // CONSOLIDATED ALIGNMENT LOGIC
            if (idx === 0) {
                // 0. Intro -> Marketing: Move from center to side
                curOffset = centerOffset.x * ease;
            } else if (idx === 8) {
                // 8. Drone -> Logo: Move from side back to center
                curOffset = centerOffset.x * (1 - ease);
            } else if (idx >= 9) {
                // 9. Logo Reveal: Permanent center
                curOffset = 0;
            } else {
                // 1-7. Services: Stay on side, but "gather" in center during the flip transition
                const centerBias = Math.sin(Math.PI * t);
                curOffset = centerOffset.x * (1 - centerBias);
            }

            const px = (W / 2 + curOffset) + nx * scale;
            const py = (H / 2 + centerOffset.y) + ny * scale;
            const rot = this.phase + time + t * 4;

            if (scale > 0 && px > -W && px < W * 2 && py > -H && py < H * 2) {
                ctx.save();
                ctx.translate(px, py);
                ctx.scale(scale * this.size, scale * this.size);
                ctx.rotate(rot);
                const alpha = (W < 900) ? 0.8 : 0.7; // Brighter and more solid on mobile
                ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${alpha})`;

                // Draw as sharp Digital Dust (Small precise squares)
                ctx.fillRect(-1, -1, 1.5, 1.5);
                ctx.restore();
            }
        }
    }

    function getFloatStep() {
        const scrollY = window.scrollY;
        const wrapper = document.getElementById('cinema-wrapper');
        if (!wrapper) return 0;
        const spacerH = wrapper.offsetTop;
        const stepH = steps[0].offsetHeight;

        // Intro Tease
        if (scrollY < spacerH) {
            const entryDistance = 800;
            if (scrollY < spacerH - entryDistance) return 0;
            const progress = 1 - ((spacerH - scrollY) / entryDistance);
            return progress * 0.1;
        }

        const relativeScroll = scrollY - spacerH;
        // Total steps = 8 service steps
        const totalServiceScroll = 8 * stepH;

        if (relativeScroll < totalServiceScroll) {
            const stepIndex = Math.floor(relativeScroll / stepH);
            const p = (relativeScroll % stepH) / stepH;
            const assembleTime = CONFIG.ASSEMBLE_DURATION;
            let currentHold = CONFIG.HOLD_DURATION;

            // CUSTOM: Drone (Step 7) stays on screen for much less time
            if (stepIndex === 7) currentHold = 0.2;

            let val = stepIndex;

            if (p < assembleTime) {
                const subP = p / assembleTime;
                const ease = subP * subP * (3 - 2 * subP);
                val = (stepIndex + 0.5) + ease * 0.5;
            } else if (p < assembleTime + currentHold) {
                val = stepIndex + 1;
            } else {
                const subP = (p - (assembleTime + currentHold)) / (1 - (assembleTime + currentHold));
                // CUSTOM: Drone transitions more aggressively towards Logo within its own section
                if (stepIndex === 7) {
                    val = 8.0 + subP * 0.7; // Reaches 8.7 (70% morph) before section ends
                } else {
                    const ease = subP * subP;
                    val = (stepIndex + 1) + ease * 0.5;
                }
            }
            return val;
        } else {
            // Final Section (Logo Assembly)
            const extraScroll = relativeScroll - totalServiceScroll;
            const logoScrollEnd = stepH * 0.2; // Super fast assembly (20% of a section height)
            const progress = Math.min(1.0, extraScroll / logoScrollEnd);

            // Continue from where Step 7 left off (8.7) to reach 9.0 (Logo) and beyond
            return 8.7 + progress * 0.8;
        }
    }

    // ═══════════════════════════════════════════
    //  INIT & LOOP
    // ═══════════════════════════════════════════
    let shards = [];
    function init() {
        updateLayout();
        sampleTexts();
        shards = [];
        const particleCount = (W < 900) ? 1200 : 2500; // Increased sample size for better definition

        setTimeout(() => {
            for (let i = 0; i < particleCount; i++) {
                const s = new Shard();
                s.generateAllTargets();
                shards.push(s);
            }
        }, 50);
    }

    let time = 0;
    function loop() {
        time += 0.02;
        ctx.clearRect(0, 0, W, H);
        const fStepRaw = getFloatStep();
        const fStep = Math.min(fStepRaw, 9.0); // 9 is the Logo reveal

        // Fade logic
        let globalAlpha = 1;
        if (fStepRaw < 0.8) {
            globalAlpha = fStepRaw / 0.8;
        } else if (fStepRaw > 9.8) {
            // Immediate fade out after logo reveal
            globalAlpha = Math.max(0, 1 - (fStepRaw - 9.8) * 10);
        }

        ctx.globalAlpha = globalAlpha;

        if (globalAlpha > 0) {
            canvas.style.display = 'block';
            shards.forEach(s => s.draw(ctx, fStep, time));
        } else {
            canvas.style.display = 'none';
        }

        // Content boxes opacity/transform
        steps.forEach((step) => {
            const box = step.querySelector('.content-box');
            if (!box) return;
            const boxRect = box.getBoundingClientRect();
            const viewH = window.innerHeight;

            const startReveal = viewH * 0.95;
            const endReveal = viewH * 0.60;
            let fadeP = Math.max(0, Math.min(1, (startReveal - boxRect.top) / (startReveal - endReveal)));

            const startFadeOut = viewH * 0.1;
            const endFadeOut = -viewH * 0.2;
            let fadeOutP = Math.max(0, Math.min(1, (boxRect.top - endFadeOut) / (startFadeOut - endFadeOut)));

            const totalAlpha = fadeP * fadeOutP;
            box.style.opacity = totalAlpha;
            box.style.transform = `translateY(${(1 - totalAlpha) * 80}px) scale(${0.95 + totalAlpha * 0.05})`;

            if (totalAlpha > 0.1) box.classList.add('visible');
            else box.classList.remove('visible');
        });

        requestAnimationFrame(loop);
    }

    // ═══════════════════════════════════════════
    //  EVENT LISTENERS
    // ═══════════════════════════════════════════
    window.addEventListener('resize', () => {
        updateLayout();
        sampleTexts();
        shards.forEach(s => s.generateAllTargets());
    });

    init();
    loop();
})();
