import 'styles/index.scss';
import {
    AmbientLight,
    CylinderGeometry,
    DirectionalLight,
    DoubleSide,
    Face3,
    FlatShading,
    Fog,
    Geometry,
    HemisphereLight,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    Object3D,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    Vector3,
    WebGLRenderer
} from 'three';
import * as Hammer from 'hammerjs';

window.Hammer = Hammer.default;

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
let bee, sea, earth;
let HEIGHT, WIDTH;
let coins = [];
let bombs = [];
let score = 0;
let level = 0;
let dead = false;
let speedFactor = 0;
const target = new Vector3();
let ambientLight, hemisphereLight, shadowLight;

window.addEventListener('load', init, false);

function init() {
    createScene();
    createLights();
    createBee();
    createCoin();
    createEarth();
    createSea();
    document.addEventListener('mousemove', handleMouseMove, false);
    loop();
}

// Handle touch/mobile
const myElement = document.getElementById('world');
const mc = new window.Hammer(myElement);
mc.get('pan').set({direction: window.Hammer.DIRECTION_ALL});
mc.on("panleft panright panup pandown tap press", function (ev) {
    const tx = -1 + (ev.center.x / WIDTH) * 2;
    const ty = 1 - (ev.center.y / HEIGHT) * 2;

    mousePos = {
        x: tx,
        y: ty,
    };
});

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 55;
    from = 1;
    to = 10000;

    camera = new PerspectiveCamera(fieldOfView, aspectRatio, from, to);

    scene.fog = new Fog(colors.grey, 100, 1000);

    camera.position.x = 0;
    camera.position.z = 220;
    camera.position.y = 150;
    camera.rotation.x = -Math.PI / 6;

    renderer = new WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    container.appendChild(renderer.domElement);

    renderer.render(scene, camera);
    window.addEventListener('resize', handleWindowResize, false);
}

function createLights() {
    hemisphereLight = new HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    shadowLight = new DirectionalLight(0xffffff, 0.6);
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

    ambientLight = new AmbientLight(0xff8d8d, 0.9);

    scene.add(ambientLight);
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

function createCoin(nb = 100, patternFactor = 2) {
    let i = 0;
    for (i; i < nb; i++) {
        coins[i] = new Coin(i, patternFactor);
        scene.add(coins[i].mesh);
    }
}

function createBomb(nb) {
    for (let i = 0; i < nb; i++) {
        bombs[i] = new Bomb();
        scene.add(bombs[i].mesh);
    }
}

function createBee() {
    bee = new Bee();
    bee.mesh.scale.set(0.25, 0.25, 0.25);
    bee.mesh.position.y = 0;
    bee.mesh.position.z = 0;
    scene.add(bee.mesh);
}

function createEarth() {
    earth = new Earth();
    earth.moveHills();
    scene.add(earth.mesh);
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
let Bee = function () {
    this.mesh = new Object3D();

    // HEAD
    const geomHead = new SphereGeometry(55, 32, 32);
    const matHead = new MeshPhongMaterial({
        color: colors.black,
        flatShading: FlatShading,
    });

    this.head = new Mesh(geomHead, matHead);
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    this.head.position.z -= 130;
    this.head.position.y -= 10;
    this.mesh.add(this.head);

    // BODY1
    const geomBody1 = new SphereGeometry(65, 32, 32);
    const matBody1 = new MeshPhongMaterial({
        color: colors.yellow,
        flatShading: FlatShading,
    });

    this.body1 = new Mesh(geomBody1, matBody1);
    this.body1.castShadow = true;
    this.body1.receiveShadow = true;
    this.body1.position.z = -100;
    this.mesh.add(this.body1);

    // BODY2
    const geomBody2 = new SphereGeometry(70, 32, 32);
    const matBody2 = new MeshPhongMaterial({
        color: colors.black,
        flatShading: FlatShading,
    });

    this.body2 = new Mesh(geomBody2, matBody2);
    this.body2.castShadow = true;
    this.body2.receiveShadow = true;
    this.body2.position.z -= 70;
    this.mesh.add(this.body2);

    // BODYWING
    const geomBodyWing = new SphereGeometry(30, 32, 32);
    const matBodyWing = new MeshPhongMaterial({
        color: colors.black,
        flatShading: FlatShading,
    });

    this.bodyWing = new Mesh(geomBodyWing, matBodyWing);
    this.bodyWing.castShadow = true;
    this.bodyWing.receiveShadow = true;
    this.bodyWing.position.z -= 70;
    this.bodyWing.position.y += 50;
    this.mesh.add(this.bodyWing);

    // BODY3
    const geomBody3 = new SphereGeometry(65, 32, 32);
    const matBody3 = new MeshPhongMaterial({
        color: colors.yellow,
        flatShading: FlatShading,
    });

    this.body3 = new Mesh(geomBody3, matBody3);
    this.body3.castShadow = true;
    this.body3.receiveShadow = true;
    this.body3.position.z -= 40;
    this.mesh.add(this.body3);

    // TAIL
    const geomTail = new SphereGeometry(45, 32, 32);
    const matTail = new MeshPhongMaterial({
        color: colors.black,
        flatShading: FlatShading,
    });

    this.tail = new Mesh(geomTail, matTail);
    this.tail.castShadow = true;
    this.tail.receiveShadow = true;
    this.tail.position.z = 0;
    this.head.position.y -= 10;
    this.mesh.add(this.tail);

    // WINGS
    const geomWing = new Geometry();

    geomWing.vertices.push(new Vector3(150, 100, -100));
    geomWing.vertices.push(new Vector3(200, 100, 50));
    geomWing.vertices.push(new Vector3(150, 100, 150));
    geomWing.vertices.push(new Vector3(0, 0, 0));

    geomWing.vertices.push(new Vector3(-150, 100, -100));
    geomWing.vertices.push(new Vector3(-200, 100, 50));
    geomWing.vertices.push(new Vector3(-150, 100, 150));
    geomWing.vertices.push(new Vector3(0, 0, 0));

    geomWing.faces.push(new Face3(0, 1, 2));
    geomWing.faces.push(new Face3(0, 3, 2));

    geomWing.faces.push(new Face3(4, 5, 6));
    geomWing.faces.push(new Face3(4, 6, 7));

    const material = new MeshBasicMaterial({
        color: colors.white,
        transparent: true,
        opacity: 0.5,
        side: DoubleSide,
    });

    this.wings = new Mesh(geomWing, material);
    this.wings.castShadow = true;
    this.wings.receiveShadow = true;
    this.wings.position.x = 0;
    this.wings.position.y = 75;
    this.wings.position.z = -65;
    this.mesh.add(this.wings);

    // STING
    const geomSting = new CylinderGeometry(20, 0, 50, 10);
    const matSting = new MeshPhongMaterial({
        color: colors.white,
        flatShading: FlatShading,
    });

    this.sting = new Mesh(geomSting, matSting);
    this.sting.castShadow = true;
    this.sting.receiveShadow = true;
    this.sting.position.z += 50;
    this.sting.position.y -= 10;
    this.sting.rotation.x = Math.PI * 1.6;
    this.mesh.add(this.sting);
};

// =============================
// =========== EARTH ===========
// =============================
let Earth = function () {
    const geom = new CylinderGeometry(500, 500, 2900, 33, 34);
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

    const mat = new MeshPhongMaterial({
        color: 0x38661f,
        opacity: 0.6,
        flatShading: FlatShading,
    });

    this.mesh = new Mesh(geom, mat);
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

    earth.mesh.rotation.z += 0.1;
};

// =============================
// ============ SEA ============
// =============================
let Sea = function () {
    const geom = new CylinderGeometry(480, 480, 2900, 100, 34);
    geom.mergeVertices();

    const mat = new MeshPhongMaterial({
        color: 0x00c0ff,
        opacity: 0.4,
        flatShading: FlatShading,
    });

    this.mesh = new Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.z += Math.PI / 2;
    this.mesh.position.y -= 700;
};

// =============================
// ============ COIN ===========
// =============================
let Coin = function (i, patternFactor = 2) {
    this.mesh = new Object3D();
    this.radius = 1200;
    this.side = 15;
    this.s = (Math.PI * i) / patternFactor;
    this.t = (Math.PI * i) / 180;

    const geom = new CylinderGeometry(this.side, this.side, 5, 32);
    const mat = new MeshPhongMaterial({
        color: colors.yellow,
        opacity: 0.8,
        flatShading: FlatShading,
    });

    this.coin = new Mesh(geom, mat);
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

// =============================
// ============ BOMB ===========
// =============================
let Bomb = function () {
    this.mesh = new Object3D();
    this.radius = 1200;
    this.side = 20;
    this.s = (Math.PI * getRandomInt(0, 360)) / 180;
    this.t = (Math.PI * getRandomInt(0, 360)) / 180;

    const geom = new SphereGeometry(this.side, this.side, 5, 32);
    const mat = new MeshPhongMaterial({
        color: colors.black,
        opacity: 0.8,
        flatShading: FlatShading,
    });

    this.bomb = new Mesh(geom, mat);
    this.bomb.receiveShadow = true;
    this.bomb.castShadow = true;

    const xAxis = this.radius * Math.cos(this.s) * Math.sin(this.t);
    const yAxis = this.radius * Math.sin(this.s) * Math.sin(this.t);
    const zAxis = this.radius * Math.cos(this.t);

    this.bomb.position.x = xAxis;
    this.bomb.position.y = yAxis;
    this.bomb.position.z = zAxis;
    this.bomb.rotation.z = zAxis;
    this.bomb.rotation.x = zAxis;
    this.bomb.rotation.y = zAxis;
    this.mesh.position.y -= 1200;
    this.mesh.add(this.bomb);
};

// =============================
// ====== COLLISION LOGIC ======
// =============================
function checkCollision(coin, bee, distance) {
    return (coin.z >= bee.z - distance && coin.z <= bee.z + distance)
        && (coin.x >= bee.x - distance && coin.x <= bee.x + distance)
        && (coin.y >= bee.y - distance && coin.y <= bee.y + distance);
}

function handleCollision(speed) {
    // COINS
    for (let [index, coin] of coins.entries()) {
        if (checkCollision(
            coin.mesh.children[0].getWorldPosition(target),
            bee.mesh.position,
            60
        )) {
            scene.remove(coin.mesh);
            coins.splice(index, 1);
            document.getElementById('js-score').innerHTML = score;
            updateLevel();
        } else {
            coin.mesh.children[0].rotation.y += 0.1;
            coin.mesh.children[0].rotation.z += 0.1;
            coin.mesh.children[0].rotation.x += 0.1;
            coin.mesh.rotation.x += speed;
        }
    }

    //BOMBS
    for (let bomb of bombs) {
        if (checkCollision(
            bomb.mesh.children[0].getWorldPosition(target),
            bee.mesh.position,
            60
        )) {
            dead = true;
        }

        bomb.mesh.children[0].rotation.y += 0.1;
        bomb.mesh.rotation.x += speed + .005;
    }
}

// =============================
// ======= UPDATE LOGIC ========
// =============================
function cleanAndAdd(nb, patternFactor) {
    for (let coin of coins) {
        scene.remove(coin.mesh);
    }
    createCoin(nb, patternFactor);
}

function updateLevel() {
    score += 1;

    if (score === 52) {
        console.log('LEVEL UP');
        level = 1;
        speedFactor = .002;
        earth.mesh.material.color = {r: 0.34296287321416097, g: 0.47372536190925696, b: 0.7874397845987531};
        cleanAndAdd(100, 5);
    } else if (score === 65) {
        level = 2;
        speedFactor = .004;
        earth.mesh.material.color = {r: 0.14125641049773652, g: 0.0862999136911784, b: 0.2521665747347359};
        createBomb(10);
        cleanAndAdd(220, 10);
    } else if (score === 100) {
        level = 3;
        speedFactor = .006;
        earth.mesh.material.color = {r: 0.7950386478486318, g: 0.4352420987190768, b: 0.14264124412486234};
        cleanAndAdd(200, 10);
    } else if (score === 150) {
        level = 4;
        speedFactor = .008;
        earth.mesh.material.color = {r: 0.8807532351956822, g: 0.15956408835556335, b: 0.632655339784824};
        cleanAndAdd(220, 10);
    } else if (score === 180) {
        level = 5;
        speedFactor = .01;
        earth.mesh.material.color = {r: 0.8807532351956822, g: 0.15956408835556335, b: 0.632655339784824};
        cleanAndAdd(100, 20);
    }
}

function updateBee() {
    const targetX = normalize(mousePos.x, -1, 1, -100, 100);
    let targetZ = normalize(mousePos.y, -1, 1, 100, -200);

    bee.mesh.position.x += (targetX - bee.mesh.position.x / 2) * 0.2;
    bee.mesh.position.z += (targetZ - bee.mesh.position.z) * 0.2;
    bee.mesh.rotation.x -= mousePos.y / 2;

    bee.mesh.rotation.x = (targetZ - bee.mesh.position.z) * 0.015;
    bee.mesh.rotation.y = (targetX - bee.mesh.position.x / 1.5) * -0.01;
    bee.mesh.rotation.z = (targetX - bee.mesh.position.x / 1.5) * -0.01;

    // Check if bee is forward or backward
    if (targetZ > 0) {
        earth.mesh.rotation.x += 0.002 + targetZ / 100000 + speedFactor;
        const speed = 0.001 + targetZ / 100000 + speedFactor; // Move slower
        handleCollision(speed);
    } else {
        earth.mesh.rotation.x += 0.005 + -targetZ / 10000 + speedFactor;
        const speed = 0.001 + -targetZ / 10000 + speedFactor; // Move faster
        handleCollision(speed);
    }

    // Min wing speed
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
}

function loop() {
    renderer.render(scene, camera);
    updateBee();
    dead ? console.log("DEAD") : requestAnimationFrame(loop);
}
