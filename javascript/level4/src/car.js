import * as THREE from "three";
import { getCarFrontTexture, getCarSideTexture } from "./textures";


const vehicleColors = [0xa52523]

// , 0xbdb638, 0x78b14b

export function Car() {

    const car = new THREE.Group();

    const backWheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),           // set dimensions along x,y,z axius
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );

    backWheel.position.z = 6;
    backWheel.position.x = -18;
    car.add(backWheel);         // By deafault at 0,0,0

    const frontWheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),           // set dimensions along x,y,z axius
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );

    frontWheel.position.z = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);         // By deafault at 0,0,0


    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),           // set dimensions along x,y,z axius
        new THREE.MeshLambertMaterial({ color: 0xa52523 })
    );
    // }
    // else {
    //     const main = new THREE.Mesh(
    //         new THREE.BoxGeometry(60, 30, 15),           // set dimensions along x,y,z axius
    //         new THREE.MeshLambertMaterial({ color: 0x0000ff })
    //     );
    // }


    main.position.z = 12;
    car.add(main);

    const carFrontTexture = getCarFrontTexture()
    // to fix texture, rotate by 90
    carFrontTexture.center = new THREE.Vector2(0.5, 0.5)       // Center is not defined, 0.5,0.5 imply halfway from the top and right along the object
    carFrontTexture.rotation = Math.PI / 2;         // Rotate ACW 90


    const carBackTexture = getCarFrontTexture()
    carFrontTexture.center = new THREE.Vector2(0.5, 0.5)
    carFrontTexture.rotation = -Math.PI / 2;         // Rotate CW 90

    const carRightSideTexture = getCarSideTexture()
    const carLeftSideTexture = getCarSideTexture()



    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshLambertMaterial({ map: carFrontTexture }),
        new THREE.MeshLambertMaterial({ map: carBackTexture }),
        new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
        new THREE.MeshLambertMaterial({ map: carRightSideTexture }),

        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
    ]);
    cabin.position.x = -6;
    cabin.position.z = 26;
    car.add(cabin)

    return car;

}

export function E_Car() {

    const car = new THREE.Group();

    const backWheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),           // set dimensions along x,y,z axius
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );

    backWheel.position.z = 6;
    backWheel.position.x = -18;
    car.add(backWheel);         // By deafault at 0,0,0

    const frontWheel = new THREE.Mesh(
        new THREE.BoxGeometry(12, 33, 12),           // set dimensions along x,y,z axius
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );

    frontWheel.position.z = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);         // By deafault at 0,0,0


    const main = new THREE.Mesh(
        new THREE.BoxGeometry(60, 30, 15),           // set dimensions along x,y,z axius
        new THREE.MeshLambertMaterial({ color: 0x0000ff })
    );


    main.position.z = 12;
    car.add(main);

    const carFrontTexture = getCarFrontTexture()
    // to fix texture, rotate by 90
    carFrontTexture.center = new THREE.Vector2(0.5, 0.5)       // Center is not defined, 0.5,0.5 imply halfway from the top and right along the object
    carFrontTexture.rotation = Math.PI / 2;         // Rotate ACW 90


    const carBackTexture = getCarFrontTexture()
    carFrontTexture.center = new THREE.Vector2(0.5, 0.5)
    carFrontTexture.rotation = -Math.PI / 2;         // Rotate CW 90

    const carRightSideTexture = getCarSideTexture()
    const carLeftSideTexture = getCarSideTexture()



    const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(33, 24, 12), [
        new THREE.MeshLambertMaterial({ map: carFrontTexture }),
        new THREE.MeshLambertMaterial({ map: carBackTexture }),
        new THREE.MeshLambertMaterial({ map: carLeftSideTexture }),
        new THREE.MeshLambertMaterial({ map: carRightSideTexture }),

        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
    ]);
    cabin.position.x = -6;
    cabin.position.z = 26;
    car.add(cabin)

    return car;

}

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}