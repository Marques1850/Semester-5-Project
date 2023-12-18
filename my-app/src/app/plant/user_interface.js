import * as THREE from "three";
import Orientation from "./orientation.js";
import CubeTexture from "./cubetexture.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { floor, get, last } from "lodash";

export default class UserInterface extends GUI {
    constructor(thumbRaiser) {
        super();
        this.initialize(thumbRaiser);
    }

    async initialize(thumbRaiser) {
        const audioCallback = function (enabled) {
            if (!enabled) {
                thumbRaiser.audio.stopAll();
            }
        }

        const textureCallback = function (options, name) {
            thumbRaiser.cubeTexture = new CubeTexture(thumbRaiser.cubeTexturesParameters.skyboxes[options.indexOf(name)]);
            thumbRaiser.buildCreditsPanel();
        }

        const createEmoteCallback = function (animations, name) {
            callbacks[name] = function () {
                animations.fadeToAction(name, 0.2);
            };
            emotesFolder.add(callbacks, name);
        }

        const positionCallback = function (light, distance, orientation) {
            const position = light.orientationToPosition(distance, orientation);
            light.position.set(position.x, position.y, position.z);
        }

        this.resetUserInterface = function () {
            this.reset();
            thumbRaiser.fixedViewCamera.fogDensity = thumbRaiser.fixedViewCamera.initialFogDensity;
            thumbRaiser.firstPersonViewCamera.fogDensity = thumbRaiser.firstPersonViewCamera.initialFogDensity;
            thumbRaiser.thirdPersonViewCamera.fogDensity = thumbRaiser.thirdPersonViewCamera.initialFogDensity;
            thumbRaiser.topViewCamera.fogDensity = thumbRaiser.topViewCamera.initialFogDensity;
            this.fogParameters.density = thumbRaiser.activeViewCamera.fogDensity;
        }

        const fontSize = "1.5vmin";

        this.domElement.style.position = "absolute";
        this.domElement.style.right = "0.5vw";
        this.domElement.style.top = "1.0vh";
        this.domElement.style.fontSize = fontSize;

        // Create the audio folder
        const audioFolder = this.addFolder("Audio");
        audioFolder.domElement.style.fontSize = fontSize;
        audioFolder.add(thumbRaiser.audio, "enabled").onChange(enabled => audioCallback(enabled));
        audioFolder.add(thumbRaiser.audio, "volume", thumbRaiser.audio.volumeMin, thumbRaiser.audio.volumeMax, thumbRaiser.audio.volumeStep).onChange(volume => thumbRaiser.audio.listener.setMasterVolume(volume));
        audioFolder.close();

        // Create the skyboxes folder and add cube textures
        const skyboxesFolder = this.addFolder("Skyboxes");
        skyboxesFolder.domElement.style.fontSize = fontSize;
        const cubeTexturesParameters = { name: thumbRaiser.cubeTexturesParameters.skyboxes[thumbRaiser.cubeTexturesParameters.selected].name };
        const cubeTexturesOptions = [];
        for (let i = 0; i < thumbRaiser.cubeTexturesParameters.skyboxes.length; i++) {
            cubeTexturesOptions[i] = thumbRaiser.cubeTexturesParameters.skyboxes[i].name;
        }
        skyboxesFolder.add(cubeTexturesParameters, "name").options(cubeTexturesOptions).onChange(name => textureCallback(cubeTexturesOptions, name));
        skyboxesFolder.close();

        // Create the character folder
        const characterFolder = this.addFolder("Character");
        characterFolder.domElement.style.fontSize = fontSize;

        // Create the emotes folder and add emotes
        const emotesFolder = characterFolder.addFolder("Emotes");
        emotesFolder.domElement.style.fontSize = fontSize;
        const callbacks = [];
        for (let i = 0; i < thumbRaiser.animations.emotes.length; i++) {
            createEmoteCallback(thumbRaiser.animations, thumbRaiser.animations.emotes[i]);
        }
        emotesFolder.close();

        // Create the expressions folder and add expressions
        const expressionsFolder = characterFolder.addFolder("Expressions");
        expressionsFolder.domElement.style.fontSize = fontSize;
        const expressions = Object.keys(thumbRaiser.player.face.morphTargetDictionary);
        for (let i = 0; i < expressions.length; i++) {
            expressionsFolder.add(thumbRaiser.player.face.morphTargetInfluences, i, 0.0, 1.0, 0.01).name(expressions[i]);
        }
        expressionsFolder.close();

        characterFolder.close();

        // Create the lights folder
        const lightsFolder = this.addFolder("Lights");
        lightsFolder.domElement.style.fontSize = fontSize;

        // Create the ambient light folder
        const ambientLightFolder = lightsFolder.addFolder("Ambient light");
        ambientLightFolder.domElement.style.fontSize = fontSize;
        const ambientLightParameters = { color: "#" + new THREE.Color(thumbRaiser.ambientLight.color).getHexString() };
        ambientLightFolder.add(thumbRaiser.ambientLight, "visible").listen();
        ambientLightFolder.addColor(ambientLightParameters, "color").onChange(color => thumbRaiser.ambientLight.color.set(color));
        ambientLightFolder.add(thumbRaiser.ambientLight, "intensity", thumbRaiser.ambientLight.intensityMin, thumbRaiser.ambientLight.intensityMax, thumbRaiser.ambientLight.intensityStep);
        ambientLightFolder.close();

        // Create the directional light folder
        const directionalLightFolder = lightsFolder.addFolder("Directional light");
        directionalLightFolder.domElement.style.fontSize = fontSize;
        const directionalLightParameters = { color: "#" + new THREE.Color(thumbRaiser.directionalLight.color).getHexString() };
        directionalLightFolder.add(thumbRaiser.directionalLight, "visible").listen();
        directionalLightFolder.addColor(directionalLightParameters, "color").onChange(color => thumbRaiser.directionalLight.color.set(color));
        directionalLightFolder.add(thumbRaiser.directionalLight, "intensity", thumbRaiser.directionalLight.intensityMin, thumbRaiser.directionalLight.intensityMax, thumbRaiser.directionalLight.intensityStep);
        directionalLightFolder.add(thumbRaiser.directionalLight.orientation, "h", thumbRaiser.directionalLight.orientationMin.h, thumbRaiser.directionalLight.orientationMax.h, thumbRaiser.directionalLight.orientationStep.h).onChange(h => positionCallback(thumbRaiser.directionalLight, thumbRaiser.directionalLight.distance, new Orientation(h, thumbRaiser.directionalLight.orientation.v)));
        directionalLightFolder.add(thumbRaiser.directionalLight.orientation, "v", thumbRaiser.directionalLight.orientationMin.v, thumbRaiser.directionalLight.orientationMax.v, thumbRaiser.directionalLight.orientationStep.v).onChange(v => positionCallback(thumbRaiser.directionalLight, thumbRaiser.directionalLight.distance, new Orientation(thumbRaiser.directionalLight.orientation.h, v)));
        directionalLightFolder.close();

        // Create the spotlight folder
        const spotLightFolder = lightsFolder.addFolder("Spotlight");
        spotLightFolder.domElement.style.fontSize = fontSize;
        const spotLightParameters = { color: "#" + new THREE.Color(thumbRaiser.spotLight.color).getHexString(), angle: THREE.MathUtils.radToDeg(thumbRaiser.spotLight.angle) };
        spotLightFolder.add(thumbRaiser.spotLight, "visible").listen();
        spotLightFolder.addColor(spotLightParameters, "color").onChange(color => thumbRaiser.spotLight.color.set(color));
        spotLightFolder.add(thumbRaiser.spotLight, "intensity", thumbRaiser.spotLight.intensityMin, thumbRaiser.spotLight.intensityMax, thumbRaiser.spotLight.intensityStep);
        spotLightFolder.add(thumbRaiser.spotLight, "distance", thumbRaiser.spotLight.distanceMin, thumbRaiser.spotLight.distanceMax, thumbRaiser.spotLight.distanceStep);
        spotLightFolder.add(spotLightParameters, "angle", thumbRaiser.spotLight.angleMin, thumbRaiser.spotLight.angleMax, thumbRaiser.spotLight.angleStep).onChange(angle => thumbRaiser.spotLight.angle = THREE.MathUtils.degToRad(angle));
        spotLightFolder.add(thumbRaiser.spotLight, "penumbra", thumbRaiser.spotLight.penumbraMin, thumbRaiser.spotLight.penumbraMax, thumbRaiser.spotLight.penumbraStep);
        spotLightFolder.add(thumbRaiser.spotLight.position, "x", thumbRaiser.spotLight.positionMin.x, thumbRaiser.spotLight.positionMax.x, thumbRaiser.spotLight.positionStep.x);
        spotLightFolder.add(thumbRaiser.spotLight.position, "y", thumbRaiser.spotLight.positionMin.y, thumbRaiser.spotLight.positionMax.y, thumbRaiser.spotLight.positionStep.y);
        spotLightFolder.add(thumbRaiser.spotLight.position, "z", thumbRaiser.spotLight.positionMin.z, thumbRaiser.spotLight.positionMax.z, thumbRaiser.spotLight.positionStep.z);
        spotLightFolder.close();

        lightsFolder.close();

        // Create the shadows folder
        const shadowsFolder = this.addFolder("Shadows");
        shadowsFolder.domElement.style.fontSize = fontSize;
        shadowsFolder.add(thumbRaiser.shadowsParameters, "enabled").listen();
        shadowsFolder.close();

        // Create the collision detection folder
        const collisionDetectionFolder = this.addFolder("Collision detection");
        collisionDetectionFolder.domElement.style.fontSize = fontSize;
        const collisionDetectionParameters = { method: thumbRaiser.collisionDetectionParameters.method == "bc-aabb" ? "BC / AABB" : "OBB / AABB" };
        const collisionDetectionOptions = ["BC / AABB", "OBB / AABB"];
        collisionDetectionFolder.add(collisionDetectionParameters, "method")
            .options(collisionDetectionOptions)
            .onChange(name => thumbRaiser.setCollisionDetectionMethod(["bc-aabb", "obb-aabb"][collisionDetectionOptions.indexOf(name)]));
        collisionDetectionFolder.add(thumbRaiser.collisionDetectionParameters.boundingVolumes, "visible")
            .onChange(visible => thumbRaiser.setBoundingVolumesVisibility(visible)).listen();
        collisionDetectionFolder.close();

        // Selection of the building folder
        const buildingSelectionFolder = this.addFolder("Change Building");
        buildingSelectionFolder.domElement.style.fontSize = fontSize;

        // Selection of the floor folder
        const floorSelectionFolder = this.addFolder("Change Floor");
        floorSelectionFolder.domElement.style.fontSize = fontSize;

        let selectedBuilding = ""; // Default Building Value
        let selectedFloor = ""; // Default Floor Value

        // Fetch buildings
        try {
            const buildingList = await this.getBuildings();

            const buildingSelectionParameters = { code: "" };
            const buildingSelectionControl = buildingSelectionFolder.add(buildingSelectionParameters, "code", buildingList.map(building => building.code));
            buildingSelectionControl.options(buildingList.map(building => building.code)).onChange(async () => {
                selectedBuilding = buildingSelectionParameters.code;
            
                // Fetch floors
                try {
                    floorSelectionFolder.open();
                    const floorList = await this.listBuildingFloors(selectedBuilding);
                    const floorSelectionParameters = { name: "" };
                    floorSelectionFolder.controllers.forEach(element => {
                        element.destroy();
                    });
                    
                    const floorSelectionControl = floorSelectionFolder.add(floorSelectionParameters, "name", floorList.map(floor => floor.name));
                    floorSelectionControl.options(floorList.map(floor => floor.name)).onChange(async () => {
                    
                        selectedFloor = floorSelectionParameters.name;
                        try {
                            let path = "./../../assets/mazes/" + selectedFloor + ".json";
                            let finalpath="/plant?url=" + encodeURIComponent(path) + "&buildingCode=" + encodeURIComponent(selectedBuilding);

                            floorSelectionFolder.controllers.forEach(element =>{
                                if (element.property == "load") {
                                    element.destroy();
                                }
                            });

                            floorSelectionFolder.add({ load: async() => setTimeout(function() {
                                window.location.href = finalpath;
                            }, 1000) }, "load");
                            
                        } catch (error) {
                            console.error('Error loading map:', error);
                        }
                    });
                    
                } catch (error) {
                    console.error('Error fetching buildings:', error);
                }
            });
            floorSelectionFolder.close();
            buildingSelectionFolder.close();
        } catch (error) {
            console.error('Error fetching buildings:', error);
        }
        this.sleep(1000);

        // Create the reset button
        this.add({ reset: () => this.resetUserInterface() }, "reset");
        this.close();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getBuildings = async () => {
        const buildingURL = 'http://localhost:3000/api/building/buildingsList';
        try {
            const response = await fetch(buildingURL);
            const buildingList = await response.json();
            return buildingList;
        } catch (error) {
            throw error;
        }
    }

    listBuildingFloors = async (buildingCode) => {
        const floorURL = 'http://localhost:3000/api/building/getBuildingFloors';
        let params = new URLSearchParams();
        params.append('code', buildingCode);
        try {
            const response = await fetch(floorURL + '?' + params.toString());
            const floorList = await response.json();
            
            return floorList;
        } catch (error) {
            throw error;
        }
    }


    setVisibility(visible) {
        if ("show" in this && "hide" in this) {
            if (visible) {
                this.show();
            }
            else {
                this.hide();
            }
        }
        else { // Some lil-gui versions do not implement show() / hide() methods
            if (visible) {
                this.domElement.style.display = "block";
            }
            else {
                this.domElement.style.display = "none";
            }
        }
    }
}