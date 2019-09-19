// @TODO
export interface WorldObject {
    /** Объект для отрисовки */
    instance: any;

    /** Функция, вызываемая при добавлении объекта на сцены */
    onAdd(): void;

    /** Функция, вызываемая при удалении объекта из сцены */
    onRemove(): void;
}

/** type-guard WorldObject */
export function isWorldObject(object: any): object is WorldObject {
    return typeof object === 'object' && typeof object.onAdd === 'function' && typeof object.onRemove === 'function';
}

// @TODO
export class Wolrd {

    public objects: WorldObject[] = [];

    public add() {}

    public remove() {}

}