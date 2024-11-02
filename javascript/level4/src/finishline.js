import * as THREE from "three";

const trackWidth = 90;

export function FLine() {

    const Fline = new THREE.Group()

    const texture = new THREE.TextureLoader().load(
        './checkered.jpg'
    )

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(trackWidth*2,40,40),
        new THREE.MeshLambertMaterial({map: texture})
    )
    Fline.add(box)

    return Fline
}    