import React from 'react';
import {Field} from './field.js';
import {Drive} from './drive.js';
import {Statistic} from './statistic.js';
import {Objects} from './common/objects';
import {CellState, FieldSize, GamePhase, GenerationTTL, TextData} from './common/appValues';

export class Game extends React.Component {

    #lifeTick;

    constructor(props) {
        super(props);
        this.state = this.#getStartState(FieldSize.DEFAULT, GenerationTTL.DEFAULT);
    }

    setPhase = newPhase => {
        let newPhaseIsCorrect = false;
        for (let key in GamePhase) {
            if (GamePhase[key] === newPhase) {
                newPhaseIsCorrect = true;
                break;
            }
        }
        if (!newPhaseIsCorrect) {
            console.error('Ошибка параметра newPhase');
            return;
        }
        this.setState(Objects.replaceAndGet(this.state, 'phase', newPhase));
        console.log('новая фаза = ' + this.state.phase);
        if (this.state.phase === GamePhase.STARTED) {
            clearInterval(this.#lifeTick);
            this.setState(Objects.replaceAndGet(this.state, 'gameStatistic', this.#getClearedStatistic()));
            this.setState(Objects.replaceAndGet(this.state, 'currentGeneration', this.#getPureGeneration()));
            return;
        }
        if (this.state.phase === GamePhase.PLAY) {
            this.#startLife();
            return;
        }
        if (this.state.phase === GamePhase.PAUSED) {
            clearInterval(this.#lifeTick);
        }
    };

    getPhase = () => {
        return this.state.phase;
    };

    setFieldSize = fieldSize => {
        clearInterval(this.#lifeTick);
        this.setState(this.#getStartState(fieldSize, this.state.generationTTL));
    };

    setGenerationTTL = generationTTL => {
        clearInterval(this.#lifeTick);
        this.setState(this.#getStartState(this.state.fieldSize, generationTTL));
    };

    getFieldSize = () => {
        return this.state.fieldSize;
    };

    getGenerationTTL = () => {
        return this.state.generationTTL;
    };

    getGenerationCount = () => {
        return this.state.gameStatistic.generationCount;
    };

    getStopReason = () => {
        return this.state.gameStatistic.stopReason;
    };

    changeCellState = cellPosition => {
        let newGenerationState = this.state.currentGeneration;
        newGenerationState[cellPosition.x][cellPosition.y] = newGenerationState[cellPosition.x][cellPosition.y] === CellState.DEAD ? CellState.LIVE : CellState.DEAD;
        this.setState(Objects.replaceAndGet(this.state, 'currentGeneration', newGenerationState));
    };

    generateFirstGeneration = () => {
        this.setState(Objects.replaceAndGet(this.state, 'currentGeneration', this.#getRandomGeneration()));
    };

    hasLiveCells = () => {
        for (let i = 0; i < this.state.fieldSize; i++) {
            let liveCellsInLine = this.state.currentGeneration[i]
                .filter(cell => cell === CellState.LIVE)
                .length;
            if (liveCellsInLine > 0) {
                return true;
            }
        }
        return false;
    };

    #getClearedStatistic = () => {
        return {
            generationCount: 0,
            generationHash: 0,
            parentGenerationHash: 0,
            preParentGenerationHash: 0,
            stopReason: undefined
        };
    };

    #getStartState = (fieldSize, generationTTL) => {
        return {
            phase: GamePhase.STARTED,
            fieldSize: fieldSize,
            generationTTL: generationTTL,
            gameStatistic: this.#getClearedStatistic(),
            currentGeneration: this.#getNewGeneration(true, fieldSize)
        };
    };

    #getNewGeneration = (isPureGeneration, fieldSize) => {
        let generation = [];
        for (let i = 0; i < fieldSize; i++) {
            let cellLine = [];
            for (let j = 0; j < fieldSize; j++) {
                cellLine[j] = isPureGeneration ? CellState.DEAD : CellState.getRandom();
            }
            generation[i] = cellLine;
        }
        return generation;
    };

    #getPureGeneration = () => {
        return this.#getNewGeneration(true, this.getFieldSize());
    };

    #getRandomGeneration = () => {
        return this.#getNewGeneration(false, this.getFieldSize());
    };

    #startLife = () => {
        this.#lifeTick = setInterval(this.#nextGeneration, this.state.generationTTL);
    };

    #nextGeneration = () => {
        let newGeneration = this.#calculateNewGeneration();
        this.setState(Objects.replaceAndGet(this.state, 'currentGeneration', newGeneration));
        this.setState(Objects.replaceAndGet(this.state, 'gameStatistic', this.#calculateGameStatistic(newGeneration)));
    };

    #calculateNewGeneration = () => {
        let newGeneration = this.#getPureGeneration();
        for (let i = 0; i < this.state.fieldSize; i++) {
            for (let j = 0; j < this.state.fieldSize; j++) {
                let liveNeighboursCount = this.#getCellNeighbours(i, j)
                    .filter(position => this.state.currentGeneration[position.x][position.y] === CellState.LIVE)
                    .length;
                if (liveNeighboursCount === 3
                    || (this.state.currentGeneration[i][j] === CellState.LIVE && liveNeighboursCount === 2)) {
                    newGeneration[i][j] = CellState.LIVE;
                }
            }
        }
        return newGeneration;
    };

    #calculateGameStatistic = generationState => {
        let gameStatistic = this.state.gameStatistic;
        let generationAsString = '';
        for (let i = 0; i < this.state.fieldSize; i++) {
            for (let j = 0; j < this.state.fieldSize; j++) {
                generationAsString = generationAsString + i + j + generationState[i][j];
            }
        }
        gameStatistic.preParentGenerationHash = gameStatistic.parentGenerationHash;
        gameStatistic.parentGenerationHash = gameStatistic.generationHash;
        gameStatistic.generationHash = generationAsString.hashCode();
        if (gameStatistic.parentGenerationHash === gameStatistic.generationHash) {
            gameStatistic = Objects.replaceAndGet(gameStatistic, 'stopReason', this.hasLiveCells() ? TextData.STAT_DEADLOCK_STOP : TextData.ALL_DEAD_STOP);
            clearInterval(this.#lifeTick);
        } else if (gameStatistic.preParentGenerationHash === gameStatistic.generationHash) {
            gameStatistic = Objects.replaceAndGet(gameStatistic, 'stopReason', TextData.STAT_CYCLE_STOP);
        } else {
            gameStatistic = Objects.replaceAndGet(gameStatistic, 'generationCount', gameStatistic.generationCount + 1);
        }
        return gameStatistic;
    };

    #getCellNeighbours = (x, y) => {
        let left = x <= 0 ? this.state.fieldSize - 1 : x - 1;
        let right = x >= this.state.fieldSize - 1 ? 0 : x + 1;
        let top = y <= 0 ? this.state.fieldSize - 1 : y - 1;
        let bottom = y >= this.state.fieldSize - 1 ? 0 : y + 1;
        let cellNeighbours = [];
        cellNeighbours.push({x: left, y: top});
        cellNeighbours.push({x: x, y: top});
        cellNeighbours.push({x: right, y: top});
        cellNeighbours.push({x: left, y: y});
        cellNeighbours.push({x: right, y: y});
        cellNeighbours.push({x: left, y: bottom});
        cellNeighbours.push({x: x, y: bottom});
        cellNeighbours.push({x: right, y: bottom});
        return cellNeighbours;
    };

    render() {
        return (
            <div id='game'>
                <div className='game-line'>
                    <Field game={this} key='gameField'/>
                    <Drive game={this} key='gameDrive'/>
                </div>
                <div className='game-line'>
                    <Statistic game={this} key='gameStatistic'/>
                </div>
                <div className='game-line' dangerouslySetInnerHTML={{__html: TextData.GAME_RIGHTS}}></div>
            </div>
        );
    };

}