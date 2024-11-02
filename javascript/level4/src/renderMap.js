import * as THREE from 'three';


/////////////////// TRACK ////////////////////

const trackRadius = 400;
const trackWidth = 90;
const trackLength = 800;
const barrierWidth = 60
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

// const arcAngle1 = (1 / 3) * Math.PI; // 60 degrees

const arcAngle1 = (1 / 2) * Math.PI ;

const deltaY = Math.sin(arcAngle1) * innerTrackRadius
const arcAngle2 = Math.asin(deltaY / outerTrackRadius);

const arcCEnterX =                                  // Center postion of the arcs
    (
        // Math.cos(arcAngle1) * innerTrackRadius + Math.cos(arcAngle2) * outerTrackRadius
        trackLength
    ) / 2;

const arcAngle3 = Math.acos(arcCEnterX / innerTrackRadius);

const arcAngle4 = Math.acos(arcCEnterX / outerTrackRadius);


// ////// PLANE GEOMTERY , WINDOW GENERATION ///////////

function getLineMarkings(mapWidth, mapHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext('2d');        // Create context

    context.fillStyle = "#546E90"
    context.fillRect(0, 0, mapWidth, mapHeight);

    context.lineWidth = 2;              // This is called a stroke, 2 units wide
    context.strokeStyle = "#E0FFFFF";
    context.setLineDash([10, 14]);       // After 10 minutes stroke there will be a 14 minutes gap

    // left circle              
    context.beginPath();
    context.arc(
        mapWidth / 2 - arcCEnterX,        // X position
        mapHeight / 2,                   // Y position
        trackRadius,                    // Radius
        0,                              // Starting angle
        Math.PI * 2,                    // Ending angle
    );
    context.stroke()

    //Right circle
    context.beginPath();
    context.arc(
        mapWidth / 2 + arcCEnterX,        // X position
        mapHeight / 2,                   // Y position
        trackRadius,                    // Radius
        0,                              // Starting angle
        Math.PI * 2,                    // Ending angle
    );
    context.stroke()

    return new THREE.CanvasTexture(canvas);
}

export function renderMap(mapWidth, mapHeight) {

    // Plane with line markings
    const lineMarkingsTexture = getLineMarkings(mapWidth, mapHeight);

    // Creating Plane
    const planeGeomtery = new THREE.PlaneGeometry(mapWidth, mapHeight);        // Define a plane
    const planeMaterial = new THREE.MeshLambertMaterial({
        map: lineMarkingsTexture,
    });
    const plane = new THREE.Mesh(planeGeomtery, planeMaterial)
    scene.add(plane);

    // Extruded Geomtery
    const islandleft = getLeftIsland(mapWidth, mapHeight);
    const islandright = getRightIsland(mapWidth, mapHeight);
    const islandmiddle = getMiddleIsland(mapWidth, mapHeight);
    const outerfield = getOuterField(mapWidth, mapHeight);



    const fieldGeometry = new THREE.ExtrudeGeometry(
        [islandleft, islandright, islandmiddle, outerfield],
        { depth: 6, bevelEnabled: false }            // options object, 
        // depth : how much do these objects stand out from the ground
        // bevelEnabled : true ? false, default is true, makes edges rounded.
    );

    const fieldMesh = new THREE.Mesh(fieldGeometry, [
        new THREE.MeshLambertMaterial({ color: 0x67c240 }),
        new THREE.MeshLambertMaterial({ color: 0x23311c }),
    ])
    scene.add(fieldMesh);
}

function getLeftIsland(mapWidth, mapHeight) {
    const islandleft = new THREE.Shape()

    islandleft.absarc(
        -arcCEnterX,     // Absolute positioning
        0,
        innerTrackRadius,
        arcAngle1,
        -arcAngle1,
        false           // anticlockwise or not
    );

    islandleft.absarc(
        arcCEnterX,
        0,
        outerTrackRadius,
        Math.PI + arcAngle2,
        Math.PI - arcAngle2,
        true                            // Arc is clockwise
    )

    return islandleft

}


function getMiddleIsland(mapWidth, mapHeight) {
    const islandmiddle = new THREE.Shape()

    islandmiddle.absarc(
        -arcCEnterX,     // Absolute positioning
        0,
        innerTrackRadius,
        arcAngle3,
        -arcAngle3,
        true           // anticlockwise or not
    );

    islandmiddle.absarc(
        arcCEnterX,
        0,
        innerTrackRadius,
        Math.PI + arcAngle3,
        Math.PI - arcAngle3,
        true                            // Arc is clockwise
    )

    return islandmiddle;

}

function getRightIsland(mapWidth, mapHeight) {             // mirror left
    const islandright = new THREE.Shape()

    islandright.absarc(
        arcCEnterX,     // Absolute positioning
        0,
        innerTrackRadius,
        Math.PI - arcAngle1,
        Math.PI + arcAngle1,
        true           // anticlockwise or not
    );

    islandright.absarc(
        -arcCEnterX,
        0,
        outerTrackRadius,
        -arcAngle2,
        +arcAngle2,
        false                            // Arc is clockwise
    );

    return islandright;
}

function getOuterField(mapWidth, mapHeight) {             // mirror left
    const field = new THREE.Shape()

    field.moveTo(-mapWidth / 2, -mapHeight / 2);
    field.lineTo(0, -mapHeight / 2);   // From last point drawing ended to paraneters , lineis dawn               

    // Drawing commands always continue from the position where the last command left off, in both WebGL and ThreeKs

    field.absarc(
        -arcCEnterX,     // Absolute positioning
        0,
        outerTrackRadius,
        - arcAngle4,
        arcAngle4,
        true           // anticlockwise or not
    );

    field.absarc(
        arcCEnterX,
        0,
        outerTrackRadius,
        Math.PI-arcAngle4,
        Math.PI+arcAngle4,
        true                           // Arc is clockwise
    );

    field.lineTo(0,-mapHeight/2);
    field.lineTo(mapWidth/2, -mapHeight/2);
    field.lineTo(mapWidth/2, mapHeight/2);
    field.lineTo(-mapWidth/2,mapHeight/2);

    // It is implied that the shape closes itself, else it would be a path and not a shapew
    

    return field;
}


