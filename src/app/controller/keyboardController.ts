import { Injectable } from '@angular/core';
import { Observable, fromEvent, Subject, merge } from 'rxjs';
import { filter, tap, share } from 'rxjs/operators';
import { BaseService } from '../main/base-service';
import { Main } from '../main/main';

/**
 * Типы событий для нажатия клавишь
 */
export type KeyEventType = 'down' |'up' | 'pressed';

/**
 * Объект события клавиши
 */
export interface KeyEventsObservable {
    up: Observable<KeyboardEvent>;
    down: Observable<KeyboardEvent>;
    pressed: Observable<KeyboardEvent>;
}

/**
 * Сервис организации управления путем подписок на нажатие клавишь клавиатуры
 */
@Injectable()
export class KeyboardController extends BaseService {
    /** Subject для рассылки уведомления о зажатых клавишах */
    private _pressedSubject: Subject<KeyboardEvent> = new Subject();

    /** Массив зажатых клавишь */
    private _pressedKeyEvents: Map<KeyboardEvent['key'], KeyboardEvent> = new Map();

    /** Observable на события нажатий клавиш */
    private _keyObservables: {
        [type in KeyEventType]: Observable<KeyboardEvent>
    };

    /** Объект соответствий клавиши и типа события нажатия клавиши с _keyObservables */
    private _keyEvents: {
        [type in KeyEventType]: {
            [key: string]: Observable<KeyboardEvent>
        }
    } = {
        up: {},
        down: {},
        pressed: {},
    };

    /**
     * Комбинация зажатых клавишь проверяется для каждой клавиши в одну итерацию. Таким образом за одну итерацию
     * обработка срабатывает столько раз, сколько клавишь в комбинации. Чтобы предотвратить это использую lock объект,
     * который обновляется в начале каждой итерации
     */
    private _iterationSign: boolean = false;

    protected onInit(instance: Main): void {
        // создание слушателей событий нажатий на клавиши
        this._keyObservables = {
            up: (fromEvent(window, 'keyup') as Observable<KeyboardEvent>).pipe(
                tap(event => this._pressedKeyEvents.delete(event.key)),
                share()
            ),
            down: (fromEvent(window, 'keydown') as Observable<KeyboardEvent>).pipe(
                // этот фильтр нужен, чтобы keydown не срабатывал несколько раз при зажатии клавиши
                filter(event => !this._pressedKeyEvents.has(event.key)),
                tap(event => this._pressedKeyEvents.set(event.key, event)),
                share()
            ),
            pressed: this._pressedSubject.asObservable(),
        };

        // подписываемся на up и down, чтобы приложение сразу стало записывать клавиши в _pressedKeys
        this._keyObservables.up.subscribe();
        this._keyObservables.down.subscribe();

        // подключение обработки зажатых клавиш
        instance.beforeCalculate.push(() => this._emmitPressed());
    }

    /**
     * Метод подписки на событие нажатия клавиши
     * @param keys - клавиша, событее которой отслеживается. Если отправить массив будет отслеживаться комбинация клавишь
     * @param type - тип события нажатия клавиши. По умолчанию зажатые клавиши
     * @TODO доработать метод так, чтобы принимались русские клавиши и такие клавиши как Alt, Ctrl, Shift, Esc, Enter, Tab и т.п.
     */
    public key(keys: 'any' | string | string[], type: KeyEventType = 'pressed'): Observable<KeyboardEvent> {
        // преобразование входных аргументов в массив
        const keysArray = Array.isArray(keys) ? keys : [keys];

        // получение массива observable событий типа type на каждую клавишу из keys
        const keysObservers = keysArray.map(key => {
            if (!this._keyEvents[type][key]) {
                // @TODO удалять этот объект, когда нет подписчиков
                this._keyEvents[type][key] = keys === 'any'
                    ? this._keyObservables[type]
                    : this._keyObservables[type].pipe(filter((event: KeyboardEvent) => event.key === key));
            }
            return this._keyEvents[type][key];
        });

        if (keysObservers.length > 1) {
            const mergedObservers = merge(...keysObservers);
            switch(type) {
                case 'up':
                    return mergedObservers.pipe(filter(event => {
                        return keysArray.every(key => this._pressedKeyEvents.has(key) || event.key === key);
                    }));
                case 'down':
                    return mergedObservers.pipe(filter(_ => {
                        return keysArray.every(key => this._pressedKeyEvents.has(key));
                    }));
                case 'pressed':
                    let lock = null;
                    return mergedObservers.pipe(filter(_ => {
                        // lock не позволяет одной и той же комбинации сработать несколько раз за итерацию
                        if (lock !== this._iterationSign && keysArray.every(key => this._pressedKeyEvents.has(key))) {
                            lock = this._iterationSign;
                            return true;
                        }
                    }));
            }
        } else {
            return keysObservers[0];
        }
    }

    /**
     * Метод рассылки событий уже нажатых клавиш подписчикам на pressed клавиши
     */
    private _emmitPressed() {
        // переключаем _iterationSign для сбрасывания lock в комбинациях
        this._iterationSign = !this._iterationSign;
        this._pressedKeyEvents.forEach(event => this._pressedSubject.next(event));
    }
}
