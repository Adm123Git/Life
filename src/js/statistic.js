import React from 'react';
import {TextData} from './common/appValues';

export class Statistic extends React.Component {

    constructor(props) {
        super(props);
        this.game = props.game;
    }

    render() {
        let stopReason = this.game.getStopReason();
        return (
            <div style={{marginTop: '30px', marginBottom: '30px'}}>
                {TextData.STAT_GENERATION_COUNT}: {this.game.getGenerationCount()}{!!stopReason ? stopReason : ''}
            </div>
        );
    }

}