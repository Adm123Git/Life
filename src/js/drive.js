import React from 'react';
import {GamePhase, FieldSize, TextData, GenerationTTL} from './common/appValues';
import {Objects} from './common/objects';

class DigitInput extends React.Component {

    constructor(props) {
        super(props);
        this.activeCondition = props.activeCondition;
        this.changeHandler = props.changeHandler;
        this.range = props.range;
        this.game = props.game;
        this.title = props.title;
        this.state = {
            value: props.value
        }
    }

    #handleChange = event => {
        if (this.activeCondition()) {
            if (!!this.range.max && event.target.value > this.range.max) {
                event.target.value = this.range.max;
            } else if (!!this.range.min && event.target.value < this.range.min) {
                event.target.value = this.range.min;
            }
            this.setState(Objects.replaceAndGet(this.state, 'value', event.target.value));
            this.changeHandler(event);
        }
    }

    render() {
        let enableClass = this.activeCondition()
            ? 'enabled'
            : 'disabled';
        return (
            <div className={'input-block ' + enableClass}>
                {this.title}
                <div className='input-container'>
                    <input className={'drive ' + enableClass}
                           onChange={this.#handleChange}
                           value={this.state.value}
                           type='number'
                           max={this.range.max}
                           min={this.range.min}/>
                </div>
            </div>
        );
    }

}

class Button extends React.Component {

    constructor(props) {
        super(props);
        this.clickHandler = props.clickHandler;
        this.activeCondition = props.activeCondition;
        this.game = props.game;
        this.state = {
            title: props.title
        }
    }

    setTitle = newTitle => {
        this.setState(Objects.replaceAndGet(this.state, 'title', newTitle));
    };

    #onButtonClick = () => {
        if (this.activeCondition()) {
            this.clickHandler(this);
        }
    };

    render() {
        let enableClass = this.activeCondition()
            ? 'enabled'
            : 'disabled';
        return (<button className={'drive ' + enableClass}
                        onClick={this.#onButtonClick}>{this.state.title}</button>);
    }

}

export class Drive extends React.Component {

    constructor(props) {
        super(props);
        this.game = props.game;
    }

    #fieldSizeChange = event => {
        this.game.setFieldSize(event.target.value);
    };

    #generationTTLChange = event => {
        this.game.setGenerationTTL(event.target.value);
    };

    #startBtnClick = button => {
        if (this.game.getPhase() === GamePhase.STARTED) {
            this.game.setPhase(GamePhase.PLAY);
            button.setTitle(TextData.TITLE_BTN_STOP);
        } else {
            button.setTitle(TextData.TITLE_BTN_START);
            this.game.setPhase(GamePhase.STARTED);
        }
    };

    #generationTTLInputActive = () => {
        return this.game.getPhase() === GamePhase.STARTED;
    };

    #fieldSizeInputActive = () => {
        return this.game.getPhase() === GamePhase.STARTED;
    };

    #startBtnActive = () => {
        return this.game.getPhase() === GamePhase.PLAY
            || this.game.getPhase() === GamePhase.PAUSED
            || (this.game.hasLiveCells() && this.game.getPhase() === GamePhase.STARTED);
    };

    #pauseBtnClick = button => {
        if (this.game.getPhase() === GamePhase.PLAY) {
            this.game.setPhase(GamePhase.PAUSED);
            button.setTitle(TextData.TITLE_BTN_GO);
        } else if (this.game.getPhase() === GamePhase.PAUSED) {
            this.game.setPhase(GamePhase.PLAY);
            button.setTitle(TextData.TITLE_BTN_PAUSE);
        }
    };

    #pauseBtnActive = () => {
        return this.game.getPhase() === GamePhase.PLAY
            || this.game.getPhase() === GamePhase.PAUSED;
    };

    #generateBtnClick = () => {
        this.game.generateFirstGeneration();
    };

    #generateBtnActive = () => {
        return this.game.getPhase() === GamePhase.STARTED;
    };

    render() {
        return (
            <div id='drive'>
                <DigitInput title={TextData.TITLE_GENERATION_TTL}
                            game={this.game}
                            range={{max: GenerationTTL.MAX, min: GenerationTTL.MIN}}
                            value={this.game.getGenerationTTL()}
                            activeCondition={this.#generationTTLInputActive}
                            changeHandler={this.#generationTTLChange}
                            key='GenerationTTLInput'/>
                <DigitInput title={TextData.TITLE_FIELD_SIZE}
                            game={this.game}
                            range={{max: FieldSize.MAX, min: FieldSize.MIN}}
                            activeCondition={this.#fieldSizeInputActive}
                            value={this.game.getFieldSize()}
                            changeHandler={this.#fieldSizeChange}
                            key='fieldSizeInput'/>
                <Button title={TextData.TITLE_BTN_START}
                        game={this.game}
                        activeCondition={this.#startBtnActive}
                        clickHandler={this.#startBtnClick}
                        key='buttonStart'/>
                <Button title={TextData.TITLE_BTN_PAUSE}
                        game={this.game}
                        activeCondition={this.#pauseBtnActive}
                        clickHandler={this.#pauseBtnClick}
                        key='buttonPause'/>
                <Button title={TextData.TITLE_BTN_GENERATE_GENERATION}
                        game={this.game}
                        activeCondition={this.#generateBtnActive}
                        clickHandler={this.#generateBtnClick}
                        key='buttonGenerate'/>
            </div>
        );
    }

}