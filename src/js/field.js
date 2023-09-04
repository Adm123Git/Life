import React from 'react';
import {CellState, GamePhase} from './common/appValues';

class Cell extends React.Component {

    constructor(props) {
        super(props);
        this.game = props.game;
        this.position = props.position;
    }

    onCellClick = () => {
        if (this.game.getPhase() === GamePhase.STARTED) {
            this.game.changeCellState(this.position);
        }
    }

    render() {
        let backgroundClass = this.game.state.currentGeneration[this.position.x][this.position.y] === CellState.LIVE
            ? 'cell-live'
            : 'cell-dead';
        let className = 'cell ' + backgroundClass;
        return (<button className={className}
                        onClick={this.onCellClick}/>);
    }

}

export class Field extends React.Component {

    constructor(props) {
        super(props);
        this.game = props.game;
    }

    renderCell(positionX, positionY) {
        let position = {
            x: positionX,
            y: positionY
        };
        return <Cell position={position}
                     game={this.game}
                     key={'cell' + positionX + positionY}/>;
    }

    renderLine(colCount, lineNumber) {
        let line = [];
        for (let i = 0; i < colCount; i++) {
            line.push(this.renderCell(i, lineNumber));
        }
        return line;
    }

    render() {
        let field = [];
        for (let i = 0; i < this.game.getFieldSize(); i++) {
            field.push(<div className='field-side-line'
                            key={'line' + i}>{this.renderLine(this.game.getFieldSize(), i)}</div>);
        }
        return (<div id='field'>{field}</div>);
    }

}