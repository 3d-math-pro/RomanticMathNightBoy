const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xcccccc);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// 遠近効果があるカメラ
const camera        = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z   = 30;

const controls      = new THREE.OrbitControls(camera);

const target        = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);

const shaderScene   = new THREE.Scene();
// 遠近効果がないカメラ
const shaderCamera  = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1, 1);
// JSからGLSLへ変数を渡す変数
const shaderUniforms = {
	resolution: {
		value: new THREE.Vector2(window.innerWidth, window.innerHeight)
	},
	// prevScene: {
	// 	value: new
	// }
	time: {
		value: 0
	}
};

const shaderGeometry  = new THREE.PlaneGeometry(window.innerWidth, window.innerHeight);
const shaderMaterial  = new THREE.ShaderMaterial({
	vertexShader: document.getElementById("vs").textContent,
	fragmentShader: document.getElementById("fs").textContent,
	uniforms: shaderUniforms
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);

shaderScene.add(shaderMesh);

const geometry = new THREE.CubeGeometry(50, 20, 20);
const material = new THREE.MeshBasicMaterial();

const mesh     = new THREE.Mesh(geometry, material);

scene.add(mesh);

const clock    = new THREE.Clock();

(function animate(){
	requestAnimationFrame(animate);
	renderer.render(shaderScene, shaderCamera, target);
	material.map = target.texture;
	shaderUniforms.time.value = clock.getElapsedTime();
	renderer.render(scene, camera);
}());
