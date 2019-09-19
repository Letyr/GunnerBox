import { first } from 'rxjs/operators';

import { Collector } from './collector';
import { Main } from './main';

export abstract class BaseService extends Collector {

    constructor() {
      super();
      // подписка на инициализацию приложения
      Main.instance.$onInit.pipe(
        first()
      ).subscribe({
        next: _ => this.onInit(Main.instance)
      });
    }

    /** Событие, которое вызывается при инициализации приложения */
    public abstract onInit(instance: Main): void;
}