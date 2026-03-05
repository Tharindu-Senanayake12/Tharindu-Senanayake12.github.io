const container = document.getElementById('canvas-container');

// Setup Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// Create a cleaner geometric shape
const geometry = new THREE.IcosahedronGeometry(12, 1); 
const material = new THREE.MeshBasicMaterial({ 
    color: 0x38bdf8, 
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

camera.position.z = 30;

// Handle Window Resize dynamically
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

// Mouse interaction (optional touch of professionalism)
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);
    
    // Smooth, slow rotation
    shape.rotation.x += 0.002;
    shape.rotation.y += 0.003;

    // Slight movement based on mouse
    shape.position.x += (mouseX * 2 - shape.position.x) * 0.05;
    shape.position.y += (mouseY * 2 - shape.position.y) * 0.05;

    renderer.render(scene, camera);
}
animate();