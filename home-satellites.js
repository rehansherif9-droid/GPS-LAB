import * as THREE from "three";

// ======================================
// 1. HOME SATELLITE SCENE
// ======================================

const container = document.getElementById("home-satellite-scene");

if (!container) {
    throw new Error("Home satellite container not found.");
}

const scene = new THREE.Scene();

// Orthographic camera keeps the satellites aligned with the CSS Earth.
const viewSize = 6.2;
const aspect = container.clientWidth / container.clientHeight || 1;

const camera = new THREE.OrthographicCamera(
    -viewSize * aspect / 2,
    viewSize * aspect / 2,
    viewSize / 2,
    -viewSize / 2,
    0.1,
    100
);

camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

// ======================================
// 2. LIGHTING
// ======================================

scene.add(new THREE.AmbientLight(0xffffff, 1.5));

const sunlight = new THREE.DirectionalLight(0xffffff, 2.8);
sunlight.position.set(4, 5, 7);
scene.add(sunlight);

const blueLight = new THREE.PointLight(0x329dff, 8, 12);
blueLight.position.set(-4, 2, 4);
scene.add(blueLight);

// ======================================
// 3. EARTH OCCLUSION
// ======================================
// This invisible sphere hides satellites that pass behind the CSS Earth.

const earthOccluder = new THREE.Mesh(
    new THREE.SphereGeometry(2.11, 48, 48),
    new THREE.MeshBasicMaterial({
        colorWrite: false,
        depthWrite: true
    })
);
scene.add(earthOccluder);

// ======================================
// 4. SATELLITE MATERIALS
// ======================================

const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xb9c5d4,
    metalness: 0.85,
    roughness: 0.3
});

const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd9a94f,
    metalness: 0.8,
    roughness: 0.3
});

const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x27394d,
    metalness: 0.8,
    roughness: 0.35
});

const solarMaterial = new THREE.MeshStandardMaterial({
    color: 0x123d86,
    metalness: 0.65,
    roughness: 0.25,
    emissive: 0x061b48
});

const antennaMaterial = new THREE.MeshStandardMaterial({
    color: 0xe2e9f2,
    metalness: 0.9,
    roughness: 0.2
});

// ======================================
// 5. BUILD A DETAILED SATELLITE
// ======================================

function createSatellite() {
    const satellite = new THREE.Group();

    // Main metallic body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.42, 0.3),
        bodyMaterial
    );
    satellite.add(body);

    // Gold thermal blanket band
    const goldBand = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.12, 0.32),
        goldMaterial
    );
    goldBand.position.y = 0.08;
    satellite.add(goldBand);

    // Top equipment box
    const equipment = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.12, 0.18),
        darkMaterial
    );
    equipment.position.y = 0.27;
    satellite.add(equipment);

    // Solar panel with a visible cell grid
    function createSolarPanel(side) {
        const panel = new THREE.Group();

        const panelBase = new THREE.Mesh(
            new THREE.BoxGeometry(0.55, 0.035, 0.36),
            solarMaterial
        );
        panel.add(panelBase);

        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0x73baff
        });

        for (let i = -2; i <= 2; i++) {
            const verticalPoints = [
                new THREE.Vector3(i * 0.09, 0.021, -0.17),
                new THREE.Vector3(i * 0.09, 0.021, 0.17)
            ];

            const verticalGeometry = new THREE.BufferGeometry()
                .setFromPoints(verticalPoints);
            panel.add(new THREE.Line(verticalGeometry, gridMaterial));

            const horizontalPoints = [
                new THREE.Vector3(-0.27, 0.022, i * 0.055),
                new THREE.Vector3(0.27, 0.022, i * 0.055)
            ];

            const horizontalGeometry = new THREE.BufferGeometry()
                .setFromPoints(horizontalPoints);
            panel.add(new THREE.Line(horizontalGeometry, gridMaterial));
        }

        // Metal arm connecting panel to the satellite body
        const support = new THREE.Mesh(
            new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8),
            antennaMaterial
        );
        support.rotation.z = Math.PI / 2;
        support.position.x = side * 0.35;
        satellite.add(support);

        panel.position.x = side * 0.62;
        satellite.add(panel);
    }

    createSolarPanel(-1);
    createSolarPanel(1);

    // Antenna mast
    const antennaStem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.35, 8),
        antennaMaterial
    );
    antennaStem.position.y = 0.38;
    satellite.add(antennaStem);

    // Small dish antenna
    const dish = new THREE.Mesh(
        new THREE.SphereGeometry(
            0.14, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2
        ),
        antennaMaterial
    );
    dish.position.y = 0.57;
    satellite.add(dish);

    const antennaTip = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 12, 12),
        goldMaterial
    );
    antennaTip.position.y = 0.68;
    satellite.add(antennaTip);

    // Small side-mounted instrument
    const sideEquipment = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.13, 0.12),
        darkMaterial
    );
    sideEquipment.position.set(0.19, -0.12, 0.12);
    satellite.add(sideEquipment);

    satellite.scale.setScalar(0.85);
    return satellite;
}

// ======================================
// 6. ORBIT PATHS AND SATELLITES
// ======================================

const satellites = [];

const orbitSettings = [
    { radius: 2.48, speed: 0.38, tiltX: 0.38, tiltZ: 0.25 },
    { radius: 2.68, speed: -0.29, tiltX: -0.55, tiltZ: -0.35 },
    { radius: 2.82, speed: 0.22, tiltX: 0.85, tiltZ: 0.5 }
];

orbitSettings.forEach((settings, index) => {
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.set(settings.tiltX, 0, settings.tiltZ);
    scene.add(orbitGroup);

    // Subtle elliptical orbit line
    const orbitPoints = [];
    for (let i = 0; i <= 160; i++) {
        const angle = (i / 160) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(
            Math.cos(angle) * settings.radius,
            Math.sin(angle) * settings.radius * 0.72,
            0
        ));
    }

    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x58baff,
        transparent: true,
        opacity: 0.25
    });
    orbitGroup.add(new THREE.LineLoop(orbitGeometry, orbitMaterial));

    const satellite = createSatellite();
    satellite.position.set(settings.radius, 0, 0);
    satellite.rotation.set(0.3 + index * 0.2, index * 0.8, 0.2);
    orbitGroup.add(satellite);

    satellites.push({
        group: orbitGroup,
        satellite,
        speed: settings.speed
    });
});

// ======================================
// 7. ANIMATION
// ======================================

const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsed = clock.elapsedTime;

    satellites.forEach((item, index) => {
        item.group.rotation.y += item.speed * delta;
        item.satellite.rotation.y += 0.12 * delta;
        item.satellite.rotation.z = Math.sin(elapsed + index) * 0.06;
    });

    renderer.render(scene, camera);
}

// ======================================
// 8. RESPONSIVE RESIZE
// ======================================

function resizeScene() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;

    const newAspect = width / height;
    camera.left = -viewSize * newAspect / 2;
    camera.right = viewSize * newAspect / 2;
    camera.top = viewSize / 2;
    camera.bottom = -viewSize / 2;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
}

const resizeObserver = new ResizeObserver(resizeScene);
resizeObserver.observe(container);
window.addEventListener("resize", resizeScene);
resizeScene();
animate();