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
//scene.add(axesHelper)

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

    const guiTextMaterial = gui.addFolder('Metalic Forms')
    const guiMaterial = gui.addFolder('colored Forms')
    guiTextMaterial.add(textMaterial, 'metalness').min(0).max(1).step(0.0001)
    guiTextMaterial.add(textMaterial, 'roughness').min(0).max(1).step(0.0001)
    guiMaterial.add(material, 'wireframe')
    const text = new THREE.Mesh(textGeometry, textMaterial)
    scene.add(text)

    /**
     * Colors
     */
    var colors = {
        red: Math.floor(Math.random() * 255),
        green: Math.floor(Math.random() * 255),
        blue: Math.floor(Math.random() * 255)
    }

    const guiColorFolder = guiMaterial.addFolder('Colors')
    guiColorFolder.add(colors, 'red').min(0).max(255).step(1).onChange( function() { material.color.set(`rgb(${colors.red}, ${colors.green}, ${colors.blue})`) } );
    guiColorFolder.add(colors, 'green').min(0).max(255).step(1).onChange( function() { material.color.set(`rgb(${colors.red}, ${colors.green}, ${colors.blue})`) } );
    guiColorFolder.add(colors, 'blue').min(0).max(255).step(1).onChange( function() { material.color.set(`rgb(${colors.red}, ${colors.green}, ${colors.blue})`) } );

    material.color.set(`rgb(${colors.red}, ${colors.green}, ${colors.blue})`)
    const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)
    const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32)


    for (let i = 0; i < 100; i++) {
        const donut = new THREE.Mesh(donutGeometry, material)
        const sphere = new THREE.Mesh(sphereGeometry, material)
        const box = new THREE.Mesh(boxGeometry, textMaterial)
        const glasssphere = new THREE.Mesh(sphereGeometry, textMaterial)

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

const cameraAttributes = {
    moving: true,
    movingToX: 1,
    movingToY: 1,
    movingToZ: 5,
    movingSpeed: 0.01
}
const guiCamera = gui.addFolder('Camera')
guiCamera.add(cameraAttributes, ('moving'))
guiCamera.add(cameraAttributes, ('movingToX')).min(-10).max(10)
guiCamera.add(cameraAttributes, ('movingToY')).min(-10).max(10)
guiCamera.add(cameraAttributes, ('movingToZ')).min(-10).max(10)
guiCamera.add(cameraAttributes, ('movingSpeed')).min(0).max(0.05).step(0.001)

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
    if(cameraAttributes.moving){
        camera.position.x += (camera.position.x <= cameraAttributes.movingToX) ? cameraAttributes.movingSpeed : 0
        camera.position.y += (camera.position.y <= cameraAttributes.movingToY) ? cameraAttributes.movingSpeed : 0
        camera.position.z += (camera.position.z <= cameraAttributes.movingToZ) ? cameraAttributes.movingSpeed : 0
    
        camera.position.x += (camera.position.x > cameraAttributes.movingToX) ? -cameraAttributes.movingSpeed : 0
        camera.position.y += (camera.position.y > cameraAttributes.movingToY) ? -cameraAttributes.movingSpeed : 0
        camera.position.z += (camera.position.z > cameraAttributes.movingToZ) ? -cameraAttributes.movingSpeed : 0
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()