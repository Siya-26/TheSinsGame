// cars.js
export const availableCars = [
    {
        name: 'Mazda RX7',
        modelPath: '../Models/mazda_rx7_stylised.glb',
        scale: [0.0030, 0.0030, 0.0030],
        initialPosition: [40, 0.1, 27.25],
        rotation: [-Math.PI / 2, 0, 0],
        physicsProperties: {
            mass: 20,
            shape: new CANNON.Box(new CANNON.Vec3(1, 0.05, 0.5)),
        },
    },
    {
        name: 'BMW M3',
        modelPath: '../Models/exo90.glb',
        scale: [0.0040, 0.0040, 0.0040],
        initialPosition: [40, 0.1, 27.25],
        rotation: [-Math.PI / 2, 0, 0],
        physicsProperties: {
            mass: 22,
            shape: new CANNON.Box(new CANNON.Vec3(1.1, 0.05, 0.55)),
        },
    },
    {
        name: 'Ford Mustang',
        modelPath: '../Models/low_poly_ps1-syle_testarossa.glb',
        scale: [0.0050, 0.0050, 0.0050],
        initialPosition: [40, 0.1, 27.25],
        rotation: [-Math.PI / 2, 0, 0],
        physicsProperties: {
            mass: 25,
            shape: new CANNON.Box(new CANNON.Vec3(1.2, 0.05, 0.6)),
        },
    },
];

