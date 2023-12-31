import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import * as TWEEN from "three/addons/libs/tween.module.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OBB } from "three/addons/math/OBB.js";
import { merge } from "./merge.js";
import Ground from "./ground.js";
import Wall from "./wall.js";
import { set } from "lodash";

/*
 * parameters = {
 *  url: String,
 *  designCredits: String,
 *  texturesCredits: String,
 *  scale: Vector3,
 *  helpersColor: Color
 * }
 */

export default class Maze extends THREE.Group {
    doors = [];
    constructor(parameters) {
        super();
        merge(this, parameters);
        this.loaded = false;
        this.doorDebounce = false;

        this.onLoad = function (description) {
            const normalMapTypes = [THREE.TangentSpaceNormalMap, THREE.ObjectSpaceNormalMap];
            const wrappingModes = [THREE.ClampToEdgeWrapping, THREE.RepeatWrapping, THREE.MirroredRepeatWrapping];
            const magnificationFilters = [THREE.NearestFilter, THREE.LinearFilter];
            const minificationFilters = [THREE.NearestFilter, THREE.NearestMipmapNearestFilter, THREE.NearestMipmapLinearFilter, THREE.LinearFilter, THREE.LinearMipmapNearestFilter, THREE.LinearMipmapLinearFilter];

            // Store the maze's size, map and exit location
            this.size = description.maze.size;
            this.halfSize = { width: this.size.width / 2.0, depth: this.size.depth / 2.0 };
            this.map = description.maze.map;
            this.exitLocation = this.cellToCartesian(description.maze.exitLocation);
            this.passagesFloors = description.maze.exitFloor;
            this.elevator = description.maze.elevators;
            this.passage = description.maze.exitLocation

            // Create the helpers
            this.helper = new THREE.Group();

            // Create the ground
            const ground = new Ground({
                size: new THREE.Vector3(description.ground.size.width, description.ground.size.height, description.ground.size.depth),
                segments: new THREE.Vector3(description.ground.segments.width, description.ground.segments.height, description.ground.segments.depth),
                materialParameters: {
                    color: new THREE.Color(parseInt(description.ground.primaryColor, 16)),
                    mapUrl: description.ground.maps.color.url,
                    aoMapUrl: description.ground.maps.ao.url,
                    aoMapIntensity: description.ground.maps.ao.intensity,
                    displacementMapUrl: description.ground.maps.displacement.url,
                    displacementScale: description.ground.maps.displacement.scale,
                    displacementBias: description.ground.maps.displacement.bias,
                    normalMapUrl: description.ground.maps.normal.url,
                    normalMapType: normalMapTypes[description.ground.maps.normal.type],
                    normalScale: new THREE.Vector2(description.ground.maps.normal.scale.x, description.ground.maps.normal.scale.y),
                    bumpMapUrl: description.ground.maps.bump.url,
                    bumpScale: description.ground.maps.bump.scale,
                    roughnessMapUrl: description.ground.maps.roughness.url,
                    roughness: description.ground.maps.roughness.rough,
                    wrapS: wrappingModes[description.ground.wrapS],
                    wrapT: wrappingModes[description.ground.wrapT],
                    repeat: new THREE.Vector2(description.ground.repeat.u, description.ground.repeat.v),
                    magFilter: magnificationFilters[description.ground.magFilter],
                    minFilter: minificationFilters[description.ground.minFilter]
                },
                secondaryColor: new THREE.Color(parseInt(description.ground.secondaryColor, 16))
            });
            this.add(ground);

            // Create a wall
            const wall = new Wall({
                groundHeight: description.ground.size.height,
                segments: new THREE.Vector2(description.wall.segments.width, description.wall.segments.height),
                materialParameters: {
                    color: new THREE.Color(parseInt(description.wall.primaryColor, 16)),
                    mapUrl: description.wall.maps.color.url,
                    aoMapUrl: description.wall.maps.ao.url,
                    aoMapIntensity: description.wall.maps.ao.intensity,
                    displacementMapUrl: description.wall.maps.displacement.url,
                    displacementScale: description.wall.maps.displacement.scale,
                    displacementBias: description.wall.maps.displacement.bias,
                    normalMapUrl: description.wall.maps.normal.url,
                    normalMapType: normalMapTypes[description.wall.maps.normal.type],
                    normalScale: new THREE.Vector2(description.wall.maps.normal.scale.x, description.wall.maps.normal.scale.y),
                    bumpMapUrl: description.wall.maps.bump.url,
                    bumpScale: description.wall.maps.bump.scale,
                    roughnessMapUrl: description.wall.maps.roughness.url,
                    roughness: description.wall.maps.roughness.rough,
                    wrapS: wrappingModes[description.wall.wrapS],
                    wrapT: wrappingModes[description.wall.wrapT],
                    repeat: new THREE.Vector2(description.wall.repeat.u, description.wall.repeat.v),
                    magFilter: magnificationFilters[description.wall.magFilter],
                    minFilter: minificationFilters[description.wall.minFilter]
                },
                secondaryColor: new THREE.Color(parseInt(description.wall.secondaryColor, 16))
            });
            let passageFloor="";
            // Build the maze
            let geometry;
            let geometries = [];
            geometries[0] = [];
            geometries[1] = [];
            this.aabb = [];
            for (let i = 0; i <= this.size.depth; i++) { // In order to represent the southmost walls, the map depth is one row greater than the actual maze depth
                this.aabb[i] = [];
                for (let j = 0; j <= this.size.width; j++) { // In order to represent the eastmost walls, the map width is one column greater than the actual maze width
                    this.aabb[i][j] = [];
                    /*
                     *  this.map[][] | North wall | West wall
                     * --------------+------------+-----------
                     *       0       |     No     |     No
                     *       1       |     No     |    Yes
                     *       2       |    Yes     |     No
                     *       3       |    Yes     |    Yes
                     */
                    if (this.map[i][j] == 2 || this.map[i][j] == 3) {
                        this.aabb[i][j][0] = new THREE.Box3();
                        for (let k = 0; k < 2; k++) {
                            geometry = wall.geometries[k].clone();
                            geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(j - this.halfSize.width + 0.5, 0.25, i - this.halfSize.depth));
                            geometry.computeBoundingBox();
                            geometry.boundingBox.applyMatrix4(new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));
                            geometries[k].push(geometry);
                            this.aabb[i][j][0].union(geometry.boundingBox);
                        }
                        this.helper.add(new THREE.Box3Helper(this.aabb[i][j][0], this.helpersColor));
                    }
                    
                    if (this.map[i][j] == 1 || this.map[i][j] == 3) {
                        this.aabb[i][j][1] = new THREE.Box3();
                        for (let k = 0; k < 2; k++) {
                            geometry = wall.geometries[k].clone();
                            geometry.applyMatrix4(new THREE.Matrix4().makeRotationY(Math.PI / 2.0));
                            geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(j - this.halfSize.width, 0.25, i - this.halfSize.depth + 0.5));
                            geometry.computeBoundingBox();
                            geometry.boundingBox.applyMatrix4(new THREE.Matrix4().makeScale(this.scale.x, this.scale.y, this.scale.z));
                            geometries[k].push(geometry);
                            this.aabb[i][j][1].union(geometry.boundingBox);
                        }
                        this.helper.add(new THREE.Box3Helper(this.aabb[i][j][1], this.helpersColor));
                    }
                    
                    if ((this.map[i][j] == 0) && j > 0 && j <= this.size.width - 1 && (this.map[i][j - 1] == 2 || this.map[i][j - 1] == 3) && (this.map[i][j + 1] == 2 || this.map[i][j + 1] == 3 || this.map[i][j + 1] == 1)) {
                        let door = this.createDoor();
                        door.position.set(j - this.halfSize.width + 0.08, 0.25, i - this.halfSize.depth + 0.01);
                        this.add(door);
                        this.doors.push({
                            door: door,
                            position: [i, j]
                        });
                    }
                    
                    if ((this.map[i][j] == 1) && j > 0 && j <= this.size.width - 1 && (this.map[i][j - 1] == 0) && (this.map[i][j + 1] == 2 || this.map[i][j + 1] == 3 || this.map[i][j + 1] == 1)) {
                        let door = this.createDoor();
                        door.position.set(j - this.halfSize.width + 0.06, 0.25, i - this.halfSize.depth + 0.01);
                        this.add(door);
                        this.doors.push({
                            door: door,
                            position: [i, j]
                        });
                    }
                    
                    if (j == 0 & this.map[i][j] == 1 && this.map[i][j + 1] == 2) {
                        let door = this.createDoor();
                        door.position.set(j - this.halfSize.width + 0.06, 0.25, i - this.halfSize.depth + 0.01);
                        this.add(door);
                        this.doors.push({
                            door: door,
                            position: [i, j]
                        });

                    }

                    if (this.map[i][j] == 1 && i - 1 >= 0 && this.map[i - 1][j - 1] == 2 && this.map[i - 1][j] == 0) {

                        let door = this.createDoor();
                        door.position.set(j - this.halfSize.width, 0.25, i - this.halfSize.depth - 0.05);
                        door.rotation.y = Math.PI / 2.0;
                        this.add(door);
                        this.doors.push({
                            door: door,
                            position: [i, j]
                        });
                    }
                    
                    if (this.map[i][j] == 2 && i - 1 >= 0 && i < this.size.depth && this.map[i + 1][j] == 1 && this.map[i - 1][j] == 0) {

                        let door = this.createDoor();
                        door.position.set(j - this.halfSize.width, 0.25, i - this.halfSize.depth + 0.05);
                        door.rotation.y = -Math.PI / 2.0;
                        this.add(door);
                        this.doors.push({
                            door: door,
                            position: [i, j]
                        });
                    }
                    
                    if (this.map[i][j] == 2 && i == 0 && this.map[i + 1][j] == 1) {
                        let door = this.createDoor();
                        door.position.set(j - this.halfSize.width, 0.25, i - this.halfSize.depth + 0.05);
                        door.rotation.y = -Math.PI / 2.0;
                        this.add(door);
                        this.doors.push({
                            door: door,
                            position: [i, j]
                        });
                    }
                    
                    if (this.map[i][j] == 0 && i + 1 <= this.size.depth && (this.map[i + 1][j] == 1 || this.map[i + 1][j] == 3) && (this.map[i - 1][j] == 3 || this.map[i - 1][j] == 1)) {
                        let door = this.createDoor();
                        door.position.set(j - this.halfSize.width, 0.25, i - this.halfSize.depth + 0.05);
                        door.rotation.y = -Math.PI / 2.0;
                        this.add(door);
                        this.doors.push({
                            door: door,
                            position: [i, j]
                        });
                    }
                    
                    if (this.map[i][j] == 0 && i + 1 <= this.size.depth && i-1 >= 0 && (this.map[i - 1][j] == (1 || 3)) && (this.map[i + 1][j] == 3 || this.map[i + 1][j] == 2)) {
                        console.log('entrei');
                        let door = this.createDoor();
                        door.position.set(j - this.halfSize.width, 0.25, i - this.halfSize.depth + 0.05);
                        door.rotation.y = -Math.PI / 2.0;
                        this.add(door);
                        this.doors.push({
                            door: door,
                            position: [i, j]
                        });
                        console.log('sai');
                    }
                    
                    if (i == this.elevator[0][0] && j == this.elevator[0][1]) {
                        let elev = this.createElevator();
                        elev.position.set(j - this.halfSize.width, 0.25, i - this.halfSize.depth + 0.05);
                        this.add(elev);
                    }
                    
                    for(let k = 0; k < this.passage.length; k++){
                        if(i == this.passage[k][0] && j == this.passage[k][1]){
                            let passa = this.createPassage();
                            passa.position.set(j - this.halfSize.width, 0.25, i - this.halfSize.depth );
                            if(j == this.size.width || j == 0){
                                passa.rotation.y =-Math.PI / 2.0;
                            }
                            this.add(passa);
                         
                        }
                    }
                    


                }
            }

            let mergedGeometry, mesh;
            for (let i = 0; i < 2; i++) {
                mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries[i], false);
                mesh = new THREE.Mesh(mergedGeometry, wall.materials[i]);
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                this.add(mesh);
            }

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.player.initialPosition);
            this.initialDirection = description.player.initialDirection;

            this.loaded = true;
        }

        const onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        const onError = function (url, error) {
            console.error("Error loading resource '" + url + "' (" + error + ").");
        }

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => onProgress(this.url, xhr),

            // onError callback
            error => onError(this.url, error)
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.halfSize.width + 0.5) * this.scale.x, 0.0, (position[0] - this.halfSize.depth + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.halfSize.depth), Math.floor(position.x / this.scale.x + this.halfSize.width)];
    }

    // Detect collision with corners (method: BC/AABB)
    cornerCollision(indices, offsets, orientation, position, delta, radius, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];
        if (this.map && this.map[row]) {
        if (this.map[row][column] == 2 - orientation || this.map[row][column] == 3) {
            const x = position.x - (this.cellToCartesian([row, column]).x + delta.x * this.scale.x);
            const z = position.z - (this.cellToCartesian([row, column]).z + delta.z * this.scale.z);
            if (x * x + z * z < radius * radius) {
                console.log("Collision with " + name + ".");
                return true;
            }
        }
    }
        return false;
    }

    // Detect collision with walls (method: BC/AABB)
    wallCollision(indices, offsets, orientation, position, delta, radius, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];

        if(this.map && this.map[row]){
        if (this.map[row][column] == 2 - orientation || this.map[row][column] == 3) {
           
            if (orientation != 0) {
                if (Math.abs(position.x - (this.cellToCartesian([row, column]).x + delta.x * this.scale.x)) < radius) {
                    console.log("Collision with " + name + ".");
                    return true;
                }
            }
            else {
                if (Math.abs(position.z - (this.cellToCartesian([row, column]).z + delta.z * this.scale.z)) < radius) {
                    console.log("Collision with " + name + ".");
                    return true;
                }
            }

        }
        
    }
        return false;
    }

    // Detect collision with walls and corners (method: OBB/AABB)
    wallAndCornerCollision(indices, offsets, orientation, obb, name) {
        const row = indices[0] + offsets[0];
        const column = indices[1] + offsets[1];
        if (this.map && this.map[row]) {
           
        if (this.map[row][column] == 2 - orientation || this.map[row][column] == 3) {
            if (obb.intersectsBox3(this.aabb[row][column][orientation])) {
                console.log("Collision with " + name + ".");
                return true;
            }
        }
    }
        return false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    //Add elecator collision function
    elevatorCollision(indices, position, delta, radius, name) {
        const i = indices[0]
        const j = indices[1]
        if ((i == this.elevator[0][0] && j == this.elevator[0][1]) || (i == this.elevator[0][0] && j == this.elevator[0][1] - 1)) {
            if (Math.abs(position.z - (this.cellToCartesian([i, j]).z + delta.z * this.scale.z)) < radius) {
                console.log("Collision with " + name + ".");

                 

                return true;
            }
        }
        return false;

    }

    //Add passage collision function
    passageCollision(indices, position, delta, radius, name) {
        const i = indices[0]
        const j = indices[1]
       
        for(let k = 0; k < this.passage.length; k++){
            if(this.passage[k][1] == this.size.width || this.passage[k][1] == 0){
                if ((i == this.passage[k][0]-1 && j == this.passage[k][1]) || (i == this.passage[k][0] && j == this.passage[k][1])) {
                    if (Math.abs(position.x - (this.cellToCartesian([i, j]).x+ delta.x * this.scale.x)) < radius) {
                        console.log("Collision with " + name + ".");

                        this.passageFloor=this.passagesFloors[k];
                        return true;
                    }
                }
            }else{
                   
                if ((i == this.passage[k][0] && j == this.passage[k][1]-1) || (i == this.passage[k][0] && j == this.passage[k][1])) {
                    if (Math.abs(position.z- (this.cellToCartesian([i, j]).z + delta.z * this.scale.z)) < radius) {
                        console.log("Collision with " + name + ".");

                        this.passageFloor=this.passagesFloors[k];
                        return true;
                    }
                }
            }
            
        }
        return false;
    }
        

    // Add door as a parameter to your function
    doorCollision(indices, position, delta, radius, name) {
        const i = indices[0]
        const j = indices[1]



        if ((this.map[i][j] == 0) && j > 0 && j <= this.size.width - 1 && (this.map[i][j - 1] == 2 || this.map[i][j - 1] == 3) && (this.map[i][j + 1] == 2 || this.map[i][j + 1] == 3 || this.map[i][j + 1] == 1)) {
            if (Math.abs(position.z - (this.cellToCartesian([i, j]).z + delta.z * this.scale.z)) < radius) {


                console.log("Collision with " + name + ".");
                for (let door of this.doors) {
                    if (door.position[0] == indices[0] && door.position[1] == indices[1]) {

                        if (door.door.state === "closed") {
                            door.door.children[1].rotation.y = -Math.PI / 2.0;
                            door.door.state = "open"; // Update the door state


                            this.sleep(1500).then(() => {
                                door.door.children[1].rotation.y = 0;
                                door.door.state = "closed"; // Update the door state
                            });

                            return true;

                        }
                        return false;
                    }
                }
            }
        } else if ((this.map[i][j] == 1) && j > 0 && j <= this.size.width - 1 && (this.map[i][j - 1] == 0) && (this.map[i][j + 1] == 2 || this.map[i][j + 1] == 3 || this.map[i][j + 1] == 1)) {
            if (Math.abs(position.z - (this.cellToCartesian([i, j]).z + delta.z * this.scale.z)) < radius) {
                console.log("Collision with " + name + ".");
                for (let door of this.doors) {
                    if (door.position[0] == indices[0] && door.position[1] == indices[1]) {

                        if (door.door.state === "closed") {
                            door.door.children[1].rotation.y = -Math.PI / 2.0;
                            door.door.state = "open"; // Update the door state
                            this.sleep(1500).then(() => {
                                door.door.children[1].rotation.y = 0;
                                door.door.state = "closed"; // Update the door state
                            });
                            return true;
                        }
                        return false;
                    }
                }
            }

        } else if (j == 0 & this.map[i][j] == 1 && this.map[i][j + 1] == 2) {
            if (Math.abs(position.z - (this.cellToCartesian([i, j]).z + delta.z * this.scale.z)) < radius) {
                console.log("Collision with " + name + ".");
                for (let door of this.doors) {
                    if (door.position[0] == indices[0] && door.position[1] == indices[1]) {

                        if (door.door.state === "closed") {
                            door.door.children[1].rotation.y = -Math.PI / 2.0;
                            door.door.state = "open"; // Update the door state
                            this.sleep(1500).then(() => {
                                door.door.children[1].rotation.y = 0;
                                door.door.state = "closed"; // Update the door state
                            });
                            return true;
                        }
                        return false;
                    }
                }
            }

        } else if (this.map[i][j] == 1 && i - 1 >= 0 && this.map[i - 1][j - 1] == 2 && this.map[i - 1][j] == 0) {

            if (Math.abs(position.x - (this.cellToCartesian([i, j]).x + delta.x * this.scale.x)) < radius) {
                console.log("Collision with " + name + ".");
                for (let door of this.doors) {
                    if (door.position[0] == indices[0] && door.position[1] == indices[1]) {

                        if (door.door.state === "closed") {
                            door.door.children[1].rotation.y = -Math.PI / 2.0;
                            door.door.state = "open"; // Update the door state
                            this.sleep(1500).then(() => {
                                door.door.children[1].rotation.y = 0;
                                door.door.state = "closed"; // Update the door state
                            });
                            return true;
                        }
                        return false;
                    }
                }
            }

        } else if (this.map[i][j] == 2 && i - 1 >= 0 && i < this.size.depth && this.map[i + 1][j] == 1 && this.map[i - 1][j] == 0) {
            if (Math.abs(position.x - (this.cellToCartesian([i, j]).x + delta.x * this.scale.x)) < radius) {
                console.log("Collision with " + name + ".");
                for (let door of this.doors) {
                    if (door.position[0] == indices[0] && door.position[1] == indices[1]) {

                        if (door.door.state === "closed") {
                            door.door.children[1].rotation.y = -Math.PI / 2.0;
                            door.door.state = "open"; // Update the door state
                            this.sleep(1500).then(() => {
                                door.door.children[1].rotation.y = 0;
                                door.door.state = "closed"; // Update the door state
                            });
                            return true;
                        }
                        return false;
                    }
                }
            }

        } else if (this.map[i][j] == 2 && i == 0 && this.map[i + 1][j] == 1) {
            if (Math.abs(position.x - (this.cellToCartesian([i, j]).x + delta.x * this.scale.x)) < radius) {
                console.log("Collision with " + name + ".");
                for (let door of this.doors) {
                    if (door.position[0] == indices[0] && door.position[1] == indices[1]) {

                        if (door.door.state === "closed") {
                            door.door.children[1].rotation.y = -Math.PI / 2.0;
                            door.door.state = "open"; // Update the door state
                            this.sleep(1500).then(() => {
                                door.door.children[1].rotation.y = 0;
                                door.door.state = "closed"; // Update the door state
                            });
                            return true;
                        }
                        return false;
                    }
                }
            }

        } else if (this.map[i][j] == 0 && i + 1 <= this.size.depth && (this.map[i + 1][j] == 1 || this.map[i + 1][j] == 3) && (this.map[i - 1][j] == 3 || this.map[i - 1][j] == 1)) {
            if (Math.abs(position.x - (this.cellToCartesian([i, j]).x + delta.x * this.scale.x)) < radius) {
                console.log("Collision with " + name + ".");
                for (let door of this.doors) {
                    if (door.position[0] == indices[0] && door.position[1] == indices[1]) {

                        if (door.door.state === "closed") {
                            door.door.children[1].rotation.y = -Math.PI / 2.0;
                            door.door.state = "open"; // Update the door state
                            this.sleep(1500).then(() => {
                                door.door.children[1].rotation.y = 0;
                                door.door.state = "closed"; // Update the door state
                            });
                            return true;
                        }
                        return false;
                    }
                }
            }

        } else if (this.map[i][j] == 0 && i + 1 <= this.size.depth && i-1 >= 0 && (this.map[i - 1][j] == (1 || 3)) && (this.map[i + 1][j] == 3 || this.map[i + 1][j] == 2)) {

            if (Math.abs(position.x - (this.cellToCartesian([i, j]).x + delta.x * this.scale.x)) < radius) {
                console.log("Collision with " + name + ".");
                for (let door of this.doors) {
                    if (door.position[0] == indices[0] && door.position[1] == indices[1]) {

                        if (door.door.state === "closed") {
                            door.door.children[1].rotation.y = -Math.PI / 2.0;
                            door.door.state = "open"; // Update the door state
                            this.sleep(1500).then(() => {
                                door.door.children[1].rotation.y = 0;
                                door.door.state = "closed"; // Update the door state
                            });
                            return true;
                        }
                        return false;
                    }
                }
            }

        }

        return false;
    }


    // Detect collisions
    collision(method, position, halfSize, direction) {
        const indices = this.cartesianToCell(position);


        if (method != "obb-aabb") {
            if (
                this.wallCollision(indices, [0, 0], 0, position, { x: 0.0, z: -0.475 }, halfSize, "north wall") || // Collision with north wall
                this.wallCollision(indices, [0, 0], 1, position, { x: -0.475, z: 0.0 }, halfSize, "west wall") || // Collision with west wall
                this.wallCollision(indices, [1, 0], 0, position, { x: 0.0, z: -0.525 }, halfSize, "south wall") || // Collision with south wall
                this.wallCollision(indices, [0, 1], 1, position, { x: -0.525, z: 0.0 }, halfSize, "east wall") || // Collision with east wall
                this.cornerCollision(indices, [1, 0], 1, position, { x: -0.475, z: -0.5 }, halfSize, "southwest corner (NS-oriented wall)") || // Collision with southwest corner (NS-oriented wall)
                this.cornerCollision(indices, [1, 1], 0, position, { x: -0.5, z: -0.525 }, halfSize, "southeast corner (WE-oriented wall)") || // Collision with southeast corner (WE-oriented wall)
                this.cornerCollision(indices, [1, 1], 1, position, { x: -0.525, z: -0.5 }, halfSize, "southeast corner (NS-oriented wall)") || // Collision with southeast corner (NS-oriented wall)
                this.cornerCollision(indices, [0, 1], 0, position, { x: -0.5, z: -0.475 }, halfSize, "northeast corner (WE-oriented wall)") || // Collision with northeast corner (WE-oriented wall)

                indices[0] > 0 && (
                    this.cornerCollision(indices, [-1, 1], 1, position, { x: -0.525, z: 0.5 }, halfSize, "northeast corner (NS-oriented wall)") || // Collision with northeast corner (NS-oriented wall)
                    this.cornerCollision(indices, [-1, 0], 1, position, { x: -0.475, z: 0.5 }, halfSize, "northwest corner (NS-oriented wall)") // Collision with northwest corner (NS-oriented wall)
                ) ||
                indices[1] > 0 && (
                    this.cornerCollision(indices, [0, -1], 0, position, { x: 0.5, z: -0.475 }, halfSize, "northwest corner (WE-oriented wall)") || // Collision with northwest corner (WE-oriented wall)
                    this.cornerCollision(indices, [1, -1], 0, position, { x: 0.5, z: -0.525 }, halfSize, "southwest corner (WE-oriented wall)") // Collision with southwest corner (WE-oriented wall)
                )

            ) {
                return { returnValue: true, collisionType: "wall" };
            }

            if (this.doorCollision(indices, position, { x: -0.475, z: -0.5 }, halfSize, "door")) {
                return { returnValue: true, collisionType: "door"};
            }

            if (this.elevatorCollision(indices, position, { x: -0.475, z: -0.5 }, halfSize, "elevator")) {
                return { returnValue: true, collisionType: "elevator", elevatorPosition:indices};
            }
            
            if (this.passageCollision(indices, position, { x: -0.475, z: -0.5 }, halfSize, "passage")) {
                return { returnValue: true, collisionType: "passage",passagePosition:indices, passageFloor:this.passageFloor};
            }
            // No collision
            return { returnValue: false, collisionType: "none" };
        }
        else {
            // Create the object's oriented bounding box (OBB) in 3D space and set its orientation
            const obb = new OBB(position, halfSize);
            obb.applyMatrix4(new THREE.Matrix4().makeRotationY(direction));
            if (
                this.wallAndCornerCollision(indices, [0, 0], 0, obb, "north wall") || // Collision with north wall
                this.wallAndCornerCollision(indices, [0, 0], 1, obb, "west wall") || // Collision with west wall
                this.wallAndCornerCollision(indices, [1, 0], 0, obb, "south wall") || // Collision with south wall
                this.wallAndCornerCollision(indices, [0, 1], 1, obb, "east wall") || // Collision with east wall

                this.wallAndCornerCollision(indices, [1, 0], 1, obb, "southwest corner (NS-oriented wall)") || // Collision with southwest corner (NS-oriented wall)
                this.wallAndCornerCollision(indices, [1, 1], 0, obb, "southeast corner (WE-oriented wall)") || // Collision with southeast corner (WE-oriented wall)
                this.wallAndCornerCollision(indices, [1, 1], 1, obb, "southeast corner (NS-oriented wall)") || // Collision with southeast corner (NS-oriented wall)
                this.wallAndCornerCollision(indices, [0, 1], 0, obb, "northeast corner (WE-oriented wall)") || // Collision with northeast corner (WE-oriented wall)

                indices[0] > 0 && (
                    this.wallAndCornerCollision(indices, [-1, 1], 1, obb, "northeast corner (NS-oriented wall)") || // Collision with northeast corner (NS-oriented wall)
                    this.wallAndCornerCollision(indices, [-1, 0], 1, obb, "northwest corner (NS-oriented wall)") // Collision with northwest corner (NS-oriented wall)
                ) ||
                indices[1] > 0 && (
                    this.wallAndCornerCollision(indices, [0, -1], 0, obb, "northwest corner (WE-oriented wall)") || // Collision with northwest corner (WE-oriented wall)
                    this.wallAndCornerCollision(indices, [1, -1], 0, obb, "southwest corner (WE-oriented wall)") // Collision with southwest corner (WE-oriented wall)
                )
            ) {
                return { returnValue: true, collisionType: "wallCorner" };
            }
            // No collision
            return { returnValue: false, collisionType: "none" };
        }
    }

    foundExit(position) {
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };


    createPassage() {
        const frameSize = { width: 2.00, height: 0.5, depth: 0.045 };
        const sideMaterial = new THREE.MeshBasicMaterial({ color: 0xc36e2d });

        //create the frame

        // Create a box geometry
        let geometry = new THREE.BoxGeometry(frameSize.width, frameSize.height, frameSize.depth);

        // Create a texture
        let texture = new THREE.TextureLoader().load("./../../assets/textures/passage/istockphoto-1254567457-612x612.jpg");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        let frontMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        frontMaterial.transparent = true;

        // Create a texture
        texture = new THREE.TextureLoader().load("./../../assets/textures/passage/istockphoto-1254567457-612x612.jpg");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        let backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        backMaterial.transparent = true;

        // Create a mesh with the specified geometry and materials
        let frameMesh = new THREE.Mesh(geometry, [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial]);

        // Create passage


        const passage = new THREE.Group();

        // Add the meshes to the group
        passage.add(frameMesh);

        return passage;
    }

    createElevator() {
        const frameSize = { width: 2.00, height: 0.5, depth: 0.045 };
        const sideMaterial = new THREE.MeshBasicMaterial({ color: 0xc36e2d });

        //create the frame

        // Create a box geometry
        let geometry = new THREE.BoxGeometry(frameSize.width, frameSize.height, frameSize.depth);

        // Create a texture
        let texture = new THREE.TextureLoader().load("./../../assets/textures/elevator/istockphoto-939501722-170667a.jpg");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        let frontMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        frontMaterial.transparent = true;

        // Create a texture
        texture = new THREE.TextureLoader().load("./../../assets/textures/elevator/istockphoto-939501722-170667a.jpg");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        let backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        backMaterial.transparent = true;

        // Create a mesh with the specified geometry and materials
        let frameMesh = new THREE.Mesh(geometry, [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial]);

        // Create elevator


        const elevator = new THREE.Group();

        // Add the meshes to the group
        elevator.add(frameMesh);

        return elevator;
    }

    createDoor() {

        const frameSize = { width: 1.00, height: 0.5, depth: 0.045 };
        const doorSize = { width: 0.85, height: 0.5, depth: 0.035, gap: 0.002325 };
        const sideMaterial = new THREE.MeshBasicMaterial({ color: 0xc36e2d });

        // Create the frame

        // Create a box geometry
        let geometry = new THREE.BoxGeometry(frameSize.width, frameSize.height, frameSize.depth);

        // Create a texture
        let texture = new THREE.TextureLoader().load("./../../assets/textures/door/frame_front.png");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        let frontMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        frontMaterial.transparent = true;

        // Create a texture
        texture = new THREE.TextureLoader().load("./../../assets/textures/door/frame_back.png");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        let backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
        backMaterial.transparent = true;

        // Create a mesh with the specified geometry and materials
        let frameMesh = new THREE.Mesh(geometry, [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial]);


        // Create the door

        // Create a box geometry
        geometry = new THREE.BoxGeometry(doorSize.width, doorSize.height, doorSize.depth);

        // Create a texture
        texture = new THREE.TextureLoader().load("./../../assets/textures/door/door_front.png");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        frontMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });

        // Create a texture
        texture = new THREE.TextureLoader().load("./../../assets/textures/door/door_back.png");
        texture.colorSpace = THREE.SRGBColorSpace;

        // Create a material
        backMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });

        // Create a mesh with the specified geometry and materials
        let doorMesh = new THREE.Mesh(geometry, [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial]);
        doorMesh.geometry.translate(doorSize.width / 2.0, -doorSize.gap, 0);
        frameMesh.translateX(doorSize.width / 2.0)
        // Create a group

        const door = new THREE.Group();

        // Add the meshes to the group
        door.add(frameMesh);
        door.add(doorMesh);
        door.state = "closed";
        const tween = new TWEEN.Tween(door.rotation);
        /*
        // Create and configure the GUI
        const gui = new GUI();
        const actions = {
            open: () => {
                if (state != "open") {
                    state = "open";
                    tween.stop();
                    tween.to({ y: Math.PI / 2.0 }, 2000 * (1.0 - door.rotation.y / (Math.PI / 2.0)));
                    tween.startFromCurrentValues();
                }
            },
            stop: () => {
                state = "stop";
                tween.stop();
            },
            close: () => {
                if (state != "close") {
                    state = "close";
                    tween.stop();
                    tween.to({ y: 0.0 }, 2000 * door.rotation.y / (Math.PI / 2.0));
                    tween.startFromCurrentValues();
                }
            }
        };
        gui.add(actions, "open");
        gui.add(actions, "stop");
        gui.add(actions, "close");
        */

        return door;
    }

}