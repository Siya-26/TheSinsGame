import * as THREE from 'three';

// Create the rocky arch as the finish line
export const createFinishLineArch = () => {
    const archGroup = new THREE.Group(); // Group to hold all rocks

    // Arch dimensions
    const archHeight = 10;
    const archWidth = 12;
    const numRocks = 15; // Number of rocks in the arch

    const rockMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513, // Brownish rock color
        roughness: 0.9, // Rugged surface
        flatShading: true,
    });

    // Create rocks in a semi-circular arch shape
    for (let i = 0; i < numRocks; i++) {
        const angle = (i / (numRocks - 1)) * Math.PI; // Divide into semi-circle
        const radius = archWidth / 2;

        const rock = new THREE.Mesh(
            new THREE.SphereGeometry(Math.random() * 0.8 + 0.5, 16, 16), // Random rock size
            rockMaterial
        );

        // Position rocks in an arch shape
        rock.position.set(
            Math.cos(angle) * radius, 
            Math.sin(angle) * archHeight / 2 + archHeight / 2, 
            0
        );

        // Slightly rotate the rocks randomly for rugged appearance
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        rock.castShadow = true; // Enable shadow casting for rocks
        archGroup.add(rock); // Add each rock to the group
    }

    // Add two supporting pillars (left and right sides of the arch)
    const pillarGeometry = new THREE.CylinderGeometry(1, 1, archHeight, 16);
    const leftPillar = new THREE.Mesh(pillarGeometry, rockMaterial);
    const rightPillar = new THREE.Mesh(pillarGeometry, rockMaterial);

    leftPillar.position.set(-archWidth / 2, archHeight / 2, 0);
    rightPillar.position.set(archWidth / 2, archHeight / 2, 0);

    leftPillar.castShadow = true;
    rightPillar.castShadow = true;

    archGroup.add(leftPillar);
    archGroup.add(rightPillar);

    return archGroup;
};
