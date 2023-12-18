import { AfterViewInit, Component, ElementRef, Input, ViewChild, OnInit} from '@angular/core';
import * as THREE from "three";
import * as TWEEN from '@tweenjs/tween.js';
import Orientation from "./orientation.js";
import ThumbRaiser from "./thumb_raiser.js";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plant',
  templateUrl: './Thumb_Raiser_Loquitas_10x10_displacement.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements AfterViewInit {
    urlString:string="";
    buildingCode:string="";
    constructor(private route: ActivatedRoute) {
        this.route.queryParams.subscribe(params => {
            this.urlString=params['url'];
            this.buildingCode=params['buildingCode'];
        });
    }
    thumbRaiser: ThumbRaiser;

    initialize() {
        // Create the game
        this.thumbRaiser = new ThumbRaiser(
            {}, // General Parameters
            {
                enabled: true,
                introductionClips: [
                    {
                        url: './../../assets/clips/el-gringo-12613.mp3',
                        position: 'initial', // Global (non-positional) audio object: ""; positional audio object: "scene x y z" (scene specific position in cartesian coordinates), "maze line column" (maze specific position in cell coordinates), "exit" (maze exit location), "initial" (player initial position), "player" (player current position), "spotlight" (spotlight current position)
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.5
                    }
                ],
                idleClips: [
                    {
                        url: "./../../assets/clips/Clearing-Throat-Moderate-Speed-www.fesliyanstudios.com.mp3",
                        position: "player",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    },
                    {
                        url: "./../../assets/clips/Small-Double-Cough-1-www.fesliyanstudios.com.mp3",
                        position: "player",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    },
                    {
                        url: "./../../assets/clips/Yawn-A2-www.fesliyanstudios.com.mp3",
                        position: "player",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    }
                ],
                jumpClips: [
                    {
                        url: "./../../assets/clips/Cheering-A6-www.fesliyanstudios.com.mp3",
                        position: "player",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    },
                    {
                        url: "./../../assets/clips/Cheering-A7-www.fesliyanstudios.com.mp3",
                        position: "player",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    }
                ],
                deathClips: [
                    {
                        url: "./../../assets/clips/176653326.mp3",
                        position: "player",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    },
                    {
                        url: "./../../assets/clips/Horn+Squeeze+Clown.mp3",
                        position: "player",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    }
                ],
                danceClips: [
                    {
                        url: "./../../assets/clips/best-buddies-12609.mp3",
                        position: "exit",
                        referenceDistance: 1.0,
                        loop: true,
                        volume: 0.5
                    }
                ],
                endClips: [
                    {
                        url: "./../../assets/clips/Ba-Bum-Tss-Joke-Drum-A1-www.fesliyanstudios.com.mp3",
                        position: "exit",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 2.0
                    },
                    {
                        url: "./../../assets/clips/yay-6326.mp3",
                        position: "exit",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    },
                    {
                        url: "./../../assets/clips/crowd-cheer-ii-6263.mp3",
                        position: "exit",
                        referenceDistance: 1.0,
                        loop: false,
                        volume: 0.75
                    }
                ],
                credits: "Sound clips downloaded from <a href='https://www.dreamstime.com/' target='_blank' rel='noopener'>Dreamstime</a>, <a href='https://www.fesliyanstudios.com/' target='_blank' rel='noopener'>Fesliyan Studios</a> and <a href='https://pixabay.com/' target='_blank' rel='noopener'>Pixabay</a>."
            }, // Audio parameters
            {
                skyboxes: [
                    { // Stormy days
                        name: "Stormy days",
                        texturePath: "./../../assets/cube_textures/envmap_stormydays/",
                        texturePositiveXUrl: "stormydays_ft.jpg",
                        textureNegativeXUrl: "stormydays_bk.jpg",
                        texturePositiveYUrl: "stormydays_up.jpg",
                        textureNegativeYUrl: "stormydays_dn.jpg",
                        texturePositiveZUrl: "stormydays_rt.jpg",
                        textureNegativeZUrl: "stormydays_lf.jpg",
                        credits: "Skybox created by <a href='https://opengameart.org/content/stormy-days-skybox' target='_blank' rel='noopener'>Jockum Skoglund (hipshot)</a>."
                    },
                    { // Miramar
                        name: "Miramar",
                        texturePath: "./../../assets/cube_textures/red-eclipse-skyboxes/skyboxes/",
                        texturePositiveXUrl: "miramar_ft.jpg",
                        textureNegativeXUrl: "miramar_bk.jpg",
                        texturePositiveYUrl: "miramar_up.jpg",
                        textureNegativeYUrl: "miramar_dn.jpg",
                        texturePositiveZUrl: "miramar_rt.jpg",
                        textureNegativeZUrl: "miramar_lf.jpg",
                        credits: "Skybox created by <a href='https://opengameart.org/content/red-eclipse-skyboxes' target='_blank' rel='noopener'>Red Eclipse</a>."
                    },
                    { // Flat sunset
                        name: "Flat sunset",
                        texturePath: "./../../assets/cube_textures/red-eclipse-skyboxes/skyboxes/",
                        texturePositiveXUrl: "sunsetflat_ft.jpg",
                        textureNegativeXUrl: "sunsetflat_bk.jpg",
                        texturePositiveYUrl: "sunsetflat_up.jpg",
                        textureNegativeYUrl: "sunsetflat_dn.jpg",
                        texturePositiveZUrl: "sunsetflat_rt.jpg",
                        textureNegativeZUrl: "sunsetflat_lf.jpg",
                        credits: "Skybox created by <a href='https://opengameart.org/content/red-eclipse-skyboxes' target='_blank' rel='noopener'>Red Eclipse</a>."
                    },
                    { // Calm sea
                        name: "Calm sea",
                        texturePath: "./../../assets/cube_textures/xonotic-skyboxes/skyboxes/calm_sea/",
                        texturePositiveXUrl: "calm_sea_ft.jpg",
                        textureNegativeXUrl: "calm_sea_bk.jpg",
                        texturePositiveYUrl: "calm_sea_up.jpg",
                        textureNegativeYUrl: "calm_sea_dn.jpg",
                        texturePositiveZUrl: "calm_sea_rt.jpg",
                        textureNegativeZUrl: "calm_sea_lf.jpg",
                        credits: "Skybox created by <a href='https://opengameart.org/content/xonotic-skyboxes' target='_blank' rel='noopener'>Xonotic</a>."
                    },
                    { // Distant sunset
                        name: "Distant sunset",
                        texturePath: "./../../assets/cube_textures/xonotic-skyboxes/skyboxes/distant_sunset/",
                        texturePositiveXUrl: "distant_sunset_ft.jpg",
                        textureNegativeXUrl: "distant_sunset_bk.jpg",
                        texturePositiveYUrl: "distant_sunset_up.jpg",
                        textureNegativeYUrl: "distant_sunset_dn.jpg",
                        texturePositiveZUrl: "distant_sunset_rt.jpg",
                        textureNegativeZUrl: "distant_sunset_lf.jpg",
                        credits: "Skybox created by <a href='https://opengameart.org/content/xonotic-skyboxes' target='_blank' rel='noopener'>Xonotic</a>."
                    },
                    { // Exosystem
                        name: "Exosystem",
                        texturePath: "./../../assets/cube_textures/xonotic-skyboxes/skyboxes/exosystem/",
                        texturePositiveXUrl: "exosystem_ft.jpg",
                        textureNegativeXUrl: "exosystem_bk.jpg",
                        texturePositiveYUrl: "exosystem_up.jpg",
                        textureNegativeYUrl: "exosystem_dn.jpg",
                        texturePositiveZUrl: "exosystem_rt.jpg",
                        textureNegativeZUrl: "exosystem_lf.jpg",
                        credits: "Skybox created by <a href='https://opengameart.org/content/xonotic-skyboxes' target='_blank' rel='noopener'>Xonotic</a>."
                    },
                    { // Heaven
                        name: "Heaven",
                        texturePath: "./../../assets/cube_textures/xonotic-skyboxes/skyboxes/heaven/",
                        texturePositiveXUrl: "heaven_ft.jpg",
                        textureNegativeXUrl: "heaven_bk.jpg",
                        texturePositiveYUrl: "heaven_up.jpg",
                        textureNegativeYUrl: "heaven_dn.jpg",
                        texturePositiveZUrl: "heaven_rt.jpg",
                        textureNegativeZUrl: "heaven_lf.jpg",
                        credits: "Skybox created by <a href='https://opengameart.org/content/xonotic-skyboxes' target='_blank' rel='noopener'>Xonotic</a>."
                    }
                ],
                selected: 4
            }, // Cube texture parameters
            {
                url: this.urlString,
                helpersColor: new THREE.Color(0xff0077)
            }, // Maze parameters
            { helpersColor: new THREE.Color(0x0055ff) }, // Player parameters
            {
                intensity: 0.1
            }, // Ambient light parameters
            {
                intensity: 0.5,
                distance: 20.0,
                orientation: new Orientation(-38.7, 53.1),
                castShadow: true,
                shadow: {
                    mapSize: new THREE.Vector2(2048, 2048),
                    camera: {
                        left: -20.0,
                        right: 20.0,
                        top: 20.0,
                        bottom: -20.0,
                        near: 0.0,
                        far: 40.0
                    }
                }
            }, // Directional light parameters
            {
                visible: false,
                intensity: 90.0,
                distance: 40.0,
                angle: 4.0,
                position: new THREE.Vector3(0.0, 10.0, 0.0),
                castShadow: true,
                shadow: {
                    camera: {
                        near: 5.0,
                        far: 30.0
                    }
                }
            }, // Spotlight parameters
            {
                color: new THREE.Color(0xffffa0),
                visible: false,
                intensity: 2.0,
                distance: 5.0,
                angle: 20.0,
                orientation: new Orientation(0.0, -20.0),
                castShadow: true,
                shadow: {
                    camera: {
                        near: 0.01,
                        far: 10.0
                    }
                }
            }, // Flashlight parameters
            { type: THREE.PCFSoftShadowMap }, // Shadows parameters
            {}, // Fog parameters
            {}, // Collision detection parameters
            { view: "fixed", initialViewport: new THREE.Vector4(0.0, 1.0, 0.45, 0.5), initialFogDensity: 0.1 }, // Fixed view camera parameters
            { view: "first-person", initialViewport: new THREE.Vector4(1.0, 1.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -10.0), orientationMax: new Orientation(180.0, 90.0), initialFogDensity: 0.7 }, // First-person view camera parameters
            { view: "third-person", initialViewport: new THREE.Vector4(0.0, 0.0, 0.55, 0.5), initialOrientation: new Orientation(0.0, -20.0), initialDistance: 2.0, distanceMin: 1.0, distanceMax: 4.0, initialFogDensity: 0.3 }, // Third-person view camera parameters
            { view: "top", initialViewport: new THREE.Vector4(1.0, 0.0, 0.45, 0.5), initialOrientation: new Orientation(0.0, -90.0), initialDistance: 4.0, distanceMin: 1.0, distanceMax: 16.0, initialFogDensity: 0.2 }, // Top view camera parameters
            { view: "mini-map", initialViewport: new THREE.Vector4(0.5, 0.5, 0.3, 0.3), initialOrientation: new Orientation(180.0, -90.0), initialZoom: 0.64, zoomMin: 0.64, zoomMax: 5.12 }, // Mini-map view camera parameters
            this.buildingCode // Building code
        );

    }

    animate() {
        requestAnimationFrame(this.animate);
        // Update the game

        this.thumbRaiser.update();
        TWEEN.update();
        
    }
        

    ngAfterViewInit(): void {
        this.initialize();
        this.animate = this.animate.bind(this); // bind the method to the current instance
        this.animate();    
    }


}