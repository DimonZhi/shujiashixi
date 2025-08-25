import * as d3 from "d3";
// =============================================
// Константы для типов клеток и их размера
// =============================================
const EMPTY = 0;    // Пустая клетка
const SOLID = 1;    // Заполненная клетка (стена)
const CELLSIZE = 4; // Размер клетки в пикселях (не используется в консольной версии)

// Глобальные переменные размера карты
let map_width;
let map_height;

// =============================================
// Функция CountNeighbours: подсчет соседей клетки
// =============================================
function CountNeighbours(x, y, _map) {
    /// @func    CountNeighbours(x,y,_map);
    /// @param   x       Текущая позиция клетки по X
    /// @param   y       Текущая позиция клетки по Y
    /// @param   _map    Текущая карта
    
    let _count = 0; // Счетчик "живых" соседей
    
    // Проверяем все 8 соседей вокруг клетки
    for (let dx = -1; dx < 2; dx++) {
        for (let dy = -1; dy < 2; dy++) {
            const xx = x + dx; // X-позиция соседа
            const yy = y + dy; // Y-позиция соседа
            
            // Если сосед за границами карты - считаем его стеной
            if (xx < 0 || yy < 0 || xx >= map_width || yy >= map_height) {
                _count++;
            } 
            // Пропускаем саму клетку (не считаем ее своим соседом)
            else if (dx === 0 && dy === 0) {
                continue;
            } 
            // Если сосед - стена, увеличиваем счетчик
            else if (_map[xx][yy] === SOLID) {
                _count++;
            }
        }
    }
    
    return _count;
}

// =============================================
// Основная функция генерации карты
// =============================================
function RunCellularAutomata(_map_width, _map_height, _spawn_chance, _create_limit, _destroy_limit, _iterations) {
    /// @func    RunCellularAutomata(...)
    /// @param   _map_width      Ширина карты
    /// @param   _map_height     Высота карты
    /// @param   _spawn_chance   Шанс появления стены (%)
    /// @param   _create_limit   Лимит для создания стены
    /// @param   _destroy_limit  Лимит для уничтожения стены
    /// @param   _iterations     Количество итераций
    
    map_width = _map_width;
    map_height = _map_height;

    // =========================================
    // Внутренние функции
    // =========================================
    
    // Создание пустой карты
    function CreateMap() {
        const _map = [];
        for (let xx = 0; xx < map_width; xx++) {
            _map[xx] = [];
            for (let yy = 0; yy < map_height; yy++) {
                _map[xx][yy] = EMPTY;
            }
        }
        return _map;
    }

    // Рандомизация карты
    function RandomiseMap(_map, _spawn_chance) {
        for (let xx = 0; xx < map_width; xx++) {
            for (let yy = 0; yy < map_height; yy++) {
                // Случайное число от 0 до 100
                if (Math.random() * 100 <= _spawn_chance) {
                    _map[xx][yy] = SOLID;
                }
            }
        }
        return _map;
    }

    // Одна итерация клеточного автомата
    function Iterations(_old_map, _create_limit, _destroy_limit) {
        const _new_map = [];
        for (let xx = 0; xx < map_width; xx++) {
            _new_map[xx] = [];
            for (let yy = 0; yy < map_height; yy++) {
                const _count = CountNeighbours(xx, yy, _old_map);
                
                // Если клетка была стеной
                if (_old_map[xx][yy] === SOLID) {
                    _new_map[xx][yy] = _count < _destroy_limit ? EMPTY : SOLID;
                } 
                // Если клетка была пустой
                else {
                    _new_map[xx][yy] = _count > _create_limit ? SOLID : EMPTY;
                }
            }
        }
        return _new_map;
    }

    // =========================================
    // Основной процесс генерации
    // =========================================
    
    // 1. Создаем пустую карту
    let _ca_map = CreateMap();
    
    // 2. Рандомизируем начальное состояние
    _ca_map = RandomiseMap(_ca_map, _spawn_chance);
    
    // 3. Применяем клеточный автомат N раз
    for (let i = 0; i < _iterations; i++) {
        _ca_map = Iterations(_ca_map, _create_limit, _destroy_limit);
    }
    // 4. Используем d3
    // Преобразуем карту в массив для d3
    const values = [];
    for (let y = 0; y < map_height; y++) {
        for (let x = 0; x < map_width; x++) {
            values.push(_ca_map[x][y]); // 0 или 1
        }
    }

    // Генерируем контур
    const contour = d3.contours()
        .size([map_width, map_height])
        (values);

    console.log(contour); // Массив контурных линий
    return _ca_map;
}

// =============================================
// Функция отрисовки карты в консоли
// =============================================
function DrawMap(_map) {
    for (let xx = 0; xx < map_width; xx++) {
        let row = '';
        for (let yy = 0; yy < map_height; yy++) {
            row += _map[xx][yy] === SOLID ? '■' : ' ';
        }
        console.log(row);
    }
}

// =============================================
// Запуск генерации и отрисовка результата
// =============================================
const cell_map = RunCellularAutomata(10, 150, 65, 5, 5, 5);
DrawMap(cell_map);

export { Gen };