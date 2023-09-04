# Игра "Жизнь" на React.js

Место действия игры — размеченная на клетки безграничная плоскость.

Каждая клетка на этой поверхности имеет восемь соседей, окружающих её, и может находиться в двух состояниях: быть «живой» (заполненной) или «мёртвой» (пустой).

Распределение живых клеток в начале игры называется первым поколением.

Каждое следующее поколение рассчитывается на основе предыдущего по правилам:
- в пустой (мёртвой) клетке, с которой соседствуют три живые клетки, зарождается жизнь;
- если у живой клетки есть две или три живые соседки, то эта клетка продолжает жить;
- в противном случае (если живых соседей меньше двух или больше трёх) клетка умирает («от одиночества» или «от перенаселённости»).

# Запуск проекта

На машине должен быть установлен [Node.js](https://nodejs.org/ru), с менеджером пакетов [NPM](https://www.npmjs.com/).

Первым делом в папке проекта выполняем `npm install`

Затем можно выполнить `npm start` для запуска приложения на `localhost:3000`

Или можно выполнить `npm run build` для сборки проекта. Сборка произойдет в папку `build`.
Для запуска игры нужно просто открыть файл `index.html` из этой папки в браузере.