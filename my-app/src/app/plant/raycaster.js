import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export default class Raycaster{
    constructor(camera, window,scene){
        this.camera = camera;
        this.window = window;
        this.scene = scene;
        this.onPointerMove = this.onPointerMove.bind(this); 
        this.window.addEventListener('mousemove', this.onPointerMove);
    }

    renderRay(){
        raycaster.setFromCamera(pointer, this.camera.activeProjection);
        const intersects = raycaster.intersectObjects(this.scene.children, true);
        //console.log(intersects[0]);
        return intersects;
    }

    onPointerMove(event){ // event is a MouseEvent
        console.log(this.camera);
        const x= event.clientX - this.camera.viewport.x;
        const y = event.clientY - this.camera.viewport.y;
        pointer.x = (x / this.camera.viewport.width) * 2 - 1;
        pointer.y = - (y/ this.camera.viewport.height) * 2 + 1;
        

        this.renderRay();  
    }

    
}
