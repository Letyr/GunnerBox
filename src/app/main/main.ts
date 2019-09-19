

import { Injectable } from '@angular/core';
import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { ReplaySubject } from 'rxjs';
import { MPC } from '../app.config';

@Injectable()
export class Main {
  /** Ссылка на синглетон класса */
  private static _instance: Main;

  /** Инстанс MainService */
  public static get instance(): Main {
    return Main._instance;
  }

  /** Subject для подписки на событие инициализации приложения */
  private _$onInit = new ReplaySubject(1);

  /** Observable для подписки на событие инициализации приложения */
  public $onInit = this._$onInit.asObservable();

  /** Контекст WebGL */
  private _renderer: WebGLRenderer;

  /** Контекст WebGL */
  public get renderer() {
    return this._renderer;
  }

  /** HTMLCanvas элемент приложения */
  private _canvas: HTMLCanvasElement;

  /** HTMLCanvas элемент приложения */
  public get canvas() {
    return this._canvas;
  }

  /**
   * Камера
   * @TODO будет перенесена в camera.ts
   */
  public camera: PerspectiveCamera;

  /**
   * Сцена
   * @TODO будет перенесена в world.ts
   */
  public scene: Scene;

  /**
   * Функции, выполняемые до отрисовки
   * @TODO доработать механизм
   */
  public beforeDraw: (() => void)[] = [];

  /**
   * Функции, выполняемые после отрисовки
   * @TODO доработать механизм
   */
  public afterDraw: (() => void)[] = [];

  /**
   * Функции, выполняемые до отрисовки
   * @TODO доработать механизм
   */
  public beforeCalculate: (() => void)[] = [];

  /**
   * Функции, выполняемые после отрисовки
   * @TODO доработать механизм
   */
  public afterCalculate: (() => void)[] = [];

  constructor() {
    Main._instance = this;
  }

  /**
   * Инициализация приложения
   * @param canvas - html canvas элемент, который будет использован приложением
   */
  public init(canvas: HTMLCanvasElement) {
    // сохранение canvas элемента
    this._canvas = canvas;

    // создание контекста WebGL
    this._renderer = new WebGLRenderer({ antialias: true, canvas });
    this._renderer.setSize(window.innerWidth, window.innerHeight);

    // инициализация камеры
    this.camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    this.camera.position.z = 1;

    // создание сцены
    this.scene = new Scene();

    this._$onInit.next();
  }

  /** Запуск приложения */
  public start() {
    this._animate();
    this._calculate();
  }

  /**
   * Остановка приложения
   */
  public stop() {
    // @TODO
  }

  /**
   * Главный цикл анимации
   */
  private _animate() {
    requestAnimationFrame(() => this._animate());

    this.beforeDraw.forEach(f => f());

    this.renderer.render(this.scene, this.camera);

    this.afterDraw.forEach(f => f());
  }

  private _calculate() {
    setTimeout(() => this._calculate(), MPC);

    this.beforeCalculate.forEach(f => f());

    this.afterCalculate.forEach(f => f());
  }
}



