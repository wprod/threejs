let scene, camera, renderer, bird;
let ADD = 0.1;

let createBird = function () {
    let geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(3, 2, -2));
    geometry.vertices.push(new THREE.Vector3(3, 2, 3));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));

    geometry.vertices.push(new THREE.Vector3(-3, 2, -2));
    geometry.vertices.push(new THREE.Vector3(-3, 2, 3));
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));

    geometry.faces.push(new THREE.Face3(0, 1, 2));
    geometry.faces.push(new THREE.Face3(3, 4, 5));

    let material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, side: THREE.DoubleSide,});

    bird = new THREE.Mesh(geometry, material);

    bird.rotation.y = 2;

    scene.add(bird);
};

// Initiallize scene, camera, objects and renderer
let init = function () {

    // create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('#5ebaff');

    // Create an locate the camera
    camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1, 1000
    );
    camera.position.z = 20;

    createBird();

    let axes = new THREE.AxesHelper(5);
    scene.add(axes);

    // Create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
};


// main animation loop - calls 50-60 in a second.
let mainLoop = function () {

    bird.geometry.vertices[0].y -= ADD;
    bird.geometry.vertices[1].y -= ADD;

    bird.geometry.vertices[3].y -= ADD;
    bird.geometry.vertices[4].y -= ADD;

    bird.geometry.verticesNeedUpdate = true;

    if (bird.geometry.vertices[0].y < -2
        || bird.geometry.vertices[0].y > 2) {
        ADD *= -1;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

init();
mainLoop();
