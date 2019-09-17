

import { Injectable } from '@angular/core';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

@Injectable()
export class AppService {

  public renderer: WebGLRenderer;

  public camera: PerspectiveCamera;

  public scene: Scene;

  public init(canvas: HTMLCanvasElement) {
    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this.camera.position.z = 1;

    this.scene = new Scene();

    this.renderer = new WebGLRenderer({ antialias: true, canvas });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    canvas.addEventListener('resize', (event) => {
      console.log(event);
    });
  }
}
