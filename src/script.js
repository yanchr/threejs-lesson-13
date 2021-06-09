import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
 
const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader();

fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {

    const textGeometry = new THREE.TextGeometry('Yanick Christen', {
        font,
        size: 0.4,
        height: 0.2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
    })

    textGeometry.center()
    const material = new THREE.MeshBasicMaterial({ wireframe: true })

    const textMaterial = new THREE.MeshStandardMaterial()
    textMaterial.metalness = 1
    textMaterial.roughness = 0
    textMaterial.envMap = environmentMapTexture

    gui.add(textMaterial, 'metalness').min(0).max(1).step(0.0001)
    gui.add(textMaterial, 'roughness').min(0).max(1).step(0.0001)
    gui.add(textMaterial, 'aoMapIntensity').min(0).max(10).step(0.0001)
    gui.add(textMaterial, 'displacementScale').min(0).max(1).step(0.0001)

    const text = new THREE.Mesh(textGeometry, textMaterial)

    



    scene.add(text)

    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
    const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32)


    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, material)
        const sphere = new THREE.Mesh(sphereGeometry, material)
        const box = new THREE.Mesh(boxGeometry, textMaterial)
        const glasssphere = new THREE.Mesh(sphereGeometry, textMaterial)
        material.color.set(`#${Math.floor(Math.random() * 10)}0${Math.floor(Math.random() * 10)}0${Math.floor(Math.random() * 10)}0`)

        changePositionOfMesh(donut)
        changePositionOfMesh(sphere)
        changePositionOfMesh(box)
        changePositionOfMesh(glasssphere)
        scene.add(donut, sphere, box, glasssphere)
    }
});

function changePositionOfMesh(mesh) {
    mesh.position.x = (Math.random() - 0.5) * 10
    mesh.position.y = (Math.random() - 0.5) * 10
    mesh.position.z = (Math.random() - 0.5) * 10

    mesh.rotation.x = Math.random() * Math.PI
    mesh.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    mesh.scale.set(scale, scale, scale)

    return mesh
}

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()