import * as THREE from "three";


const trackWidth = 90;

export function FLine() {

    const Fline = new THREE.Group()

    const texture = new THREE.TextureLoader().load(
        "../dist/checkered.png"
    )

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(trackWidth*2,40,40),
        new THREE.MeshLambertMaterial({color: 0xffffff})
    )
    Fline.add(box)

    return Fline
}    