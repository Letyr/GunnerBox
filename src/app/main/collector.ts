import { Subscription } from 'rxjs';

export class Collector {
    /** Массив подписок */
    private _sub: Subscription[] = [];

    /** Автоудаляемая подписка */
    protected set sub(subscribtion: Subscription) {
      this._sub.push(subscribtion);
    }

    /** Метод очистки подписок */
    protected cleanSubscribtion() {
      this._sub.forEach(sub => sub.unsubscribe());
      this._sub = [];
    }
}