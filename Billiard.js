/* global THREE */

"use strict";
// * Initialize webGL
const canvas = document.getElementById("myCanvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setClearColor('#ffffff');    // set background color
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
// Create a new Three.js scene with camera and light
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height,
  0.1, 1000);


window.addEventListener("resize", function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

camera.position.set(0, -5, 12);
camera.lookAt(scene.position);

const ambientLight = new THREE.AmbientLight(0x909090);
scene.add(ambientLight);

const spotLightPos = {
  x: 0,
  y: 0,
  z: 8,
};


const spotLight = new THREE.SpotLight();
spotLight.castShadow = true;
spotLight.position.set(spotLightPos.x, spotLightPos.y, spotLightPos.z);
spotLight.penumbra = 1;
spotLight.shadow.mapSize.width = 10000;
spotLight.shadow.mapSize.height = 10000;
spotLight.intensity = .8;
scene.add(spotLight);

// Add a mouse controller to move the camera

const controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.zoomSpeed = 2.0;


// * Add your billiard simulation here

const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshPhongMaterial({ color: 0x959595, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.receiveShadow = true;
scene.add(plane);

const tableProperties = {
  height: 0.51,
  LegsX: .8,
  LegsY: 1.6,
  thickness: .2,
  groundWidth: 1.4,
  groundLength: 3.0,
  ballRadius: .05,
  ceilingHeight: 10,
  lampRadius: .5,
};

function createBilliTable() {

  //Creat legs
  const boxGeo = new THREE.BoxGeometry(tableProperties.thickness, tableProperties.thickness, tableProperties.thickness * 5);
  const boxMat = new THREE.MeshPhongMaterial({ color: 0x4920000, side: THREE.DoubleSide });

  //-x,-y
  const legLeft = new THREE.Mesh(boxGeo, boxMat);
  legLeft.position.set(-tableProperties.LegsX, - tableProperties.LegsY, tableProperties.height);
  scene.add(legLeft);

  //x,-y
  const legRight = new THREE.Mesh(boxGeo, boxMat);
  legRight.position.set(tableProperties.LegsX, -tableProperties.LegsY, tableProperties.height);
  scene.add(legRight);

  //-x,y
  const LegTopLeft = new THREE.Mesh(boxGeo, boxMat);
  LegTopLeft.position.set(-tableProperties.LegsX, tableProperties.LegsY, tableProperties.height);
  scene.add(LegTopLeft);

  //x,y
  const LegTopRight = new THREE.Mesh(boxGeo, boxMat);
  LegTopRight.position.set(tableProperties.LegsX, tableProperties.LegsY, tableProperties.height);
  scene.add(LegTopRight);

  const cushMat = new THREE.MeshPhongMaterial({
    color: 0x346100,
    side: THREE.DoubleSide
  });

  //creat cushion
  const cushGeo = new THREE.BoxGeometry(tableProperties.thickness, tableProperties.LegsY + 1.8, tableProperties.thickness);
  const cushionLeft = new THREE.Mesh(cushGeo, cushMat);
  cushionLeft.position.x = -(tableProperties.LegsX / 2 + tableProperties.thickness * 4 / 2);
  cushionLeft.position.z = (tableProperties.thickness * 5 + 0.1);
  cushionLeft.receiveShadow = true;
  scene.add(cushionLeft);


  const cushionRight = new THREE.Mesh(cushGeo, cushMat);
  cushionRight.position.x = (tableProperties.LegsX / 2 + tableProperties.thickness * 4 / 2);
  cushionRight.position.z = (tableProperties.thickness * 5 + 0.1);
  cushionRight.receiveShadow = true;
  scene.add(cushionRight);

  const cushGeosides = new THREE.BoxGeometry(tableProperties.LegsX + 1, tableProperties.thickness, tableProperties.thickness);
  const cushionFront = new THREE.Mesh(cushGeosides, cushMat);
  cushionFront.position.y = -(tableProperties.LegsY / 2 + tableProperties.thickness * 8 / 2);
  cushionFront.position.z = (tableProperties.thickness * 5 + 0.1);
  cushionFront.receiveShadow = true;
  scene.add(cushionFront);

  const cushionBack = new THREE.Mesh(cushGeosides, cushMat);
  cushionBack.position.y = (tableProperties.LegsY / 2 + tableProperties.thickness * 8 / 2);
  cushionBack.position.z = (tableProperties.thickness * 5 + 0.1);
  cushionBack.receiveShadow = true;
  scene.add(cushionBack);

  //creat a ground 
  const groundGeo = new THREE.PlaneGeometry(tableProperties.groundWidth, tableProperties.groundLength);
  const groundMat = new THREE.MeshPhongMaterial({ color: "green", side: THREE.DoubleSide });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.position.set(0, 0, 1);
  ground.castShadow = true;
  ground.receiveShadow = true;
  scene.add(ground);

} createBilliTable();


function createCeiling() {
  //create the ceiling
  const geometry = new THREE.PlaneGeometry(tableProperties.groundWidth * 2, tableProperties.groundLength * 2);
  const material = new THREE.MeshStandardMaterial({ color: "gray", side: THREE.DoubleSide });
  const ceiling = new THREE.Mesh(geometry, material);
  scene.add(ceiling);
  ceiling.position.set(0, 0, 10);

  //create the holder
  const holderGeo = new THREE.BoxGeometry(tableProperties.thickness * 4, tableProperties.thickness * 2, tableProperties.thickness * 4);
  const holderdMat = new THREE.MeshStandardMaterial({ color: "white", side: THREE.DoubleSide });
  const holder = new THREE.Mesh(holderGeo, holderdMat);
  holder.position.set(0, 0, 9.78)
  holder.rotation.x = Math.PI / 2;
  scene.add(holder);

  //create the cord
  const cordGeo = new THREE.BoxGeometry(tableProperties.thickness, tableProperties.ceilingHeight - 14.99, tableProperties.thickness);
  const cordMat = new THREE.MeshStandardMaterial({ color: "black", side: THREE.DoubleSide });
  const cord = new THREE.Mesh(cordGeo, cordMat);
  cord.position.set(0, 0, 7.5);
  cord.rotation.x = Math.PI / 2;
  scene.add(cord);

  //create the lamp
  const lampGeo = new THREE.SphereGeometry(tableProperties.lampRadius, 32, 32);
  const lampMat = new THREE.MeshBasicMaterial({ color: 0xfffd91, wireframe: false });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  lamp.position.set(0, 0, 5);
  scene.add(lamp);


} createCeiling();


//add 8 billiard balls
//CreatBall

const ballProperties = {

  ball: [],
  ballSpeedX: [],
  ballSpeedY: [],
  ballSpeedZ: [],
  ballRadius: 0.05,
  BallsNumber: 8,

};


//Add ball
const Ballgeometry = new THREE.SphereGeometry(ballProperties.ballRadius, 32, 32);

let ballPosX = [];
let ballPosY = [];
let ballPosXSet = new Set();
let ballPosYSet = new Set();


const planeNormal = new THREE.Vector3(0, 0, 1);
let ballPos = new THREE.Vector3(ballPosX, ballPosY, tableProperties.thickness * 5.25);
let ballSpeed = new THREE.Vector3(ballProperties.ballSpeedX[8], ballProperties.ballSpeedY[8], ballProperties.ballSpeedZ[8]);


function createBalls() {

  for (let i = 0; i < ballProperties.BallsNumber; i++) {

    let texture = new THREE.TextureLoader().load('PoolBallSkins/Ball' + (i + 8) + '.jpg');

    const materialball = new THREE.MeshPhongMaterial({ map: texture });
    ballProperties.ball[i] = new THREE.Mesh(Ballgeometry, materialball);
    ballProperties.ball[i].matrixAutoUpdate = false;
    ballProperties.ball[i].castShadow = true;

    ballSpeed[i] = new THREE.Vector3(Math.random() * .4, Math.random() * .4, 0);

    ballPosXSet.add(getRandomIndex(-(tableProperties.LegsX - tableProperties.thickness * 2 / (2 - tableProperties.ballRadius)), tableProperties.LegsX - tableProperties.thickness * 2 / 2 - tableProperties.ballRadius, 3));
    ballPosYSet.add(getRandomIndex(-(tableProperties.LegsY - tableProperties.thickness * 2 / (2 - tableProperties.ballRadius)), tableProperties.LegsY - tableProperties.thickness * 2 / 2 - tableProperties.ballRadius, 3));

    ballPosX = Array.from(ballPosXSet);
    ballPosY = Array.from(ballPosYSet);


    while (ballPosX[i] > tableProperties.LegsX - tableProperties.thickness || ballPosX[i] < -(tableProperties.LegsX - tableProperties.thickness)) {
      for (let it = ballPosXSet.values(), val = null; val = it.next().value;) {
        if (val.equals(ballPosX[i])) {
          ballPosXSet.remove(val);
          ballPosXSet.add(getRandomIndex(-(tableProperties.LegsX - tableProperties.thickness * 2 / 2 - tableProperties.ballRadius), tableProperties.LegsX - tableProperties.thickness * 2 / 2 - tableProperties.ballRadius, 3));
        }
      }
      ballPosX[i] = Array.from(ballPosXSet);
      check++;
    }

    while (ballPosY[i] > tableProperties.LegsY - tableProperties.thickness || ballPosY[i] < -(tableProperties.LegsY - tableProperties.thickness)) {
      for (let it = ballPosYSet.values(), val = null; val = it.next().value;) {
        if (val.equals(ballPosY[i])) {
          ballPosYSet.remove(val);
          ballPosYSet.add(getRandomIndex(-(tableProperties.LegsY - tableProperties.thickness / 2 - tableProperties.ballRadius), tableProperties.LegsY - tableProperties.thickness / 2 - tableProperties.ballRadius, 3));
        }
      }
      ballPosY[i] = Array.from(ballPosYSet);
      check++;
    }

    ballPos[i] = new THREE.Vector3(ballPosX[i], ballPosY[i], tableProperties.thickness * 5.25);



    scene.add(ballProperties.ball[i]);
  }
}

createBalls();

//random function with min and max value
function getRandomIndex(min, max, decimals) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

const computerClock = new THREE.Clock();

function render() {
  requestAnimationFrame(render);

  // Motion of the ball in this time step
  const dt = computerClock.getDelta();


  // Reflection off the cushions 
  for (let i = 0; i < ballProperties.BallsNumber; i++) {


    if (ballPos[i].x > tableProperties.groundWidth / 2 - ballProperties.ballRadius) {
      ballSpeed[i].x = -Math.abs(ballSpeed[i].x) * .8;

    }
    if (ballPos[i].x < -(tableProperties.groundWidth / 2 - ballProperties.ballRadius)) {
      ballSpeed[i].x = -ballSpeed[i].x * .8;

    }

    if (ballPos[i].y > tableProperties.groundLength / 2 - ballProperties.ballRadius) {
      ballSpeed[i].y = -Math.abs(ballSpeed[i].y) * .8;

    }
    if (ballPos[i].y < -(tableProperties.groundLength / 2 - ballProperties.ballRadius)) {
      ballSpeed[i].y = -ballSpeed[i].y * .8;

    }




    // // decreas speed by 20%
    ballSpeed[i].x = ballSpeed[i].x - ballSpeed[i].x * (0.2 / 60);
    ballSpeed[i].y = ballSpeed[i].y - ballSpeed[i].y * (0.2 / 60);


    //make ball rolling // update position of ball:
    ballPos[i].add(ballSpeed[i].clone().multiplyScalar(dt));

    const ax = planeNormal.clone().cross(ballSpeed[i]).normalize();
    const omega = ballSpeed[i].length() / tableProperties.ballRadius;
    const dR = new THREE.Matrix4().makeRotationAxis(ax, omega * dt);

    ballProperties.ball[i].matrix.premultiply(dR);
    ballProperties.ball[i].matrix.setPosition(ballPos[i]);

  }
  controls.update();
  renderer.render(scene, camera);
}
render();

