import * as THREE from 'three';

class Renderer{
    constructor(){
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
    }


    setUpRenderer(){
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }
}

export { Renderer };