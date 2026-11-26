import * as THREE from "three";

// ==================================
// 1. GET HTML ELEMENTS
// ==================================

const container = document.getElementById("earth-scene");

if (!container) {
    throw new Error("The earth-scene element was not found.");
}


// ==================================
// 2. CREATE SCENE AND CAMERA
// ==================================

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    1000
);

camera.position.set(0, 0, 6.5);


// ==================================
// 3. CREATE RENDERER
// ==================================

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.domElement.style.display = "block";

container.appendChild(renderer.domElement);


function resizeScene() {

    const width = container.clientWidth;
    const height = container.clientHeight;

    if (width === 0 || height === 0) {
        return;
    }

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}

resizeScene();


// ==================================
// 4. CREATE EARTH
// ==================================

const earthGeometry = new THREE.SphereGeometry(
    1.3,
    64,
    64
);

const earthMaterial = new THREE.MeshStandardMaterial({
    color: 0x1769aa,
    roughness: 0.8,
    metalness: 0.1
});

const earth = new THREE.Mesh(
    earthGeometry,
    earthMaterial
);

scene.add(earth);


// ==================================
// 5. EARTH LATITUDE AND LONGITUDE
// ==================================

const gridMaterial = new THREE.LineBasicMaterial({
    color: 0x65cfff,
    transparent: true,
    opacity: 0.35
});

const gridRadius = 1.305;


// Latitude circles

for (let i = -60; i <= 60; i += 30) {

    const points = [];
    const latitude = (i * Math.PI) / 180;

    for (let j = 0; j <= 100; j++) {

        const longitude = (j / 100) * Math.PI * 2;

        points.push(
            new THREE.Vector3(
                gridRadius * Math.cos(latitude) * Math.cos(longitude),
                gridRadius * Math.sin(latitude),
                gridRadius * Math.cos(latitude) * Math.sin(longitude)
            )
        );
    }

    const geometry = new THREE.BufferGeometry()
        .setFromPoints(points);

    const line = new THREE.Line(
        geometry,
        gridMaterial
    );

    earth.add(line);
}


// Longitude lines

for (let i = 0; i < 12; i++) {

    const points = [];
    const longitude = (i * Math.PI) / 12;

    for (let j = 0; j <= 100; j++) {

        const latitude =
            (j / 100) * Math.PI - Math.PI / 2;

        points.push(
            new THREE.Vector3(
                gridRadius * Math.cos(latitude) * Math.cos(longitude),
                gridRadius * Math.sin(latitude),
                gridRadius * Math.cos(latitude) * Math.sin(longitude)
            )
        );
    }

    const geometry = new THREE.BufferGeometry()
        .setFromPoints(points);

    const line = new THREE.Line(
        geometry,
        gridMaterial
    );

    earth.add(line);
}


// ==================================
// 6. EARTH ATMOSPHERE
// ==================================

const atmosphereGeometry = new THREE.SphereGeometry(
    1.36,
    64,
    64
);

const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x35bfff,
    transparent: true,
    opacity: 0.12,
    side: THREE.BackSide
});

const atmosphere = new THREE.Mesh(
    atmosphereGeometry,
    atmosphereMaterial
);

scene.add(atmosphere);


// ==================================
// 7. LIGHTING
// ==================================

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
);

scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

sunLight.position.set(5, 3, 5);

scene.add(sunLight);


// ==================================
// 8. CREATE ORBITAL PLANES
// ==================================

const orbitalPlanes = [];

const orbitRotations = [
    { x: 0.25, y: 0.0, z: 0.0 },
    { x: 0.9, y: 0.5, z: 0.2 },
    { x: 1.35, y: 1.0, z: 0.4 }
];

const orbitColors = [
    0x38bdf8,
    0xa78bfa,
    0x34d399
];

for (let i = 0; i < 3; i++) {

    const orbitGroup = new THREE.Group();

    orbitGroup.rotation.set(
        orbitRotations[i].x,
        orbitRotations[i].y,
        orbitRotations[i].z
    );

    const points = [];

    for (let j = 0; j <= 150; j++) {

        const angle = (j / 150) * Math.PI * 2;

        points.push(
            new THREE.Vector3(
                Math.cos(angle) * 2.2,
                Math.sin(angle) * 2.2,
                0
            )
        );
    }

    const orbitGeometry = new THREE.BufferGeometry()
        .setFromPoints(points);

    const orbitMaterial = new THREE.LineBasicMaterial({
        color: orbitColors[i],
        transparent: true,
        opacity: 0.55
    });

    const orbit = new THREE.Line(
        orbitGeometry,
        orbitMaterial
    );

    orbitGroup.add(orbit);

    scene.add(orbitGroup);

    orbitalPlanes.push(orbitGroup);
}


// ==================================
// 9. CREATE SATELLITES
// ==================================

const satellites = [];

for (let i = 0; i < 8; i++) {

    const satellite = new THREE.Group();


    // Main body

    const bodyGeometry = new THREE.BoxGeometry(
        0.24, 0.24, 0.24
    );

    const bodyMaterial = new THREE.MeshStandardMaterial({
        color: 0xd6a52a,
        metalness: 0.8,
        roughness: 0.3
    });

    const body = new THREE.Mesh(
        bodyGeometry,
        bodyMaterial
    );

    satellite.add(body);


    // Antenna

    const antennaGeometry = new THREE.CylinderGeometry(
        0.025, 0.025, 0.18, 16
    );

    const antennaMaterial = new THREE.MeshStandardMaterial({
        color: 0xdce7f2,
        metalness: 0.7,
        roughness: 0.3
    });

    const antenna = new THREE.Mesh(
        antennaGeometry,
        antennaMaterial
    );

    antenna.position.y = 0.19;

    satellite.add(antenna);


    // Antenna tip

    const tipGeometry = new THREE.SphereGeometry(
        0.045, 16, 16
    );

    const tip = new THREE.Mesh(
        tipGeometry,
        antennaMaterial
    );

    tip.position.y = 0.29;

    satellite.add(tip);


    // Solar panels

    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x164b9b,
        metalness: 0.65,
        roughness: 0.3,
        side: THREE.DoubleSide
    });

    const panelGeometry = new THREE.BoxGeometry(
        0.55, 0.06, 0.28
    );

    const leftPanel = new THREE.Mesh(
        panelGeometry,
        panelMaterial
    );

    leftPanel.position.x = -0.43;

    const rightPanel = new THREE.Mesh(
        panelGeometry,
        panelMaterial
    );

    rightPanel.position.x = 0.43;

    satellite.add(leftPanel);
    satellite.add(rightPanel);


    // Panel support bars

    const supportGeometry = new THREE.BoxGeometry(
        0.18, 0.035, 0.035
    );

    const supportMaterial = new THREE.MeshStandardMaterial({
        color: 0xb8c7d9,
        metalness: 0.8
    });

    const leftSupport = new THREE.Mesh(
        supportGeometry,
        supportMaterial
    );

    leftSupport.position.x = -0.19;

    const rightSupport = new THREE.Mesh(
        supportGeometry,
        supportMaterial
    );

    rightSupport.position.x = 0.19;

    satellite.add(leftSupport);
    satellite.add(rightSupport);


    // Solar panel grid

    const panelGridMaterial = new THREE.MeshBasicMaterial({
        color: 0x55bfff
    });

    for (let side of [-1, 1]) {

        for (let j = -1; j <= 1; j++) {

            const gridLine = new THREE.Mesh(
                new THREE.BoxGeometry(0.015, 0.065, 0.28),
                panelGridMaterial
            );

            gridLine.position.x =
                side * 0.43 + j * 0.14;

            satellite.add(gridLine);
        }
    }


    // Assign orbital plane

    const orbitIndex = i % 3;

    satellite.userData.orbitIndex = orbitIndex;

    satellite.userData.speed =
        0.35 + (i % 3) * 0.12;

    orbitalPlanes[orbitIndex].add(satellite);

    satellites.push(satellite);
}


// ==================================
// 10. CREATE GPS RECEIVER
// ==================================

const receiver = new THREE.Group();

const phoneGeometry = new THREE.BoxGeometry(
    0.35,
    0.65,
    0.12
);

const phoneMaterial = new THREE.MeshStandardMaterial({
    color: 0x35bfff,
    metalness: 0.5,
    roughness: 0.3
});

const phone = new THREE.Mesh(
    phoneGeometry,
    phoneMaterial
);

receiver.add(phone);

receiver.position.set(0, -1.9, 0);

scene.add(receiver);


// ==================================
// 11. CREATE SIGNAL LINES + PULSES
// ==================================

const signalLines = [];
const signalPulses = [];

for (let i = 0; i < 8; i++) {

    // Signal line

    const points = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, 0)
    ];

    const geometry = new THREE.BufferGeometry()
        .setFromPoints(points);

    const material = new THREE.LineBasicMaterial({
        color: 0x35bfff,
        transparent: true,
        opacity: 0.8
    });

    const line = new THREE.Line(
        geometry,
        material
    );

    scene.add(line);

    signalLines.push(line);


    // Pulse group

    const pulse = new THREE.Group();


    // Bright center

    const pulseGeometry = new THREE.SphereGeometry(
        0.10, 24, 24
    );

    const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd54a
    });

    const pulseCore = new THREE.Mesh(
        pulseGeometry,
        pulseMaterial
    );

    pulse.add(pulseCore);


    // Glow surrounding the pulse

    const glowGeometry = new THREE.SphereGeometry(
        0.19, 24, 24
    );

    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffe88a,
        transparent: true,
        opacity: 0.22,
        depthWrite: false
    });

    const pulseGlow = new THREE.Mesh(
        glowGeometry,
        glowMaterial
    );

    pulse.add(pulseGlow);

    scene.add(pulse);

    signalPulses.push(pulse);
}


// ==================================
// 12. ANIMATION
// ==================================

const clock = new THREE.Clock();

function animate() {

    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();


    // Rotate Earth

    earth.rotation.y += 0.002;


    // Move satellites

    satellites.forEach((satellite, index) => {

        const angle =
            elapsedTime * satellite.userData.speed +
            index * Math.PI / 4;

        satellite.position.set(
            Math.cos(angle) * 2.2,
            Math.sin(angle) * 2.2,
            0
        );

        satellite.rotation.z = angle + Math.PI / 2;

    });


    // Update signal lines

    signalLines.forEach((line, index) => {

        const satellitePosition = new THREE.Vector3();

        satellites[index].getWorldPosition(
            satellitePosition
        );

        const receiverPosition = new THREE.Vector3();

        receiver.getWorldPosition(
            receiverPosition
        );

        line.geometry.setFromPoints([
            satellitePosition,
            receiverPosition
        ]);

    });


    // Animate signal pulses

    signalPulses.forEach((pulse, index) => {

        const satellitePosition = new THREE.Vector3();

        satellites[index].getWorldPosition(
            satellitePosition
        );

        const receiverPosition = new THREE.Vector3();

        receiver.getWorldPosition(
            receiverPosition
        );


        // Progress along the signal path

        const progress =
            (elapsedTime * 0.5 + index * 0.17) % 1;


        // Move pulse between satellite and receiver

        pulse.position.lerpVectors(
            satellitePosition,
            receiverPosition,
            progress
        );

    });


    renderer.render(scene, camera);
}

animate();


// ==================================
// 13. RESPONSIVE SCENE
// ==================================

const resizeObserver = new ResizeObserver(() => {
    resizeScene();
});

resizeObserver.observe(container);

window.addEventListener("resize", resizeScene);


// ==================================
// 14. GPS SIMULATION CONTROLS
// ==================================

const satelliteSlider =
    document.getElementById("satellite-count");

const satelliteValue =
    document.getElementById("satellite-value");

const obstructionSlider =
    document.getElementById("obstruction-level");

const blockedValue =
    document.getElementById("blocked-value");

const delaySlider =
    document.getElementById("signal-delay");

const delayValue =
    document.getElementById("delay-value");

const rangeError =
    document.getElementById("range-error");

const gpsStatus =
    document.getElementById("gps-status");


// ==================================
// 15. UPDATE SIMULATION
// ==================================

function updateSimulation() {

    const totalSatellites =
        Number(satelliteSlider.value);

    const blockedSatellites = Math.min(
        Number(obstructionSlider.value),
        totalSatellites
    );

    const receivedSatellites =
        totalSatellites - blockedSatellites;


    // Signal delay calculation

    const delayNanoseconds =
        Number(delaySlider.value);

    const speedOfLight = 0.299792458;

    const errorMeters =
        delayNanoseconds * speedOfLight;


    // Update displayed values

    satelliteValue.textContent =
        totalSatellites;

    blockedValue.textContent =
        blockedSatellites;

    delayValue.textContent =
        delayNanoseconds;

    rangeError.textContent =
        errorMeters.toFixed(2);


    // Satellite visibility

    satellites.forEach((satellite, index) => {

        satellite.visible =
            index < totalSatellites;

    });


    // Signal visibility

    signalLines.forEach((line, index) => {

        const isVisible =
            index < receivedSatellites;

        line.visible = isVisible;

        signalPulses[index].visible =
            isVisible;

    });


    // GPS status

    if (receivedSatellites < 4) {

        gpsStatus.textContent =
            `Only ${receivedSatellites} satellites received. Insufficient for standard 3D positioning.`;

        gpsStatus.style.color = "#ff7777";

    } else {

        gpsStatus.textContent =
            `${receivedSatellites} satellites received. 3D positioning is possible.`;

        gpsStatus.style.color = "#54c8ff";

    }

}


// ==================================
// 16. SLIDER EVENTS
// ==================================

satelliteSlider.addEventListener(
    "input",
    updateSimulation
);

obstructionSlider.addEventListener(
    "input",
    updateSimulation
);

delaySlider.addEventListener(
    "input",
    updateSimulation
);


// Initial update

updateSimulation();