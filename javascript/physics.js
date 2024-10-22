import * as CANNON from 'cannon-es';


class Physics{
    constructor(){
        this.physicsWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0),
        });
        this.groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
        });
        this.positions = [];
    }


    setPositions(positions){
        this.positions = positions;
    }


    addGround(){
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
        this.physicsWorld.addBody(this.groundBody);
    }


    addBoundaries(){
        const mass = 1000;
        const body = new CANNON.Body({ mass });
        const s = 2;
        for(let i = 9171; i < 18133; i += 3){
            const sphereShape = new CANNON.Sphere(0.25);
            body.addShape(sphereShape, new CANNON.Vec3(this.positions[i]*s, this.positions[i+1]*s, this.positions[i+2]*s));
        }
        for(let i = 63117; i < 72115; i += 3){
            const sphereShape = new CANNON.Sphere(0.25);
            body.addShape(sphereShape, new CANNON.Vec3(this.positions[i]*s, this.positions[i+1]*s, this.positions[i+2]*s));
        }
    
        body.position.set(0, 0.5, 0)
        this.physicsWorld.addBody(body)
    }


    createWorld(){
        this.addGround();
        this.addBoundaries();
    }
}

class Vehicle{
    constructor(){
        this.carBody = new CANNON.Body({
            mass: 20,
            shape: new CANNON.Box(new CANNON.Vec3(1, 0.05, 0.5)),
            position: new CANNON.Vec3(40, 0.1, 27.25),
        });
        this.vehicle = new CANNON.RigidVehicle({
            chassisBody: this.carBody,
        });
        this.axisWidth = 0.5;
        this.wheelBody1;
        this.wheelBody2;
        this.wheelBody3;
        this.wheelBody4;
    }

    addWheel(position){
        const wheelBody = new CANNON.Body({
            mass: 2,
            material: new CANNON.Material('wheel'),
        });
        wheelBody.addShape(new CANNON.Sphere(0.1));
        wheelBody.angularDamping = 0.4;
        this.vehicle.addWheel({
            body: wheelBody,
            position: new CANNON.Vec3(position.x, 0, position.z * this.axisWidth),
            axis: new CANNON.Vec3(0, 0, 1),
            direction: new CANNON.Vec3(0, -1, 0),
        });
        return wheelBody;
    };

    addWheels(){
        this.wheelBody1 = this.addWheel({ x: -1, z: 1 });
        this.wheelBody2 = this.addWheel({ x: -1, z: -1 });
        this.wheelBody3 = this.addWheel({ x: 1, z: -1 });
        this.wheelBody4 = this.addWheel({ x: 1, z: 1 });
    }

    getWheels() {
        return {
            wheelBody1: this.wheelBody1,
            wheelBody2: this.wheelBody2,
            wheelBody3: this.wheelBody3,
            wheelBody4: this.wheelBody4,
        };
    }

    createVehicle(){
        this.addWheels();
    }

}

export { Physics, Vehicle };