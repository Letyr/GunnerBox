import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { BoxGeometry, MeshNormalMaterial, Mesh } from 'three';
import { Main } from './main/main';
import { KeyboardController } from './controller/keyboardController';
import { dtd, dt } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;

  private _mesh: Mesh;

  constructor(
    private _mainService: Main,
    private _keyboardController: KeyboardController,
  ) {

  }

  public ngOnInit() {
    this._mainService.init(this.canvas.nativeElement);

    const geometry = new BoxGeometry(0.2, 0.2, 0.2);
    const material = new MeshNormalMaterial();

    this._mesh = new Mesh(geometry, material);
    this._mainService.scene.add(this._mesh);

    this._mainService.start();

    this._keyboardController.key('any', 'down').subscribe(event => {
      console.log('Нажата клавиша: ', event.key);
    });

    this._keyboardController.key(' ').subscribe(event => {
      this._mesh.position.y += 0.2 * dt;
    });

    this._keyboardController.key('c').subscribe(event => {
      this._mesh.position.y -= 0.2 * dt;
    });

    this._keyboardController.key('a').subscribe(event => {
      this._mesh.position.x -= 0.2 * dt;
    });

    this._keyboardController.key('d').subscribe(event => {
      this._mesh.position.x += 0.2 * dt;
    });

    this._keyboardController.key('w').subscribe(event => {
      this._mesh.position.z -= 0.2 * dt;
    });

    this._keyboardController.key('s').subscribe(event => {
      this._mesh.position.z += 0.2 * dt;
    });

    this._keyboardController.key(['Shift', 'W']).subscribe(event => {
      this._mesh.rotation.x += 90 * dtd;
    });

    this._keyboardController.key(['Shift', 'S']).subscribe(event => {
      this._mesh.rotation.x -= 90 * dtd;
    });

    this._keyboardController.key(['Shift', 'A']).subscribe(event => {
      this._mesh.rotation.y += 90 * dtd;
    });

    this._keyboardController.key(['Shift', 'D']).subscribe(event => {
      this._mesh.rotation.y -= 90 * dtd;
    });

    this._keyboardController.key(['Shift', 'Q']).subscribe(event => {
      this._mesh.rotation.z -= 90 * dtd;
    });

    this._keyboardController.key(['Shift', 'E']).subscribe(event => {
      this._mesh.rotation.z += 90 * dtd;
    });

    // this._mainService.beforeDraw.push(() => {
    //   this._mesh.rotation.x += 0.01;
    //   this._mesh.rotation.y += 0.02;
    // });
  }
}
