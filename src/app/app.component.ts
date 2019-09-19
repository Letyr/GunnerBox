import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { PerspectiveCamera, Scene, BoxGeometry, MeshNormalMaterial, Mesh, WebGLRenderer } from 'three';
import { Main } from './main/main';
import { KeyboardController } from './controller/keyboardController';

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

    this._keyboardController.keys.a.down.subscribe(event => {
      console.log('a down: ');
    });

    this._keyboardController.keys.a.up.subscribe(event => {
      console.log('a up: ');
    });

    this._keyboardController.keys.a.pressed.subscribe(event => {
      console.log('a pressed: ');
    });

    this._keyboardController.keys.combination('s', 'd').up.subscribe(event => {
      console.log('combination s d up: ');
    });

    this._keyboardController.keys.combination('s', 'd').down.subscribe(event => {
      console.log('combination s d down: ');
    });

    this._keyboardController.keys.combination('s', 'd').pressed.subscribe(event => {
      console.log('combination s d pressed!');
    });

    // подключение обработки зажатых клавиш
    this._mainService.beforeCalculate.push(() => this._keyboardController.emmitPressed());

    this._mainService.beforeDraw.push(() => {
      this._mesh.rotation.x += 0.01;
      this._mesh.rotation.y += 0.02;
    });
  }
}
