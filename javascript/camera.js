import * as THREE from 'three';

class Camera{
    constructor(field_of_view, aspect_ration, near_plane, far_plane){
        this.camera = new THREE.PerspectiveCamera(field_of_view, aspect_ration, near_plane, far_plane);
        this.isFirstPerson = false;
        this.isThirdPerson = true;
        this.smoothFactor = 0.3;
        this.fixedCameraY = 2;
        this.firstPersonOffset = new THREE.Vector3(1, 1, 0);
        this.thirdPersonOffset = new THREE.Vector3(-3, 2, 0);
    }


    smoothCameraFollow(car){
        if (this.isFirstPerson){
            const targetPosition = car.position.clone().add(this.firstPersonOffset);
            this.camera.position.lerp(targetPosition, smoothFactor);
        }
        else if (this.isThirdPerson){
            const carDirection = new THREE.Vector3();
            car.getWorldDirection(carDirection);
            const carRight = new THREE.Vector3().crossVectors(carDirection, new THREE.Vector3(0, 1, 0)).normalize();
            
            const targetPosition = car.position
                .clone()
                .add(carRight.clone().multiplyScalar(this.thirdPersonOffset.x))
                .setY(this.fixedCameraY);
    
            this.camera.position.lerp(targetPosition, this.smoothFactor);
        }
        this.camera.lookAt(car.position);
    };


    setPosition(x, y, z){
        this.camera.position.set(x, y, z);
    }
}

export { Camera };

