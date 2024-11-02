import * as THREE from 'three'

export function Tree() {
    const tree = new THREE.Group();

    const treeTrunkGeometry = new THREE.BoxGeometry(15, 15, 60);


    const treeCrownColor = 0x498c2c;
    const treeTrunkColor = 0x4b3f2f;

    const treeTrunkMaterial = new THREE.MeshLambertMaterial({
        color: treeTrunkColor
    });
    const trunk = new THREE.Mesh(treeTrunkGeometry, treeTrunkMaterial);

    const treeCrownMaterial = new THREE.MeshLambertMaterial({
        color: treeCrownColor
    });

    trunk.position.z = 10;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    trunk.matrixAutoUpdate = false;
    tree.add(trunk);

    const treeHeights = [45, 60, 75];
    const height = pickRandom(treeHeights);

    const crown = new THREE.Mesh(
        new THREE.SphereGeometry(height / 2, 30, 30),
        treeCrownMaterial

    );
    crown.position.z = height / 2 + 30;
    crown.castShadow = true;
    crown.receiveShadow = false;
    tree.add(crown);

    return tree;
}

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}