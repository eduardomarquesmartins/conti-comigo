/* ═══════════════════════════════════════════════════════
   CINEMA ANIMATION — Standalone 3D Particle Engine
   Adapted for & CONTI website (conti-comigo-main)
   ═══════════════════════════════════════════════════════ */
(() => {
    'use strict';

    const CONFIG = {
        ASSEMBLE_DURATION: 0.10,
        HOLD_DURATION: 0.45,
        FOCAL_LENGTH: 1200,
        SHARD_COUNT: 3500,
        IA_TEXT: "I A"
    };

    const canvas = document.getElementById('cinema-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const steps = document.querySelectorAll('.step-section');
    if (!steps.length) return;

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
            centerOffset.y = 100;
        }
    }

    const Geometries = {
        cloud: () => ({
            x: (Math.random() - 0.5) * (W * 0.5 + 400),
            y: (Math.random() - 0.5) * (H * 0.5 + 400),
            z: (Math.random() - 0.5) * 600
        }),

        iphone: () => {
            const r = Math.random();
            const w = 340, h = 680;
            if (r < 0.45) {
                const step = Math.random() * (2 * (w + h));
                let x, y;
                if (step < w) { x = step - w / 2; y = -h / 2; }
                else if (step < w + h) { x = w / 2; y = (step - w) - h / 2; }
                else if (step < 2 * w + h) { x = w / 2 - (step - (w + h)); y = h / 2; }
                else { x = -w / 2; y = h / 2 - (step - (2 * w + h)); }
                return { x, y, z: (Math.random() - 0.5) * 40 };
            }
            if (r < 0.8) {
                const sw = w - 40, sh = h - 140;
                return { x: (Math.random() - 0.5) * sw, y: (Math.random() - 0.5) * sh - 10, z: 5 };
            }
            if (r < 0.9) {
                const angle = Math.random() * Math.PI * 2;
                const dist = Math.random() * 35;
                return { x: Math.cos(angle) * dist, y: h / 2 - 60, z: 10 };
            }
            return { x: (Math.random() - 0.5) * 80, y: -h / 2 + 50, z: 10 };
        },

        bulb: () => {
            const r = Math.random();
            const headR = 180;
            if (r < 0.6) {
                const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI;
                return {
                    x: headR * Math.sin(v) * Math.cos(u),
                    y: headR * Math.sin(v) * Math.sin(u) - 100,
                    z: headR * Math.cos(v)
                };
            }
            if (r < 0.9) {
                const h = 120, t = Math.random(), y = t * h + 80, radius = 60;
                const angle = Math.random() * Math.PI * 2;
                return { x: Math.cos(angle) * radius, y: y, z: Math.sin(angle) * radius };
            }
            return { x: 0, y: (Math.random() - 0.5) * 100 - 80, z: 0 };
        },

        penTool: () => {
            const r = Math.random();
            const handleLen = 220;
            if (r < 0.20) {
                const s = 40;
                return { x: (Math.random() - 0.5) * s, y: (Math.random() - 0.5) * s, z: 10 };
            }
            if (r < 0.50) {
                const side = Math.random() > 0.5 ? 1 : -1, t = Math.random(), angle = -Math.PI / 6 * side;
                return { x: Math.cos(angle) * (t * handleLen) * side, y: Math.sin(angle) * (t * handleLen) * side, z: 0 };
            }
            if (r < 0.65) {
                const side = Math.random() > 0.5 ? 1 : -1, angle = -Math.PI / 6 * side, s = 25;
                return { x: Math.cos(angle) * handleLen * side + (Math.random() - 0.5) * s, y: Math.sin(angle) * handleLen * side + (Math.random() - 0.5) * s, z: 5 };
            }
            const side = Math.random() > 0.5 ? 1 : -1, p = Math.random();
            const x = (1 - p) * (1 - p) * 0 + 2 * (1 - p) * p * (side * 150) + p * p * (side * 300);
            const y = (1 - p) * (1 - p) * 0 + 2 * (1 - p) * p * (-250) + p * p * (100);
            return { x, y, z: -10 };
        },

        camera: () => {
            const r = Math.random();
            if (r < 0.5) {
                const w = 340, h = 240, d = 80;
                return { x: (Math.random() - 0.5) * w, y: (Math.random() - 0.5) * h, z: (Math.random() - 0.5) * d };
            }
            if (r < 0.8) {
                const angle = Math.random() * Math.PI * 2, rad = 95, len = 100;
                return { x: Math.cos(angle) * rad, y: Math.sin(angle) * rad, z: 60 + Math.random() * len };
            }
            return Math.random() > 0.5 ? { x: 120 + Math.random() * 50, y: -140 - Math.random() * 30, z: (Math.random() - 0.5) * 50 } : { x: -120 + Math.random() * 40, y: -130 - Math.random() * 20, z: 0 };
        },

        rocket: () => {
            const r = Math.random(), bodyH = 340;
            if (r < 0.5) {
                const angle = Math.random() * Math.PI * 2, h = (Math.random() - 0.5) * bodyH;
                const rad = 60 + (1 - Math.abs(h) / (bodyH / 2)) * 20;
                return { x: Math.cos(angle) * rad, y: h, z: Math.sin(angle) * rad };
            }
            if (r < 0.8) {
                const finId = Math.floor(Math.random() * 3), angle = (finId * Math.PI * 2) / 3, dist = 70 + Math.random() * 60, h = bodyH / 2 - Math.random() * 80;
                return { x: Math.cos(angle) * dist, y: h, z: Math.sin(angle) * dist };
            }
            const angle = Math.random() * Math.PI * 2;
            return { x: Math.cos(angle) * 30, y: -bodyH / 2 + Math.random() * 40 - 20, z: Math.sin(angle) * 30 + 10 };
        },

        mediaControls: () => {
            const r = Math.random(), playSize = 250, pauseBarW = 75, pauseBarGap = 60, pauseTotalW = pauseBarW * 2 + pauseBarGap, centerGap = 120;
            const totalW = pauseTotalW + centerGap + playSize, startX = -totalW / 2;
            if (r < 0.5) {
                const barId = Math.random() > 0.5 ? 0 : 1, xByBar = (Math.random() - 0.5) * pauseBarW, yByBar = (Math.random() - 0.5) * 320;
                const bX = startX + (barId === 0 ? pauseBarW / 2 : pauseTotalW - pauseBarW / 2);
                return { x: bX + xByBar, y: yByBar, z: 0 };
            }
            const pStartX = startX + pauseTotalW + centerGap, u = Math.random(), yR = (1 - u), v = (Math.random() - 0.5) * yR;
            return { x: pStartX + u * playSize, y: v * playSize * 1.5, z: 0 };
        },

        target: () => {
            const r = Math.random();
            if (r < 0.8) {
                const ringId = Math.floor(Math.random() * 3), radii = [100, 200, 300], angle = Math.random() * Math.PI * 2, radius = radii[ringId] + (Math.random() - 0.5) * 5;
                return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius, z: 0 };
            }
            const side = Math.random() > 0.5, t = (Math.random() - 0.5) * 700;
            return { x: side ? t : 0, y: side ? 0 : t, z: 10 };
        },

        atom: () => {
            const r = Math.random(), orbitR = 300, electronR = 40;
            if (r < 0.7) {
                const ringId = Math.floor(Math.random() * 3), angle = Math.random() * Math.PI * 2, tilt = ringId * (Math.PI / 3);
                let x = Math.cos(angle) * orbitR, y = Math.sin(angle) * orbitR * 0.4;
                return { x: x * Math.cos(tilt) - y * Math.sin(tilt), y: x * Math.sin(tilt) + y * Math.cos(tilt), z: (Math.random() - 0.5) * 20 };
            }
            const ePos = [0, Math.PI * 0.6, Math.PI * 1.2, Math.PI * 1.8], eId = Math.floor(Math.random() * ePos.length), orbitId = Math.floor(Math.random() * 3), tilt = orbitId * (Math.PI / 3);
            const bA = ePos[eId], ex = Math.cos(bA) * orbitR, ey = Math.sin(bA) * orbitR * 0.4;
            const u = Math.random() * Math.PI * 2, v = Math.random() * Math.PI, rad = electronR * Math.pow(Math.random(), 0.5);
            let lx = ex + rad * Math.sin(v) * Math.cos(u), ly = ey + rad * Math.sin(v) * Math.sin(u), lz = rad * Math.cos(v);
            return { x: lx * Math.cos(tilt) - ly * Math.sin(tilt), y: lx * Math.sin(tilt) + ly * Math.cos(tilt), z: lz };
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
            const r = Math.random(), L = 320, minR = 40, maxR = 180;
            if (r < 0.6) {
                const t = Math.random(), angle = Math.random() * Math.PI * 2, radius = minR + t * (maxR - minR);
                return { x: t * L - L / 2, y: Math.cos(angle) * radius, z: Math.sin(angle) * radius };
            }
            if (r < 0.75) return { x: -L / 2 + Math.random() * 60, y: Math.random() * 120, z: (Math.random() - 0.5) * 40 };
            if (r < 0.85) {
                const angle = Math.random() * Math.PI * 2, dist = Math.random() * minR;
                return { x: -L / 2, y: Math.cos(angle) * dist, z: Math.sin(angle) * dist };
            }
            const waveId = Math.floor(Math.random() * 3), waveDist = L / 2 + 40 + waveId * 60, waveAngle = (Math.random() - 0.5) * Math.PI * 0.6, spread = 1.2;
            return { x: waveDist + Math.random() * 10, y: Math.sin(waveAngle) * waveDist * spread, z: Math.cos(waveAngle) * waveDist * 0.2 };
        },

        aiChip: () => {
            const r = Math.random(), size = 420;
            if (r < 0.6) {
                if (Math.random() > 0.4) {
                    const isX = Math.random() > 0.5, gp = (Math.round(Math.random() * 8) / 8 - 0.5) * size, vary = (Math.random() - 0.5) * size;
                    return { x: isX ? gp : vary, y: isX ? vary : gp, z: 0 };
                }
                return { x: (Math.random() - 0.5) * size, y: (Math.random() - 0.5) * size, z: 5 };
            }
            const side = Math.floor(Math.random() * 4), t = (Math.random() - 0.5) * (size * 0.8), pinL = 120, d = (Math.random() - 0.5) * 20;
            if (side === 0) return { x: -size / 2 - Math.random() * pinL, y: t, z: d };
            if (side === 1) return { x: size / 2 + Math.random() * pinL, y: t, z: d };
            if (side === 2) return { x: t, y: -size / 2 - Math.random() * pinL, z: d };
            return { x: t, y: size / 2 + Math.random() * pinL, z: d };
        },

        stories: () => {
            const r = Math.random(), w = 320, h = 560;
            if (r < 0.5) {
                const edge = Math.floor(Math.random() * 4);
                let x, y;
                if (edge === 0) { x = (Math.random() - 0.5) * w; y = -h / 2; }
                else if (edge === 1) { x = w / 2; y = (Math.random() - 0.5) * h; }
                else if (edge === 2) { x = (Math.random() - 0.5) * w; y = h / 2; }
                else { x = -w / 2; y = (Math.random() - 0.5) * h; }
                return { x, y, z: 0 };
            }
            if (r < 0.65) {
                const a = Math.random() * Math.PI * 2;
                return { x: Math.cos(a) * 40 - 80, y: -h / 2 + 60, z: 10 };
            }
            const penX = w / 2 + 30, t = Math.random(), angle = Math.random() * Math.PI * 2, rad = 6;
            return { x: penX + Math.cos(angle) * rad, y: -h / 2 + 100 + t * (h - 200), z: Math.sin(angle) * rad };
        },

        drone: () => {
            const r = Math.random();
            const S = 1.6; // Scale
            const Y_OFF = -20;

            function interpolate(x1, y1, x2, y2) {
                const t = Math.random();
                const noiseX = (Math.random() - 0.5) * 4;
                const noiseY = (Math.random() - 0.5) * 4;
                return {
                    x: (x1 + (x2 - x1) * t) * S + noiseX,
                    y: (y1 + (y2 - y1) * t) * S + noiseY + Y_OFF,
                    z: (Math.random() - 0.5) * 8
                };
            }

            if (r < 0.25) {
                // Camera Ring (25%)
                const a = Math.random() * Math.PI * 2;
                const d = 50 + (Math.random() - 0.5) * 12; // Thick ring
                return {
                    x: Math.cos(a) * d * S,
                    y: (15 + Math.sin(a) * d) * S + Y_OFF,
                    z: (Math.random() - 0.5) * 15
                };
            } else if (r < 0.28) {
                // Camera lens flare (3%)
                const a = Math.PI * 0.6 + Math.random() * Math.PI * 0.4;
                const d = 30 + (Math.random() - 0.5) * 4;
                return {
                    x: Math.cos(a) * d * S,
                    y: (15 + Math.sin(a) * d) * S + Y_OFF,
                    z: 5
                };
            } else if (r < 0.42) {
                // Bridge & Main arms (14%)
                const t = Math.random();
                if (t < 0.15) return interpolate(-40, -35, -20, -55);   // L bridge up
                if (t < 0.35) return interpolate(-20, -55, 20, -55);    // Bridge top
                if (t < 0.50) return interpolate(20, -55, 40, -35);     // R bridge down
                if (t < 0.75) return interpolate(-110, -35, -40, -35);  // L main arm
                return interpolate(40, -35, 110, -35);                  // R main arm
            } else if (r < 0.52) {
                // Legs (10%)
                const t = Math.random();
                if (t < 0.4) return interpolate(-80, -35, -80, 50);     // L leg drop
                if (t < 0.5) return interpolate(-100, 50, -60, 50);     // L leg skid
                if (t < 0.9) return interpolate(80, -35, 80, 50);       // R leg drop
                return interpolate(60, 50, 100, 50);                    // R leg skid
            } else if (r < 0.60) {
                // Diagonals & motor mounts (8%)
                const t = Math.random();
                if (t < 0.35) return interpolate(-110, -35, -145, -60);  // L diag
                if (t < 0.50) return interpolate(-145, -60, -145, -75);  // L motor
                if (t < 0.85) return interpolate(110, -35, 145, -60);    // R diag
                return interpolate(145, -60, 145, -75);                  // R motor
            } else {
                // Propellers (40%)
                const isLeft = Math.random() > 0.5;
                const rx = isLeft ? -145 * S : 145 * S;
                const ry = -78 * S + Y_OFF;
                const rz = 0;

                // Propeller width around motor
                const dist = (Math.random() - 0.5) * 160 * S;
                return {
                    x: rx + dist,
                    y: ry + (Math.random() - 0.5) * 6, // slight thickness
                    z: 0,
                    rotorX: rx,
                    rotorZ: rz,
                    isPropeller: true,
                    rotorId: isLeft ? 0 : 1
                };
            }
        }
    };

    let logoPoints = [], iaPoints = [];
    function sampleTexts() {
        const off = document.createElement('canvas'), ox = off.getContext('2d');
        let tw = W > 1200 ? 1800 : 1200; off.width = tw; off.height = 600;
        let fs = tw > 1400 ? 280 : 160; ox.font = `900 ${fs}px 'Outfit', sans-serif`;
        ox.textAlign = "center"; ox.textBaseline = "middle"; ox.fillStyle = "black";
        ox.fillText("& CONTI", tw / 2, 300);
        let data = ox.getImageData(0, 0, tw, 600).data, pts = [], step = 3;
        for (let y = 0; y < 600; y += step) for (let x = 0; x < tw; x += step) if (data[(y * tw + x) * 4 + 3] > 80) pts.push({ x: x - tw / 2, y: y - 300 });
        logoPoints = pts;
        ox.clearRect(0, 0, tw, 600); fs = tw > 1400 ? 500 : 350;
        ox.font = `900 ${fs}px 'Outfit', sans-serif`; ox.fillText(CONFIG.IA_TEXT, tw / 2, 300);
        data = ox.getImageData(0, 0, tw, 600).data; pts = [];
        for (let y = 0; y < 600; y += step) for (let x = 0; x < tw; x += step) if (data[(y * tw + x) * 4 + 3] > 80) pts.push({ x: x - tw / 2, y: y - 300 });
        iaPoints = pts;
    }

    class Shard {
        constructor() {
            this.targets = [];
            this.size = 2 + Math.random() * 4;
            const dice = Math.random();
            if (dice > 0.5) this.color = [15, 23, 42]; else this.color = [51, 65, 85];
            this.junk = { x: (Math.random() - 0.5) * W * 3, y: (Math.random() - 0.5) * H * 3, z: (Math.random() - 0.5) * 1500 };
            this.phase = Math.random() * Math.PI * 2;
        }

        generateAllTargets() {
            this.targets = [
                Geometries.cloud(), Geometries.megaphone(), Geometries.stories(), Geometries.camera(),
                Geometries.mediaControls(), Geometries.target(), Geometries.atom(),
                Geometries.iphone(), Geometries.drone(), Geometries.logo(logoPoints)
            ];
            this.junk = { x: (Math.random() - 0.5) * W * 3, y: (Math.random() - 0.5) * H * 3, z: (Math.random() - 0.5) * 1500 };
        }

        draw(ctx, fStep, time) {
            const idx = Math.floor(fStep), t = fStep - idx;
            let T1 = this.targets[idx] || this.junk, T2 = this.targets[idx + 1] || this.targets[idx];
            let ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            let lx = T1.x + (T2.x - T1.x) * ease, ly = T1.y + (T2.y - T1.y) * ease, lz = T1.z + (T2.z - T1.z) * ease;

            if (T1.isPropeller && T2.isPropeller) {
                const rx = T1.rotorX, rz = T1.rotorZ, rID = T1.rotorId;
                const relX = lx - rx, relZ = lz - rz, speed = 15.0;
                const dir = (rID === 0 || rID === 2) ? 1 : -1, angle = time * speed * dir;
                const cosA = Math.cos(angle), sinA = Math.sin(angle);
                lx = rx + (relX * cosA - relZ * sinA);
                lz = rz + (relX * sinA + relZ * cosA);
            }

            let explosion = 0;
            if (idx >= 0 && idx < 8) { explosion = Math.sin(Math.PI * t) * 0.3; explosion = Math.pow(explosion, 0.5); }
            const x = lx * (1 - explosion) + this.junk.x * explosion;
            const y = ly * (1 - explosion) + this.junk.y * explosion;
            const z = lz * (1 - explosion) + this.junk.z * explosion;

            let nAmp = (t > 0.05 && t < 0.95) ? Math.sin(t * Math.PI) * 40 : 0;
            const nx = x + Math.cos(this.phase + time) * nAmp;
            const ny = y + Math.sin(this.phase + time) * nAmp;
            const nz = z + Math.sin(this.phase * 2.5) * nAmp;

            const sc = (CONFIG.FOCAL_LENGTH / (CONFIG.FOCAL_LENGTH + nz + cameraZ)) * (W < 900 ? 0.85 : 1.0);
            let cOff = centerOffset.x;
            if (idx === 0) cOff = centerOffset.x * ease;
            else if (idx === 8) cOff = centerOffset.x * (1 - ease);
            else if (idx >= 9) cOff = 0;
            else cOff = centerOffset.x * (1 - Math.sin(Math.PI * t));

            let px = (W / 2 + cOff) + nx * sc, py = (H / 2 + centerOffset.y) + ny * sc;
            if (sc > 0 && px > -W && px < W * 2 && py > -H && py < H * 2) {
                const fSc = sc * this.size;
                ctx.save(); ctx.translate(px, py); ctx.scale(fSc, fSc); ctx.rotate(this.phase + time + t * 4);
                ctx.fillStyle = `rgb(${this.color[0]},${this.color[1]},${this.color[2]})`;
                ctx.fillRect(-0.5, -0.5, 1, 1); ctx.restore();
            }
        }
    }

    function getFloatStep() {
        const scrollY = window.scrollY, wrapper = document.getElementById('cinema-wrapper');
        if (!wrapper) return 0;
        const spacerH = wrapper.offsetTop, stepH = steps[0].offsetHeight;
        if (scrollY < spacerH) {
            const entryD = 800;
            if (scrollY < spacerH - entryD) return 0;
            return (1 - ((spacerH - scrollY) / entryD)) * 0.1;
        }
        const relS = scrollY - spacerH, totalS = 8 * stepH;
        if (relS < totalS) {
            const stepI = Math.floor(relS / stepH), p = (relS % stepH) / stepH;
            const aT = CONFIG.ASSEMBLE_DURATION;
            let cH = (stepI === 7) ? 0.2 : CONFIG.HOLD_DURATION;
            if (p < aT) { const sP = p / aT; return (stepI + 0.5) + (sP * sP * (3 - 2 * sP)) * 0.5; }
            if (p < aT + cH) return stepI + 1;
            const sP = (p - (aT + cH)) / (1 - (aT + cH));
            return (stepI === 7) ? 8.0 + sP * 0.7 : (stepI + 1) + (sP * sP) * 0.5;
        }
        const extraS = relS - totalS, logoS = stepH * 0.2;
        return 8.7 + Math.min(1.0, extraS / logoS) * 0.8;
    }

    let shards = [];
    function init() {
        updateLayout(); sampleTexts(); shards = [];
        let i = 0; function createBatch() {
            const bS = 200, end = Math.min(i + bS, CONFIG.SHARD_COUNT);
            for (; i < end; i++) { const s = new Shard(); s.generateAllTargets(); shards.push(s); }
            if (i < CONFIG.SHARD_COUNT) setTimeout(createBatch, 5);
        }
        createBatch();
    }

    let time = 0;
    function loop() {
        time += 0.02; ctx.clearRect(0, 0, W, H);
        const fSR = getFloatStep(), fS = Math.min(fSR, 9.0);
        let alpha = 1;
        if (fSR < 0.8) alpha = fSR / 0.8;
        else if (fSR > 9.8) alpha = Math.max(0, 1 - (fSR - 9.8) * 10);
        ctx.globalAlpha = alpha;
        if (alpha > 0) { canvas.style.display = 'block'; shards.forEach(s => s.draw(ctx, fS, time)); }
        else { canvas.style.display = 'none'; }

        steps.forEach((step) => {
            const box = step.querySelector('.content-box'); if (!box) return;
            const rect = box.getBoundingClientRect(), vH = window.innerHeight;
            const sR = vH * 0.95, eR = vH * 0.60, fP = Math.max(0, Math.min(1, (sR - rect.top) / (sR - eR)));
            const sFO = vH * 0.1, eFO = -vH * 0.2, fOP = Math.max(0, Math.min(1, (rect.top - eFO) / (sFO - eFO)));
            const a = fP * fOP;
            box.style.opacity = a; box.style.transform = `translateY(${(1 - a) * 80}px) scale(${0.95 + a * 0.05})`;
            if (a > 0.1) box.classList.add('visible'); else box.classList.remove('visible');
        });
        requestAnimationFrame(loop);
    }

    let resTO; window.addEventListener('resize', () => {
        clearTimeout(resTO); resTO = setTimeout(() => { updateLayout(); sampleTexts(); shards.forEach(s => s.generateAllTargets()); }, 250);
    });
    init(); loop();
})();
