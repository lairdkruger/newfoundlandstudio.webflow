class Macintosh extends ThreeShell {
    constructor() {
        super()
        this.init()
    }

    init() {
        this.macLoaded = false
        this.entering = false

        this.readyScene()
        this.addLighting()
        this.addMacintosh()
        this.addBackground()

        this.initEvents()
        this.initPost()
        this.renderer.setAnimationLoop(this.render.bind(this))
    }

    initEvents() {
        var _this = this

        this.enterButton = document.getElementById('enter-button')
        this.enterButton.addEventListener(
            'click',
            function(event) {
                _this.onEnter()
            },
            false
        )
    }

    onEnter() {
        this.entering = true

        this.screen.material.map = null
        this.screenMaterial = new THREE.MeshBasicMaterial({
            color: 'white',
        })
        this.screen.material = this.screenMaterial
    }

    readyScene() {
        this.mouse3D.x = 0.59
        this.mouse3D.y = 0.15
        this.mouse3D.z = 1.1
    }

    addLighting() {
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
        directionalLight.position.set(0, 1, 0.3)
        var ambientLight = new THREE.AmbientLight(0xffffff) // soft white light
        this.scene.add(directionalLight)
        this.scene.add(ambientLight)
    }

    addMacintosh() {
        var _this = this

        // Instantiate a loader
        var loader = new THREE.GLTFLoader()

        // Load a glTF resource
        loader.load(
            // resource URL
            'https://dl.dropboxusercontent.com/s/z1v7ucwuz35ehxg/mac.glb?dl=0',
            // called when the resource is loaded
            function(gltf) {
                var loader = document.getElementById('loader-box')
                loader.style.display = 'none'

                _this.gltf = gltf
                var gltfScene = gltf.scene

                // scale and center object in scene
                var bbox = new THREE.Box3().setFromObject(gltfScene)
                var cent = bbox.getCenter(new THREE.Vector3())
                var size = bbox.getSize(new THREE.Vector3())

                // rescale the object to normalized space
                var maxAxis = Math.max(size.x, size.y, size.z)
                gltfScene.scale.multiplyScalar(1.0 / maxAxis)
                bbox.setFromObject(gltfScene)
                bbox.getCenter(cent)
                bbox.getSize(size)
                // reposition to 0,halfY,0
                gltfScene.position.copy(cent).multiplyScalar(-1)
                gltfScene.position.y -= size.y * 0.0

                _this.scene.add(gltfScene)
                _this.macLoaded = true

                _this.macintosh = gltfScene.getObjectByName('Macintosh')
                _this.screen = gltfScene.getObjectByName('Screen')

                _this.initScreenMaterial()
            },
            // called while loading is progressing
            function(xhr) {
                var loader = document.getElementById('loader-text')
                loader.innerHTML = Math.round((xhr.loaded / xhr.total) * 100)
            },
            // called when loading has errors
            function(error) {
                console.log(error)
            }
        )
    }

    addBackground() {
        var loader = new THREE.TextureLoader()

        var geometry = new THREE.PlaneGeometry(4, 4, 1)
        var material = new THREE.MeshBasicMaterial({
            map: loader.load(
                'https://dl.dropboxusercontent.com/s/neloa8mwa71k56r/starburst.png?dl=0'
            ),
            side: THREE.DoubleSide,
            transparent: true,
        })
        this.background = new THREE.Mesh(geometry, material)
        this.background.position.set(0, 0, -2)
        this.background.visible = false
        this.scene.add(this.background)
    }

    initScreenMaterial() {
        const loader = new THREE.TextureLoader()

        var defaultVideo = document.getElementById('default-video')
        defaultVideo.play()

        this.defaultTexture = new THREE.VideoTexture(defaultVideo)
        this.defaultTexture.minFilter = THREE.LinearFilter
        this.defaultTexture.magFilter = THREE.LinearFilter
        this.defaultTexture.format = THREE.RGBFormat
        this.defaultTexture.flipY = false

        var hoverVideo = document.getElementById('hover-video')
        hoverVideo.play()

        this.hoverTexture = new THREE.VideoTexture(hoverVideo)
        this.hoverTexture.flipY = false

        this.screenMaterial = new THREE.MeshBasicMaterial({
            map: this.defaultTexture,
        })

        this.screen.material = this.screenMaterial
    }

    initPost() {
        this.composer = new THREE.EffectComposer(this.renderer)

        var renderPass = new THREE.RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass)

        var ditherPass = new THREE.ShaderPass(THREE.DitherShader)
        ditherPass.renderToScreen = true
        this.composer.addPass(ditherPass)
    }

    handleMacintosh() {
        var _this = this

        if (this.macLoaded && !this.entering) {
            this.gltf.scene.traverse(function(object) {
                if (object.isMesh) {
                    object.lookAt(_this.mouse3D)
                }
            })
        }
    }

    updateScreenMaterial() {
        if (this.hovered && !this.entering) {
            this.screen.material.map = this.hoverTexture
        } else {
            this.screen.material.map = this.defaultTexture
        }
    }

    updateBackground() {
        if (this.hovered && !this.entering) {
            this.scene.background = new THREE.Color(0xf30000)
            this.background.visible = true
            this.background.rotation.z += 0.5
        } else {
            this.scene.background = new THREE.Color(0xffffff)
            this.background.visible = false
        }
    }

    handleHover() {
        if (this.macLoaded && !this.entering) {
            // update the picking ray with the camera and mouse position
            this.raycaster.setFromCamera(this.mouse3D, this.camera)
            // calculate objects intersecting the picking ray var intersects =
            var intersects = this.raycaster.intersectObject(this.macintosh)

            if (intersects.length > 0) {
                this.hovered = true
            } else {
                this.hovered = false
            }

            this.updateScreenMaterial()
            this.updateBackground()
        }
    }

    enter() {
        if (this.camera.position.z > 0.5) {
            this.camera.position.z -= 55 * 0.001
            this.camera.position.y += 3 * 0.001
        } else {
            this.renderer = null
            window.location.href = 'frontpage.html'
        }
    }

    render() {
        this.handleMacintosh()
        this.handleHover()

        if (this.entering) {
            this.enter()
        }

        this.composer.render()
        //this.renderer.render(this.scene, this.camera)
    }
}
