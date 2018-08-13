import 'styles/index.scss';
import * as THREE from 'three';

const colors = {
    green: 0x2bca2b,
    black: 0x333359,
    white: 0xd8d0d1,
    pink: 0xf5986e,
    blue: 0x68c3c0,
    grey: 0x5f5f5f,
    yellow: 0xe7af11,
};

let mousePos = {
    x: 0,
    y: 0,
};

let scene, fieldOfView, aspectRatio, renderer, from, to, camera, container;

let bee, sea, floor;

let HEIGHT, WIDTH;

let coins = [];

let ambientLight, hemisphereLight, shadowLight;

window.addEventListener('load', init, false);

function init() {
    createScene();
    createLights();
    createBee();
    createCoin();
    createFloor();
    createSea();
    document.addEventListener('mousemove', handleMouseMove, false);
    loop();
}

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 55;
    from = 1;
    to = 10000;

    camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, from, to);

    scene.fog = new THREE.Fog(colors.grey, 100, 1000);

    camera.position.x = 0;
    camera.position.z = 220;
    camera.position.y = 150;
    camera.rotation.x = -Math.PI / 6;

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    renderer.render(scene, camera);
    window.addEventListener('resize', handleWindowResize, false);
}

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    shadowLight = new THREE.DirectionalLight(0xffffff, 0.6);
    shadowLight.position.set(150, 490, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    ambientLight = new THREE.AmbientLight(0xff8d8d, 0.9);

    scene.add(ambientLight);
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function createCoin() {
    for (let i = 0; i < 50; i++) {
        coins[i] = new Coin();
        scene.add(coins[i].mesh);
    }
}

function createBee() {
    bee = new Index();
    bee.mesh.scale.set(0.25, 0.25, 0.25);
    bee.mesh.position.y = 0;
    bee.mesh.position.z = 0;
    scene.add(bee.mesh);
}

function createFloor() {
    floor = new Earth();
    floor.moveHills();
    scene.add(floor.mesh);
}

function createSea() {
    sea = new Sea();
    scene.add(sea.mesh);
}

// =============================
// ========= UTILITIES =========
// =============================
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    renderer.setSize(WIDTH, HEIGHT);

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
    const tx = -1 + (event.clientX / WIDTH) * 2;
    const ty = 1 - (event.clientY / HEIGHT) * 2;

    mousePos = {
        x: tx,
        y: ty,
    };
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

// NORMALIZER
function normalize(v, vmin, vmax, tmin, tmax) {
    const nv = Math.max(Math.min(v, vmax), vmin);
    const dv = vmax - vmin;
    const pc = (nv - vmin) / dv;
    const dt = tmax - tmin;
    const tv = tmin + pc * dt;
    return tv;
}

// =============================
// ============ BEE ============
// =============================
let Index = function () {
    this.mesh = new THREE.Object3D();

    // HEAD
    const geomHead = new THREE.SphereGeometry(55, 32, 32);
    const matHead = new THREE.MeshPhongMaterial({
        color: colors.black,
        flatShading: THREE.FlatShading,
    });

    this.head = new THREE.Mesh(geomHead, matHead);
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    this.head.position.z -= 130;
    this.head.position.y -= 10;
    this.mesh.add(this.head);

    // BODY1
    const geomBody1 = new THREE.SphereGeometry(65, 32, 32);
    const matBody1 = new THREE.MeshPhongMaterial({
        color: colors.yellow,
        flatShading: THREE.FlatShading,
    });

    this.body1 = new THREE.Mesh(geomBody1, matBody1);
    this.body1.castShadow = true;
    this.body1.receiveShadow = true;
    this.body1.position.z = -100;
    this.mesh.add(this.body1);

    // BODY2
    const geomBody2 = new THREE.SphereGeometry(70, 32, 32);
    const matBody2 = new THREE.MeshPhongMaterial({
        color: colors.black,
        flatShading: THREE.FlatShading,
    });

    this.body2 = new THREE.Mesh(geomBody2, matBody2);
    this.body2.castShadow = true;
    this.body2.receiveShadow = true;
    this.body2.position.z -= 70;
    this.mesh.add(this.body2);

    // BODYWING
    const geomBodyWing = new THREE.SphereGeometry(30, 32, 32);
    const matBodyWing = new THREE.MeshPhongMaterial({
        color: colors.black,
        flatShading: THREE.FlatShading,
    });

    this.bodyWing = new THREE.Mesh(geomBodyWing, matBodyWing);
    this.bodyWing.castShadow = true;
    this.bodyWing.receiveShadow = true;
    this.bodyWing.position.z -= 70;
    this.bodyWing.position.y += 50;
    this.mesh.add(this.bodyWing);

    // BODY3
    const geomBody3 = new THREE.SphereGeometry(65, 32, 32);
    const matBody3 = new THREE.MeshPhongMaterial({
        color: colors.yellow,
        flatShading: THREE.FlatShading,
    });

    this.body3 = new THREE.Mesh(geomBody3, matBody3);
    this.body3.castShadow = true;
    this.body3.receiveShadow = true;
    this.body3.position.z -= 40;
    this.mesh.add(this.body3);

    // TAIL
    const geomTail = new THREE.SphereGeometry(45, 32, 32);
    const matTail = new THREE.MeshPhongMaterial({
        color: colors.black,
        flatShading: THREE.FlatShading,
    });

    this.tail = new THREE.Mesh(geomTail, matTail);
    this.tail.castShadow = true;
    this.tail.receiveShadow = true;
    this.tail.position.z = 0;
    this.head.position.y -= 10;
    this.mesh.add(this.tail);

    // WINGS
    const geomWing = new THREE.Geometry();

    geomWing.vertices.push(new THREE.Vector3(150, 100, -100));
    geomWing.vertices.push(new THREE.Vector3(200, 100, 50));
    geomWing.vertices.push(new THREE.Vector3(150, 100, 150));
    geomWing.vertices.push(new THREE.Vector3(0, 0, 0));

    geomWing.vertices.push(new THREE.Vector3(-150, 100, -100));
    geomWing.vertices.push(new THREE.Vector3(-200, 100, 50));
    geomWing.vertices.push(new THREE.Vector3(-150, 100, 150));
    geomWing.vertices.push(new THREE.Vector3(0, 0, 0));

    geomWing.faces.push(new THREE.Face3(0, 1, 2));
    geomWing.faces.push(new THREE.Face3(0, 3, 2));

    geomWing.faces.push(new THREE.Face3(4, 5, 6));
    geomWing.faces.push(new THREE.Face3(4, 6, 7));

    const material = new THREE.MeshBasicMaterial({
        color: colors.white,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
    });

    this.wings = new THREE.Mesh(geomWing, material);
    this.wings.castShadow = true;
    this.wings.receiveShadow = true;
    this.wings.position.x = 0;
    this.wings.position.y = 75;
    this.wings.position.z = -65;
    this.mesh.add(this.wings);

    // STING
    const geomDard = new THREE.CylinderGeometry(20, 0, 50, 10);
    const matDard = new THREE.MeshPhongMaterial({
        color: colors.white,
        flatShading: THREE.FlatShading,
    });

    this.dard = new THREE.Mesh(geomDard, matDard);
    this.dard.castShadow = true;
    this.dard.receiveShadow = true;
    this.dard.position.z += 50;
    this.dard.position.y -= 10;
    this.dard.rotation.x = Math.PI * 1.6;
    this.mesh.add(this.dard);
};

// =============================
// =========== FLOOR ===========
// =============================
let Earth = function () {
    const geom = new THREE.CylinderGeometry(500, 500, 2900, 33, 34);
    geom.mergeVertices();
    const l = geom.vertices.length;
    this.hills = [];

    for (let i = 0; i < l; i++) {
        const v = geom.vertices[i];

        this.hills.push({
            y: v.y,
            x: v.x,
            z: v.z,
            ang: Math.random() * Math.PI * 2 + 10,
            amp: 20 + Math.random() * 30,
            speed: 6 + Math.random() * 0.032,
        });
    }

    const mat = new THREE.MeshPhongMaterial({
        color: 0x38661f,
        opacity: 0.6,
        flatShading: THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.z += Math.PI / 2;
    this.mesh.position.y -= 700;
};

Earth.prototype.moveHills = function () {
    const verts = this.mesh.geometry.vertices;
    const l = verts.length;

    for (let i = 0; i < l; i++) {
        const v = verts[i];
        const vprops = this.hills[i];
        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

        vprops.ang += vprops.speed;
    }

    this.mesh.geometry.verticesNeedUpdate = true;

    floor.mesh.rotation.z += 0.1;
};

// =============================
// ============ SEA ============
// =============================
let Sea = function () {
    const geom = new THREE.CylinderGeometry(480, 480, 2900, 100, 34);
    geom.mergeVertices();

    const mat = new THREE.MeshPhongMaterial({
        color: 0x00c0ff,
        opacity: 0.4,
        flatShading: THREE.FlatShading,
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.z += Math.PI / 2;
    this.mesh.position.y -= 700;
};

let Coin = function () {
    this.mesh = new THREE.Object3D();
    this.radius = 1200;
    this.side = 20;
    this.s = (Math.PI * getRandomInt(0, 360)) / 180;
    this.t = (Math.PI * getRandomInt(0, 360)) / 180;

    const geom = new THREE.CylinderGeometry(this.side, this.side, 5, 32);
    const mat = new THREE.MeshPhongMaterial({
        color: colors.yellow,
        opacity: 0.8,
        flatShading: THREE.FlatShading,
    });

    this.coin = new THREE.Mesh(geom, mat);
    this.coin.receiveShadow = true;
    this.coin.castShadow = true;

    const xAxis = this.radius * Math.cos(this.s) * Math.sin(this.t);
    const yAxis = this.radius * Math.sin(this.s) * Math.sin(this.t);
    const zAxis = this.radius * Math.cos(this.t);

    this.coin.position.x = xAxis;
    this.coin.position.y = yAxis;
    this.coin.position.z = zAxis;
    this.coin.rotation.z = zAxis;
    this.coin.rotation.x = zAxis;
    this.coin.rotation.y = zAxis;
    this.mesh.position.y -= 1200;
    this.mesh.add(this.coin);
};

function checkCollision(a, b) {
    console.log('---------------');
    console.log('COIN ==> ', a);
    console.log('BEE ==> ', b);

    if (a.z >= b.z - 5 && a.z <= b.z + 5) {
        console.log('HIT');
    }
}

function updateBee() {
    const targetX = normalize(mousePos.x, -1, 1, -100, 100);
    let targetZ = normalize(mousePos.y, -1, 1, 100, -200);

    bee.mesh.position.x += (targetX - bee.mesh.position.x / 2) * 0.1;
    bee.mesh.position.z += (targetZ - bee.mesh.position.z) * 0.1;

    bee.mesh.rotation.x = (targetZ - bee.mesh.position.z) * 0.015;
    bee.mesh.rotation.y = (targetX - bee.mesh.position.x / 1.5) * -0.01;

    if (targetZ > 0) {
        floor.mesh.rotation.x += 0.002 + targetZ / 100000;
        for (const coin of coins) {
            coin.mesh.rotation.x += 0.001 + targetZ / 300000;
            // checkCollision(coins[i].mesh.children[0].position, bee.mesh.position);
            coin.mesh.children[0].rotation.y += 0.1;
            coin.mesh.children[0].rotation.z += 0.1;
            coin.mesh.children[0].rotation.x += 0.1;
        }
    } else {
        floor.mesh.rotation.x += 0.005 + -targetZ / 10000;
        for (const coin of coins) {
            coin.mesh.rotation.x += 0.001 + -targetZ / 30000;
            // checkCollision(coins[i].mesh.children[0].position, bee.mesh.position);
            coin.mesh.children[0].rotation.y += 0.1;
            coin.mesh.children[0].rotation.z += 0.1;
            coin.mesh.children[0].rotation.x += 0.1;
        }
    }

    if (targetZ > -40) {
        targetZ = -40;
    } else if (targetZ < -150) {
        targetZ = -150;
    }

    let normalisedSpeed = Math.sqrt(targetZ * targetZ);

    if (bee.wings.geometry.vertices[0].y < 0 || bee.wings.geometry.vertices[0].y > 200) {
        normalisedSpeed *= -1;
    }

    bee.wings.geometry.vertices[0].y -= normalisedSpeed;
    bee.wings.geometry.vertices[1].y -= normalisedSpeed;
    bee.wings.geometry.vertices[2].y -= normalisedSpeed;

    bee.wings.geometry.vertices[4].y -= normalisedSpeed;
    bee.wings.geometry.vertices[5].y -= normalisedSpeed;
    bee.wings.geometry.vertices[6].y -= normalisedSpeed;

    bee.wings.geometry.verticesNeedUpdate = true;

    bee.mesh.rotation.z = 0;
}

function loop() {
    renderer.render(scene, camera);
    updateBee();
    requestAnimationFrame(loop);
}
