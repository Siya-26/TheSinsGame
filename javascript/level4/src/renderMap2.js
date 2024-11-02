import * as THREE from 'three';
import { Line } from 'three';
import { Tree } from './tree';


/////////////////// TRACK ////////////////////

const trackRadius = 400;
const trackWidth = 90;
const trackLength = 800;
const barrierWidth = 60
const innerTrackRadius = trackRadius - trackWidth;
const outerTrackRadius = trackRadius + trackWidth;

// const arcAngle1 = (1 / 3) * Math.PI; // 60 degrees

const arcAngle1 = (1 / 2) * Math.PI;

const deltaY = Math.sin(arcAngle1) * innerTrackRadius
// const arcAngle2 = Math.asin(deltaY / outerTrackRadius);

const arcCEnterX =                                  // Center postion of the arcs
    (
        // Math.cos(arcAngle1) * innerTrackRadius + Math.cos(arcAngle2) * outerTrackRadius
        trackLength
    ) / 2;

// const arcAngle3 = Math.acos(arcCEnterX / innerTrackRadius);

// const arcAngle4 = Math.acos(arcCEnterX / outerTrackRadius);


// ////// PLANE GEOMTERY , WINDOW GENERATION ///////////

function getLineMarkings(mapWidth, mapHeight) {
    const canvas = document.createElement("canvas");
    canvas.width = mapWidth;
    canvas.height = mapHeight;
    const context = canvas.getContext('2d');        // Create context

    context.fillStyle = "#67c240"
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
        Math.PI / 2,                              // Starting angle
        -Math.PI / 2,                    // Ending angle
    );
    context.lineTo(mapWidth/2 + arcCEnterX, mapHeight/2 - trackRadius)
    context.moveTo(mapWidth/2 + arcCEnterX, mapHeight/2 + trackRadius)
    context.lineTo(mapWidth/2 - arcCEnterX, mapHeight/2 + trackRadius)
    context.stroke()
    // context.closePath()

    //Right circle
    context.beginPath();
    context.arc(
        mapWidth / 2 + arcCEnterX,        // X position
        mapHeight / 2,                   // Y position
        trackRadius,                    // Radius
        Math.PI / 2,                              // Starting angle
        -Math.PI / 2,                   // Ending angle
        true,
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
        color : "#67c240",
        map: lineMarkingsTexture,
    });
    const plane = new THREE.Mesh(planeGeomtery, planeMaterial)
    plane.material.color.setHex(0x02ff00)
    scene.add(plane);



    // Extruded Geomtery
    const islandleft = getLeftIsland(mapWidth, mapHeight);
    const islandright = getRightIsland(mapWidth, mapHeight);
    const islandmiddle1 = getMiddleIsland1(mapWidth, mapHeight);
    const islandmiddle2 = getMiddleIsland2(mapWidth, mapHeight); 
    // const outerfield = getOuterField(mapWidth, mapHeight);



    const fieldGeometry = new THREE.ExtrudeGeometry(
        [islandmiddle1,islandmiddle2,islandleft,islandright],
        { depth: 6, bevelEnabled: false }            // options object, 
        // depth : how much do these objects stand out from the ground
        // bevelEnabled : true ? false, default is true, makes edges rounded.
    );

    const fieldMesh = new THREE.Mesh(fieldGeometry, [
        new THREE.MeshLambertMaterial({ color: 0x546E90 }),         
        // new THREE.MeshLambertMaterial({ color: 0x23311c }),
    ])
    
    scene.add(fieldMesh);
    
    ////////////////// BArrier Coding 
    const barrierleft = getbleft(mapWidth, mapHeight)
    const barrierright = getbright(mapWidth, mapHeight)
    const barriermiddle1 = getbmiddle1(mapWidth, mapHeight)
    const barriermiddle2 = getbmiddle2(mapWidth, mapHeight)

    const barrierGeometry = new THREE.ExtrudeGeometry(
        [barrierleft,barriermiddle1,barriermiddle2,barrierright],
        {depth : 10, bevelEnabled : false , fillRect:true}
    )

    const barrierMesh = new THREE.Mesh(barrierGeometry, [
        new THREE.MeshLambertMaterial({ color : 0x310a00})
    ])

    scene.add(barrierMesh)

    const tree1 = Tree();
    tree1.position.x = arcCEnterX;
    scene.add(tree1);

    const tree2 = Tree();
    tree2.position.y = arcCEnterX * 0.2;
    tree2.position.x = arcCEnterX * 0.3;
    scene.add(tree2);

    const tree3 = Tree();
    tree3.position.x = arcCEnterX * 0.5;
    tree3.position.y = arcCEnterX * 0.1;
    scene.add(tree3);

    const tree4 = Tree();
    tree4.position.x = arcCEnterX * 0.7;
    tree4.position.y = arcCEnterX * 0.1;
    scene.add(tree4);



    const tree5 = Tree();
    tree5.position.x = -arcCEnterX * 1;
    // tree5.position.y = arcCEnterX * 2;
    scene.add(tree5);

    // const tree6 = Tree();
    // tree6.position.x = -arcCEnterX * 2;
    // tree6.position.y = arcCEnterX * 1.8;
    // scene.add(tree6);

    // const tree7 = Tree();
    // tree7.position.x = arcCEnterX * 0.8;
    // tree7.position.y = -arcCEnterX * 2;
    // scene.add(tree7);

    // const tree8 = Tree();
    // tree8.position.x = arcCEnterX * 1.8;
    // tree8.position.y = -arcCEnterX * 2;
    // scene.add(tree8);

    // const tree9 = Tree();
    // tree9.position.x = -arcCEnterX * 1;
    // tree9.position.y = -arcCEnterX * 2;
    // scene.add(tree9);

    // const tree10 = Tree();
    // tree10.position.x = -arcCEnterX * 2;
    // tree10.position.y = -arcCEnterX * 1.8;
    // scene.add(tree10);

    // const tree11 = Tree();
    // tree11.position.x = arcCEnterX * 0.6;
    // tree11.position.y = -arcCEnterX * 2.3;
    // scene.add(tree11);

    // const tree12 = Tree();
    // tree12.position.x = arcCEnterX * 1.5;
    // tree12.position.y = -arcCEnterX * 2.4;
    // scene.add(tree12);

    // const tree13 = Tree();
    // tree13.position.x = -arcCEnterX * 0.7;
    // tree13.position.y = -arcCEnterX * 2.4;
    // scene.add(tree13);

    // const tree14 = Tree();
    // tree14.position.x = -arcCEnterX * 1.5;
    // tree14.position.y = -arcCEnterX * 1.8;
    // scene.add(tree14);

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
        -arcCEnterX,
        0,
        outerTrackRadius,
        -arcAngle1,
        arcAngle1,
        true                            // Arc is clockwise
    )

    return islandleft

}


function getMiddleIsland1(mapWidth, mapHeight) {
    const islandmiddle = new THREE.Shape()

    islandmiddle.moveTo(-arcCEnterX,outerTrackRadius)
    islandmiddle.lineTo(arcCEnterX,outerTrackRadius)
    islandmiddle.moveTo(+arcCEnterX,innerTrackRadius)
    islandmiddle.lineTo(-arcCEnterX,innerTrackRadius)

    return islandmiddle;

}

function getMiddleIsland2(mapWidth, mapHeight) {
    const islandmiddle = new THREE.Shape()

    islandmiddle.moveTo(-arcCEnterX,-outerTrackRadius)
    islandmiddle.lineTo(arcCEnterX,-outerTrackRadius)
    islandmiddle.moveTo(+arcCEnterX,-innerTrackRadius)
    islandmiddle.lineTo(-arcCEnterX,-innerTrackRadius)

    return islandmiddle;

}

function getRightIsland(mapWidth, mapHeight) {             // mirror left
    const islandright = new THREE.Shape()

    islandright.absarc(
        arcCEnterX,     // Absolute positioning
        0,
        innerTrackRadius,
        arcAngle1,
        -arcAngle1,
        true           // anticlockwise or not
    );

    islandright.absarc(
        arcCEnterX,
        0,
        outerTrackRadius,
        -arcAngle1,
        +arcAngle1,
        false                            // Arc is clockwise
    );

    return islandright;
}

function getbleft(mapWidth, mapHeight){
    const bleft = new THREE.Shape()

    bleft.absarc(
        -arcCEnterX,     // Absolute positioning
        0,
        outerTrackRadius,
        arcAngle1,
        -arcAngle1,
        false           // anticlockwise or not
    );

    bleft.absarc(
        -arcCEnterX,
        0,
        outerTrackRadius + barrierWidth,
        -arcAngle1,
        arcAngle1,
        true                            // Arc is clockwise
    )

    return bleft
}


function getbmiddle1(mapWidth, mapHeight) {
    const islandmiddle = new THREE.Shape()

    islandmiddle.moveTo(-arcCEnterX,outerTrackRadius + barrierWidth)
    islandmiddle.lineTo(arcCEnterX,outerTrackRadius + barrierWidth)
    islandmiddle.moveTo(+arcCEnterX,outerTrackRadius)
    islandmiddle.lineTo(-arcCEnterX,outerTrackRadius)

    return islandmiddle;

}

function getbmiddle2(mapWidth, mapHeight) {
    const islandmiddle = new THREE.Shape()

    islandmiddle.moveTo(-arcCEnterX,-outerTrackRadius - barrierWidth)
    islandmiddle.lineTo(arcCEnterX,-outerTrackRadius - barrierWidth)
    islandmiddle.moveTo(+arcCEnterX,-outerTrackRadius)
    islandmiddle.lineTo(-arcCEnterX,-outerTrackRadius)

    return islandmiddle;

}

function getbright(mapWidth, mapHeight) {             // mirror left
    const islandright = new THREE.Shape()

    islandright.absarc(
        arcCEnterX,     // Absolute positioning
        0,
        outerTrackRadius,
        arcAngle1,
        -arcAngle1,
        true           // anticlockwise or not
    );

    islandright.absarc(
        arcCEnterX,
        0,
        outerTrackRadius + barrierWidth,
        -arcAngle1,
        +arcAngle1,
        false                            // Arc is clockwise
    );

    return islandright;
}



