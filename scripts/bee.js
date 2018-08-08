let Colors = {
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
    y: 0
};

window.addEventListener("load", init, false);

function init() {
    createScene();
    createLights();
    createBee();
    createParticle();
    createFloor();
    createSea();
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

    scene.fog = new THREE.Fog(0x2e712e, 100, 780);

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

let Bee = function () {
    this.mesh = new THREE.Object3D();

    //HEAD
    let geomHead = new THREE.SphereGeometry(55, 32, 32);
    let matHead = new THREE.MeshPhongMaterial({
        color: Colors.black,
        shading: THREE.FlatShading
    });

    this.head = new THREE.Mesh(geomHead, matHead);
    this.head.castShadow = true;
    this.head.receiveShadow = true;
    this.head.position.z -= 130;
    this.head.position.y -= 10;
    this.mesh.add(this.head);

    //BODY1
    let geomBody1 = new THREE.SphereGeometry(65, 32, 32);
    let matBody1 = new THREE.MeshPhongMaterial({
        color: Colors.yellow,
        shading: THREE.FlatShading
    });

    this.body1 = new THREE.Mesh(geomBody1, matBody1);
    this.body1.castShadow = true;
    this.body1.receiveShadow = true;
    this.body1.position.z = -100;
    this.mesh.add(this.body1);

    //BODY2
    let geomBody2 = new THREE.SphereGeometry(70, 32, 32);
    let matBody2 = new THREE.MeshPhongMaterial({
        color: Colors.black,
        shading: THREE.FlatShading
    });

    this.body2 = new THREE.Mesh(geomBody2, matBody2);
    this.body2.castShadow = true;
    this.body2.receiveShadow = true;
    this.body2.position.z -= 70;
    this.mesh.add(this.body2);

    //BODYWING
    let geomBodyWing = new THREE.SphereGeometry(30, 32, 32);
    let matBodyWing = new THREE.MeshPhongMaterial({
        color: Colors.black,
        shading: THREE.FlatShading
    });

    this.bodyWing = new THREE.Mesh(geomBodyWing, matBodyWing);
    this.bodyWing.castShadow = true;
    this.bodyWing.receiveShadow = true;
    this.bodyWing.position.z -= 70;
    this.bodyWing.position.y += 50;
    this.mesh.add(this.bodyWing);

    //BODY3
    let geomBody3 = new THREE.SphereGeometry(65, 32, 32);
    let matBody3 = new THREE.MeshPhongMaterial({
        color: Colors.yellow,
        shading: THREE.FlatShading
    });

    this.body3 = new THREE.Mesh(geomBody3, matBody3);
    this.body3.castShadow = true;
    this.body3.receiveShadow = true;
    this.body3.position.z -= 40;
    this.mesh.add(this.body3);


    //TAIL
    let geomTail = new THREE.SphereGeometry(45, 32, 32);
    let matTail = new THREE.MeshPhongMaterial({
        color: Colors.black,
        shading: THREE.FlatShading
    });

    this.tail = new THREE.Mesh(geomTail, matTail);
    this.tail.castShadow = true;
    this.tail.receiveShadow = true;
    this.tail.position.z = 0;
    this.head.position.y -= 10;
    this.mesh.add(this.tail);

    //WINGS
    let geomWing = new THREE.Geometry();

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

    let material = new THREE.MeshBasicMaterial({
        color: Colors.white,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });

    this.wings = new THREE.Mesh(geomWing, material);
    this.wings.castShadow = true;
    this.wings.receiveShadow = true;
    this.wings.position.x = 0;
    this.wings.position.y = 75;
    this.wings.position.z = -65;
    this.mesh.add(this.wings);

    //STING
    let geomDard = new THREE.CylinderGeometry(20, 0, 50, 10);
    let matDard = new THREE.MeshPhongMaterial({
        color: Colors.white,
        shading: THREE.FlatShading
    });

    this.dard = new THREE.Mesh(geomDard, matDard);
    this.dard.castShadow = true;
    this.dard.receiveShadow = true;
    this.dard.position.z += 50;
    this.dard.position.y -= 10;
    this.dard.rotation.x = Math.PI * 1.6;
    this.mesh.add(this.dard);
};

Floor = function () {
    let geom = new THREE.CylinderGeometry(500, 500, 2900, 33, 34);
    geom.mergeVertices();
    let l = geom.vertices.length;
    this.hills = [];

    for (let i = 0; i < l; i++) {
        let v = geom.vertices[i];

        this.hills.push({
            y: v.y,
            x: v.x,
            z: v.z,
            ang: Math.random() * Math.PI * 2,
            amp: 20 + Math.random() * 60,
            speed: 6 + Math.random() * 0.032
        });
    }

    let mat = new THREE.MeshPhongMaterial({
        color: 0x671f02,
        opacity: 0.6,
        shading: THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.z += Math.PI / 2;
    this.mesh.position.y -= 700;
};

Floor.prototype.moveHills = function () {
    let verts = this.mesh.geometry.vertices;
    let l = verts.length;

    for (let i = 0; i < l; i++) {
        let v = verts[i];
        let vprops = this.hills[i];
        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;

        vprops.ang += vprops.speed;
    }

    this.mesh.geometry.verticesNeedUpdate = true;

    floor.mesh.rotation.z += 0.1;
};

Sea = function () {
    let geom = new THREE.CylinderGeometry(480, 480, 2900, 100, 34);
    geom.mergeVertices();

    let mat = new THREE.MeshPhongMaterial({
        color: 0x00c0ff,
        opacity: 0.4,
        shading: THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.rotation.z += Math.PI / 2;
    this.mesh.position.y -= 700;
};

function createBee() {
    bee = new Bee();
    bee.mesh.scale.set(0.25, 0.25, 0.25);
    bee.mesh.position.y = 0;
    bee.mesh.position.z = 0;
    scene.add(bee.mesh);
}

function createFloor() {
    floor = new Floor();
    floor.moveHills();
    scene.add(floor.mesh);
}

function createSea() {
    sea = new Sea();
    scene.add(sea.mesh);
}

function updateBee() {
    let targetX = normalize(mousePos.x, -1, 1, -100, 100);
    let targetZ = normalize(mousePos.y, -1, 1, 100, -200);
    bee.mesh.position.x += (targetX - bee.mesh.position.x) * 0.1;
    bee.mesh.position.z += (targetZ - bee.mesh.position.z) * 0.1;
    if (targetZ > 0) {
        floor.mesh.rotation.x += 0.002 + targetZ / 100000;
        for (let i = 0; i < p.length; i++) {
            p[i].mesh.rotation.x += 0.001 + targetZ / 300000;
        }
    } else {
        floor.mesh.rotation.x += 0.005 + -targetZ / 10000;
        for (let i = 0; i < p.length; i++) {
            p[i].mesh.rotation.x += 0.001 + -targetZ / 30000;
        }
    }

    if (targetZ > -40) {
        targetZ = -40;
    } else if (targetZ < -100) {
        targetZ = -100;
    }

    let normalisedSpeed = Math.sqrt(targetZ * targetZ);

    if (bee.wings.geometry.vertices[0].y < 0
        || bee.wings.geometry.vertices[0].y > 200) {
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

    mat = new THREE.MeshStandardMaterial({
        color: 0x6cff6c,
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
    renderer.render(scene, camera);
    updateBee();
    requestAnimationFrame(loop);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
