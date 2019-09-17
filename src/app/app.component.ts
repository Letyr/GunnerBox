import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer } from 'three';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  private _mesh: Mesh;

  constructor(private _appService: AppService) {

  }

  public ngOnInit() {
    this._appService.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this._appService.camera.position.z = 1;

    this._appService.scene = new Scene();

    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    const material = new MeshNormalMaterial();

    this._mesh = new Mesh(geometry, material);
    this._appService.scene.add(this._mesh);

    this._appService.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas.nativeElement });
    this._appService.renderer.setSize(window.innerWidth, window.innerHeight);

    this.animate();
  }

  public animate() {
    requestAnimationFrame(() => this.animate());

    this._mesh.rotation.x += 0.01;
    this._mesh.rotation.y += 0.02;

    this._appService.renderer.render(this._appService.scene, this._appService.camera);
  }

}
