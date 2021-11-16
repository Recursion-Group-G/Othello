import * as THREE from 'three';

class FlipAnimation {
    constructor(id, fromColor, toColor) {
        /**
         * DOM Elements
         */
        this.canvas = document.createElement('canvas');
        this.square = document.getElementById(id);

        this.square.append(this.canvas);

        this.canvas.height = this.square.clientHeight * 2;
        this.canvas.width = this.square.clientWidth * 2;
        this.canvas.style.position = 'fixed';
        this.canvas.style.outline = 'none';
        this.canvas.style.top = `${(this.square.clientHeight - this.canvas.height) / 2}px`;
        this.canvas.style.left = `${(this.square.clientWidth - this.canvas.width) / 2}px`;

        /**
         * Scene
         */
        this.scene = new THREE.Scene();

        /**
         * Sizes
         */
        this.sizes = {
            width: this.canvas.width,
            height: this.canvas.height,
        };

        /**
         * Camera
         */
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        this.camera.position.z = 3;
        this.scene.add(this.camera);

        /**
         * Stone
         */
        const height = 0.13;
        const othelloStoneGeometry = new THREE.CylinderGeometry(1, 1, height, 50);

        const frontMaterial = new THREE.MeshPhongMaterial({
            color: fromColor,
            // wireframe: true,
        });
        const backMaterial = new THREE.MeshPhongMaterial({
            color: toColor,
            // wireframe: true,
        });

        const frontCylinder = new THREE.Mesh(othelloStoneGeometry, frontMaterial);
        frontCylinder.position.y = height / 2;

        const backCylinder = new THREE.Mesh(othelloStoneGeometry, backMaterial);
        backCylinder.position.y = -height / 2;

        this.othelloStone = new THREE.Group();
        this.othelloStone.add(frontCylinder);
        this.othelloStone.add(backCylinder);
        this.othelloStone.castShadow = true;
        this.othelloStone.receiveShadow = true;
        this.othelloStone.rotation.x = Math.PI * 0.5;
        this.scene.add(this.othelloStone);

        /**
         * Light
         */
        const spotLight = new THREE.SpotLight(0xffffff);
        spotLight.castShadow = true;
        spotLight.position.set(-10, 10, 20);
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        this.scene.add(spotLight);

        /**
         * Renderer
         */
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.render(this.scene, this.camera);
    }
    async flip() {
        const rotationZ = this.othelloStone.rotation.z + Math.PI;
        let requestId = undefined;

        console.time('for');
        const animate = async () => {
            // Render
            this.renderer.render(this.scene, this.camera);

            if (this.othelloStone.rotation.z >= rotationZ) {
                cancelAnimationFrame(requestId);
                this.othelloStone.rotation.z = rotationZ;
                this.othelloStone.position.z = 0;
                console.timeEnd('for');
                return;
            }

            if (this.othelloStone.rotation.z < rotationZ - Math.PI / 2) {
                this.othelloStone.position.z += 0.03;
            } else {
                this.othelloStone.position.z -= 0.03;
            }
            console.log('2');
            this.othelloStone.rotation.z += 0.05;
            requestId = requestAnimationFrame(animate);
        };

        animate();

        const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
        await sleep(1200); //requestAnimationFrameの同期処理が叶わなかったので、setIntervelを使った。
    }
    remove() {
        this.canvas.remove();
    }
}

export default FlipAnimation;
