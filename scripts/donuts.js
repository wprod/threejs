
let scene, camera, renderer, donut;
let donuts = [];
let ADD = 0.05;
let light = new THREE.AmbientLight( 0x404040 );

let randomInRange = function (from, to) {
    let x = Math.random() * (to - from);
    return x + from;
};

let createDonut = function() {
    let geometry = new THREE.TorusGeometry(1, .5, 5, 30);
    let material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});

    donut = new THREE.Mesh(geometry, material);
    donut.position.x = randomInRange(-15, 15);
    donut.position.y = 15;
    donut.position.z = randomInRange(-15, 15);
    scene.add(donut);
    donuts.push(donut);
};

// Set up the environment
// Initiallize scene, camera, objects and renderer
let init = function () {
    // create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xababab);

    // create an locate the camera
    camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1, 1000
    );
    camera.position.z = 25;

    let axes = new THREE.AxesHelper(5);
    scene.add(axes);
    scene.add( light );

    // create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
};


// main animation loop - calls 50-60 in a second.
let mainLoop = function () {
    createDonut();
    donuts.forEach(donut => {
        donut.position.y -= ADD;
        donut.rotation.x -= ADD;
        donut.rotation.y -= ADD;
        donut.rotation.z -= ADD;
    });

    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

init();
mainLoop();
