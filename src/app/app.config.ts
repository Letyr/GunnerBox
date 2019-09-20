// calculations per seconds. Количество физических вычислений в секунду
export const CPM = 100;

// milleseconds per calculation. Количество миллисекунд между вычислениями
export const MPC = 1000.0 / CPM;

// delta time
// домножив на него можно привести условную единицу пространства к изменению в секунду
export const dt = 1 / CPM;

// delta time degree
// домножив на него можно привести условную единицу градуса поворота к изменению в секунду
export const dtd = Math.PI / (CPM * 180.0);
