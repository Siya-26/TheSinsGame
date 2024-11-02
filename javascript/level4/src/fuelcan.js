import * as THREE from "three";


export function FuelCan()
{
    const FuelCan = new THREE.Group();

    const redpart = new THREE.Mesh(
        new THREE.BoxGeometry(18,10,4),
        new THREE.MeshLambertMaterial({color : 0xff0000})
    );
    redpart.position.z = 6
    FuelCan.add(redpart)

    const blackpart = new THREE.Mesh(
        new THREE.BoxGeometry(2,4,2),
        new THREE.MeshLambertMaterial({color : 0x888888})
    );
    blackpart.position.z = 6
    blackpart.position.x = -10
    FuelCan.add(blackpart)


    return FuelCan;
}