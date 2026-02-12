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
        SHARD_COUNT: 1800
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
            x: (Math.random() - 0.5) * (W * 1.5 + 1000),
            y: (Math.random() - 0.5) * (H * 1.5 + 800),
            z: (Math.random() - 0.5) * 1000
        }), // Widened distribution
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
        camera: () => {
            const r = Math.random();
            const bodyW = 500, bodyH = 320, bodyD = 120;

            // 50% Body (Structured)
            if (r < 0.5) {
                return {
                    x: (Math.random() - 0.5) * bodyW,
                    y: (Math.random() - 0.5) * bodyH,
                    z: (Math.random() - 0.5) * bodyD
                };
            }

            // 35% Lens (Advanced Concentric Rings)
            if (r < 0.85) {
                const ringId = Math.floor(Math.random() * 3);
                const angle = Math.random() * Math.PI * 2;
                const ringRadii = [60, 100, 130];
                const radius = ringRadii[ringId] + (Math.random() - 0.5) * 10;
                const length = 200;
                return {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius,
                    z: bodyD / 2 + Math.random() * length
                };
            }

            // 15% Details (Buttons & Viewfinder)
            if (r < 0.95) {
                return {
                    x: (Math.random() - 0.5) * bodyW * 0.8,
                    y: -bodyH / 2 - 20,
                    z: (Math.random() - 0.5) * bodyD
                };
            }
            return { x: bodyW * 0.4, y: -bodyH / 2 - 40, z: 0 };
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
        }
    };

    // ═══════════════════════════════════════════
    //  LOGO SAMPLING
    // ═══════════════════════════════════════════
    let logoPoints = [];
    function sampleLogo() {
        const off = document.createElement('canvas');
        const ox = off.getContext('2d');
        const tw = W > 1200 ? 1800 : 1200;
        off.width = tw; off.height = 600;
        const fs = tw > 1400 ? 280 : 160;
        ox.font = `900 ${fs}px 'Outfit', sans-serif`;
        ox.textAlign = "center";
        ox.textBaseline = "middle";
        ox.fillStyle = "black";
        ox.fillText("& CONTI", tw / 2, 300);

        const data = ox.getImageData(0, 0, tw, 600).data;
        const pts = [];
        const step = 3;
        for (let y = 0; y < 600; y += step) {
            for (let x = 0; x < tw; x += step) {
                if (data[(y * tw + x) * 4 + 3] > 140) {
                    pts.push({ x: x - tw / 2, y: y - 300 });
                }
            }
        }
        logoPoints = pts;
    }

    // ═══════════════════════════════════════════
    //  SHARD CLASS
    // ═══════════════════════════════════════════
    class Shard {
        constructor() {
            this.targets = [];

            // Smaller particles on mobile
            const sizeBase = (W < 900) ? 1.5 : 3;
            const sizeVar = (W < 900) ? 2.5 : 5;
            this.size = sizeBase + Math.random() * sizeVar;

            const dice = Math.random();
            if (dice > 0.6) this.color = [15, 23, 42];  // Slate-900 (Black/Charcoal)
            else if (dice > 0.3) this.color = [51, 65, 85]; // Slate-700 (Dark Gray)
            else this.color = [100, 116, 139]; // Slate-500 (Gray)

            this.junk = {
                x: (Math.random() - 0.5) * W * 3,
                y: (Math.random() - 0.5) * H * 3,
                z: (Math.random() - 0.5) * 1500
            };
            this.phase = Math.random() * Math.PI * 2;
        }

        generateAllTargets() {
            this.targets = [
                Geometries.cloud(),
                Geometries.iphone(),
                Geometries.bulb(),
                Geometries.camera(),
                Geometries.mediaControls(),
                Geometries.target(),
                Geometries.atom(),
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

            const lx = T1.x + (T2.x - T1.x) * ease;
            const ly = T1.y + (T2.y - T1.y) * ease;
            const lz = T1.z + (T2.z - T1.z) * ease;

            let explosion = 0;
            if (idx > 0 && idx < 7) {
                explosion = Math.sin(Math.PI * t);
                explosion = Math.pow(explosion, 0.5);
            }

            const x = lx * (1 - explosion) + this.junk.x * explosion;
            const y = ly * (1 - explosion) + this.junk.y * explosion;
            const z = lz * (1 - explosion) + this.junk.z * explosion;

            let noiseAmp = 0;
            if (t > 0.05 && t < 0.95) noiseAmp = Math.sin(t * Math.PI) * 150;

            const nx = x + Math.cos(this.phase + time) * noiseAmp;
            const ny = y + Math.sin(this.phase + time) * noiseAmp;
            const nz = z + Math.sin(this.phase * 2.5) * noiseAmp;

            // Mobile scaling for objects
            const objScale = (W < 900) ? 0.6 : 1.0;
            const scale = (CONFIG.FOCAL_LENGTH / (CONFIG.FOCAL_LENGTH + nz + cameraZ)) * objScale;

            let curOffset = centerOffset.x;
            if (idx > 0 && idx < 7) {
                const centerBias = Math.sin(Math.PI * t);
                curOffset = centerOffset.x * (1 - centerBias);
            }

            if (idx === 0) curOffset = centerOffset.x * ease;
            if (idx === 6) curOffset = centerOffset.x * (1 - ease);
            if (idx === 7) curOffset = 0;

            const px = (W / 2 + curOffset) + nx * scale;
            const py = (H / 2 + centerOffset.y) + ny * scale;
            const rot = this.phase + time + t * 4;

            if (scale > 0 && px > -W && px < W * 2 && py > -H && py < H * 2) {
                const light = Math.sin(rot + time);
                const alpha = 0.4 + (light + 1) * 0.3;

                ctx.save();
                ctx.translate(px, py);
                ctx.scale(scale * this.size, scale * this.size);
                ctx.rotate(rot);
                ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${alpha})`;
                ctx.fillRect(-1, -1, 2, 2);
                if (light > 0.8) {
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, 1, 1);
                }
                ctx.restore();
            }
        }
    }

    // ═══════════════════════════════════════════
    //  SCROLL CALCULATION
    // ═══════════════════════════════════════════
    function getFloatStep() {
        const scrollY = window.scrollY;
        const assembleTime = CONFIG.ASSEMBLE_DURATION;
        const holdTime = CONFIG.HOLD_DURATION;

        // Use the cinema-wrapper as the anchor for starting the step calculations
        const wrapper = document.getElementById('cinema-wrapper');
        if (!wrapper) return 0;
        const spacerH = wrapper.offsetTop;

        // While above the cinema animation, just show a subtle tease or keep hidden
        if (scrollY < spacerH) {
            // Only start showing particles when we are close to the section (e.g., within 800px)
            const entryDistance = 800;
            if (scrollY < spacerH - entryDistance) return 0;

            const progress = 1 - ((spacerH - scrollY) / entryDistance);
            return progress * 0.1; // Very subtle teasing assembly
        }

        // After hero, calculate based on step sections
        const stepH = steps[0].offsetHeight;
        const relativeScroll = scrollY - spacerH;

        const stepIndex = Math.floor(relativeScroll / stepH);
        const p = (relativeScroll % stepH) / stepH;

        const currentTarget = stepIndex + 1;

        // If past all step sections, start fading out towards the end of the final section
        if (currentTarget >= 8) {
            const finalSection = document.getElementById('step-final');
            if (finalSection) {
                const rect = finalSection.getBoundingClientRect();
                const progressPast = 1 - (rect.bottom / window.innerHeight);
                return 8 + Math.max(0, progressPast); // Goes 8.0 -> 9.0+
            }
            return 8;
        }

        if (p < assembleTime) {
            const startVal = currentTarget - 0.5;
            const endVal = currentTarget;
            const mp = p / assembleTime;
            return startVal + (endVal - startVal) * (mp * mp * (3 - 2 * mp));
        } else if (p < assembleTime + holdTime) {
            return currentTarget;
        } else {
            const startVal = currentTarget;
            const endVal = currentTarget + 0.5;
            const startP = assembleTime + holdTime;
            const mp = (p - startP) / (1 - startP);
            return startVal + (endVal - startVal) * (mp * mp);
        }
    }

    // ═══════════════════════════════════════════
    //  INIT & LOOP
    // ═══════════════════════════════════════════
    let shards = [];
    function init() {
        updateLayout();
        sampleLogo();
        shards = [];

        // Use fewer particles on mobile for performance and clarity
        const particleCount = (W < 900) ? 800 : CONFIG.SHARD_COUNT;

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
        const fStep = Math.min(fStepRaw, 7.99);

        // Global Fade-in / Fade-out
        let globalAlpha = 1;

        // Fade-in at the start (from approaching to first object)
        if (fStepRaw < 1.0) {
            // Since fStepRaw starts from 0 to 0.1 while approaching, and 0.5+ while assembling
            // We want a smooth ramp
            globalAlpha = Math.min(1, Math.max(0, fStepRaw / 0.8));
        }
        // Fade-out past step 8 (Final reveal)
        else if (fStepRaw > 8.0) {
            // Ultra-aggressive fade-out: disappears almost instantly
            globalAlpha = Math.max(0, 1 - (fStepRaw - 8.0) * 10);
        }

        ctx.globalAlpha = globalAlpha;

        if (globalAlpha > 0) {
            canvas.style.display = 'block';
            shards.forEach(s => s.draw(ctx, fStep, time));
        } else {
            canvas.style.display = 'none';
        }

        // Card visibility (scroll-synced fade-in/out)
        steps.forEach((step) => {
            const box = step.querySelector('.content-box');
            if (!box) return;
            const boxRect = box.getBoundingClientRect();

            const viewH = window.innerHeight;
            const startReveal = viewH * 0.95;
            const endReveal = viewH * 0.60;

            let fadeP = (startReveal - boxRect.top) / (startReveal - endReveal);
            fadeP = Math.max(0, Math.min(1, fadeP));

            const startFadeOut = viewH * 0.1;
            const endFadeOut = -viewH * 0.2;
            let fadeOutP = (boxRect.top - endFadeOut) / (startFadeOut - endFadeOut);
            fadeOutP = Math.max(0, Math.min(1, fadeOutP));

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
        sampleLogo();
        shards.forEach(s => s.generateAllTargets());
    });

    init();
    loop();
})();
