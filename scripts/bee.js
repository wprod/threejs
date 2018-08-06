let Colors = {
    red: 0xf25346,
    black: 0x333359,
    white: 0xd8d0d1,
    pink: 0xf5986e,
    blue: 0x68c3c0,
    grey: 0x5f5f5f
};

let mousePos = {
    x: 0,
    y: 0
};
window.addEventListener("load", init, false);

function init() {
    createScene();
    createLights();
    createBee();
    createParticle();
    // createSea();
    document.addEventListener("mousemove", handleMouseMove, false);
    loop();
}

let scene,
    fieldOfView,
    aspectRatio,
    nearBee,
    farBee,
    renderer,
    container;

let HEIGHT, WIDTH;

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearBee = 1;
    farBee = 10000;

    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearBee,
        farBee
    );

    scene.fog = new THREE.Fog(0xf58585, 100, 780);

    camera.position.x = 0;
    camera.position.z = 220;
    camera.position.y = 150;
    camera.rotation.x = -Math.PI / 6;

    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById("world");
    container.appendChild(renderer.domElement);

    renderer.render(scene, camera);
    window.addEventListener("resize", handleWindowResize, false);
}

function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    renderer.setSize(WIDTH, HEIGHT);

    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function handleMouseMove(event) {
    let tx = -1 + event.clientX / WIDTH * 2;
    let ty = 1 - event.clientY / HEIGHT * 2;

    mousePos = {
        x: tx,
        y: ty
    };
}

let ambientLight, hemisphereLight, shadowLight;

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
    shadowLight.position.set(150, 420, 350);
    shadowLight.castShadow = true;
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    ambientLight = new THREE.AmbientLight(0xff8d8d, 0.5);

    scene.add(ambientLight);
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}

let Bee = function () {
    this.mesh = new THREE.Object3D();

    let geometryHead = new THREE.SphereGeometry(35, 32, 32);
    let materialHead = new THREE.MeshPhongMaterial({
        color: Colors.black,
        shading: THREE.FlatShading
    });

    this.head = new THREE.Mesh(geometryHead, materialHead);
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    this.mesh.add(this.head);

    let geometrySideWing = new THREE.BoxGeometry(100, 3, 130, 1, 1, 1);
    let materialSideWing = new THREE.MeshPhongMaterial({
        color: Colors.blue,
        shading: THREE.FlatShading
    });

    geometrySideWing.vertices[5].z += 70;
    geometrySideWing.vertices[7].z += 70;
    geometrySideWing.vertices[4].z -= 70;
    geometrySideWing.vertices[6].z -= 70;

    let sideWing = new THREE.Mesh(geometrySideWing, materialSideWing);

    sideWing.castShadow = true;
    sideWing.receiveShadow = true;
    sideWing.position.z += 40;
    sideWing.position.y -= 10;
    sideWing.rotation.y = Math.PI / 2;

    this.mesh.add(sideWing);

    let geomExha = new THREE.CylinderGeometry(20, 5, 30, 10);
    let matExha = new THREE.MeshPhongMaterial({
        color: Colors.white,
        shading: THREE.FlatShading
    });

    let Exha = [];
    Exha[0] = new THREE.Mesh(geomExha, matExha);
    Exha[0].castShadow = true;
    Exha[0].receiveShadow = true;
    Exha[0].position.z += 120;
    Exha[0].position.x -= 30;
    Exha[0].rotation.x = Math.PI / 2;

    Exha[1] = new THREE.Mesh(geomExha, matExha);
    Exha[1].castShadow = true;
    Exha[1].receiveShadow = true;
    Exha[1].position.z += 120;
    Exha[1].position.x += 30;
    Exha[1].rotation.x = Math.PI / 2;

    this.mesh.add(Exha[0], Exha[1]);

    let geomExha_i = new THREE.CylinderGeometry(17, 17, 30, 33);
    let matExha_i = new THREE.MeshPhongMaterial({
        color: Colors.grey,
        shading: THREE.FlatShading
    });

    let Exha_i = [];
    Exha_i[0] = new THREE.Mesh(geomExha_i, matExha_i);
    Exha_i[0].castShadow = true;
    Exha_i[0].receiveShadow = true;
    Exha_i[0].position.z += 105;
    Exha_i[0].position.x -= 30;
    Exha_i[0].rotation.x = Math.PI / 2;

    Exha_i[1] = new THREE.Mesh(geomExha_i, matExha_i);
    Exha_i[1].castShadow = true;
    Exha_i[1].receiveShadow = true;
    Exha_i[1].position.z += 105;
    Exha_i[1].position.x += 30;
    Exha_i[1].rotation.x = Math.PI / 2;

    this.mesh.add(Exha_i[0], Exha_i[1]);

    let geomWin = new THREE.BoxGeometry(80, 30, 30, 1, 1, 1);
    let matWin = new THREE.MeshPhongMaterial({
        color: Colors.pink,
        shading: THREE.FlatShading
    });
    let Win;

    geomWin.vertices[4].y -= 10;
    geomWin.vertices[1].y -= 10;
    geomWin.vertices[6].z -= 30;
    geomWin.vertices[3].z -= 30;
    geomWin.vertices[7].z += 30;
    geomWin.vertices[2].z += 30;
    Win = new THREE.Mesh(geomWin, matWin);
    Win.castShadow = true;
    Win.receiveShadow = true;
    Win.position.y += 10;

    this.mesh.add(Win);
};

Sea = function () {
    let geom = new THREE.CylinderGeometry(500, 500, 2900, 33, 34);
    geom.mergeVertices();
    let l = geom.vertices.length;
    this.waves = [];

    for (let i = 0; i < l; i++) {
        let v = geom.vertices[i];

        this.waves.push({
            y: v.y,
            x: v.x,
            z: v.z,
            ang: Math.random() * Math.PI * 2,
            amp: 20 + Math.random() * 15,
            speed: 0.016 + Math.random() * 0.032
        });
    }

    let mat = new THREE.MeshPhongMaterial({
        color: 0x54b2a9,
        opacity: 0.9,
        shading: THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.z += Math.PI / 2;
    this.mesh.position.y -= 700;
};

Sea.prototype.moveWaves = function () {
    let verts = this.mesh.geometry.vertices;
    let l = verts.length;

    for (let i = 0; i < l; i++) {
        let v = verts[i];
        let vprops = this.waves[i];
        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

        vprops.ang += vprops.speed;
    }

    this.mesh.geometry.verticesNeedUpdate = true;

    sea.mesh.rotation.z += 0.005;
};

let bee;

function createBee() {
    bee = new Bee();
    bee.mesh.scale.set(0.25, 0.25, 0.25);
    bee.mesh.position.y = 0;
    bee.mesh.position.z = 0;
    scene.add(bee.mesh);

}

function createSea() {
    sea = new Sea();
    sea.moveWaves();
    scene.add(sea.mesh);
}

function updateBee() {
    let targetX = normalize(mousePos.x, -1, 1, -100, 100);
    let targetZ = normalize(mousePos.y, -1, 1, 100, -200);
    bee.mesh.position.x += (targetX - bee.mesh.position.x) * 0.1;
    bee.mesh.position.z += (targetZ - bee.mesh.position.z) * 0.1;
    if (targetZ > 0) {
        // sea.mesh.rotation.x += 0.002 + targetZ / 100000;
        for (let i = 0; i < p.length; i++) {
            p[i].mesh.rotation.x += 0.001 + targetZ / 300000;
        }
    } else {
        // sea.mesh.rotation.x += 0.005 + -targetZ / 10000;
        for (let i = 0; i < p.length; i++) {
            p[i].mesh.rotation.x += 0.001 + -targetZ / 30000;
        }
    }

    bee.mesh.rotation.z = 0;
}

function normalize(v, vmin, vmax, tmin, tmax) {
    let nv = Math.max(Math.min(v, vmax), vmin);
    let dv = vmax - vmin;
    let pc = (nv - vmin) / dv;
    let dt = tmax - tmin;
    let tv = tmin + pc * dt;
    return tv;
}

let Particle = function () {
    this.mesh = new THREE.Object3D();
    this.radius = 1400;
    this.side = 3;
    this.s = Math.PI * getRandomInt(0, 360) / 180;
    this.t = Math.PI * getRandomInt(0, 360) / 180;

    geom = new THREE.BoxGeometry(this.side, this.side, this.side, 1, 1, 1);

    mat = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shading: THREE.FlatShading
    });

    let xAxis = this.radius * Math.cos(this.s) * Math.sin(this.t);
    let yAxis = this.radius * Math.sin(this.s) * Math.sin(this.t);
    let zAxis = this.radius * Math.cos(this.t);

    this.par = new THREE.Mesh(geom, mat);
    this.par.position.x = xAxis;
    this.par.position.y = yAxis;
    this.par.position.z = zAxis;

    this.mesh.add(this.par);
};

let p = [];

function createParticle() {
    for (let i = 0; i < 1000; i++) {
        p[i] = new Particle();
        scene.add(p[i].mesh);
    }
}

function loop() {
    let a = 0.01;
    bee.mesh.position.y += Math.sin(a);
    bee.mesh.rotation.z += Math.sin(a);
    renderer.render(scene, camera);
    updateBee();
    requestAnimationFrame(loop);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}