import React, {Component} from 'react';
import {Button, StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import CountdownCircle from 'react-native-countdown-circle'
import Game from './gameLogic'


type Props = {};
export default class GamePage extends Component {

    state = undefined;//this.startNewGame();


    render() {
        if (this.state == undefined)
            return (
                <View style={styles.container}>
                    <Text style={styles.instruction}>Find all divisors!</Text>
                    {this.renderGameOver()}
                </View>
            );
        return (
            <View style={styles.container}>
                <Text style={styles.instruction}>Find all divisors!</Text>
                {this.renderGame()}
            </View>
        );
    }
    renderGame(){
        let game = this.state.game;
        let touchableStyle = Object.assign({}, styles.button); //copy style
        //set a random background color every new round
        touchableStyle.backgroundColor = (this.state.currBackground == '0') ? (this.getRandomColor()) : this.state.currBackground;
        this.state.currBackground = touchableStyle.backgroundColor;

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', marginBottom: 10, marginTop: 20}}>
                    <View style={{flex: 1, marginTop: 20}}>
                        <Text style={styles.points}>Points: {game.points}</Text>
                    </View>
                    <View style={{flex: 1, marginTop: 20}}>
                        <Text style={styles.points}>Round: {this.state.currRound}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <CountdownCircle seconds={30} radius={30} borderWidth={8}
                                         color="#ff003f" bgColor="#fff" textStyle={{fontSize: 20}}
                                         key = {game.num}
                                         onTimeElapsed={() => {
                                             let currState = this.state;
                                             currState.timeUp=true;
                                             this.setState(currState);
                                         }}/>
                    </View>
                </View>

                <Text style={styles.mainNumber}>{game.num}</Text>

                {/*render buttons or game over message*/}
                {this.state.timeUp ? this.renderGameOver() : this.renderButtonsRows()}

                {/*for debug purposes
             <Text style={styles.instructions}>{game.num}</Text>
            <Text style={styles.instructions}> divArray: {game.divArray.toString()} </Text>
            <Text style={styles.instructions}> # div: {game.numOfDivsOnDisplay} </Text>
            <Text style={styles.instructions}> divisors: {game.numbersToDisplay.toString()} </Text>*/}
            </View>
        );
    }
    renderGameOver() {
        return (
            <View style={styles.container}>
                <Text style={styles.points}>Game Over</Text>
                <Button style={styles.button} title={'New Game'} onPress={() => {
                    this.setState(this.startNewGame())
                }}/>
            </View>
        );
    }

    /*render 3 rows of divisors buttons, 7 buttons in each row*/
    renderButtonsRows() {
        const buttonsRow = [[], [], []];
        let start = 0;
        let game = this.state.game;
        for (let j = 0; j < 3; j++) {
            for (let i = start; i < start + 7; i++) {
                let currDiv = game.numbersToDisplay[i];
                buttonsRow[j].push(
                    <View style={{flex: 1, marginRight: 5}}>
                        <TouchableHighlight
                            onPress={() => this.selectedDivHandler(currDiv)}
                            disabled = {game.numbersDict[currDiv].disabled}
                            style = {this.getButtonStyle(currDiv)}>
                            <Text style = {{color: 'white'}}>{currDiv.toString()}</Text>
                        </TouchableHighlight>
                    </View>
                )
            }
            start += 7;
        }
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                    {buttonsRow[0]}
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                    {buttonsRow[1]}
                </View>
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                    {buttonsRow[2]}
                </View>
            </View>
        )
    }

    selectedDivHandler = div => {
        let newState = this.state;
        let game = this.state.game;
        let isRoundOver = game.handleSelectedDiv(div);
        if(isRoundOver){
            game.startRound();
            newState.currRound++;
            newState.selectedDiv = 0;
            newState.currBackground = '0' //0 = new background color
        }
        else
            newState.selectedDiv = div;
        this.setState(newState);
    };

    getRandomColor(){
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    getButtonStyle(divisor){
        let style = Object.assign({},styles.button); //copy style
        let game = this.state.game;
        if(game.numbersDict[divisor].badlySelected)
            style.backgroundColor = 'red';
        else{
            if(game.numbersDict[divisor].disabled)
                style.backgroundColor = 'gray';
            else
                style.backgroundColor = this.state.currBackground;
        }
        return style;
    }

    startNewGame() {
        return {
            currRound: 0,
            currBackground: '0',
            game: new Game(100),
            selectedDiv: 0,
            timeUp: false
        };
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        marginTop: 20,
        alignItems: 'center',
    },
    instruction: {
        fontSize: 30
    },
    mainNumber: {
        fontSize: 70,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 10
    },
    points:{
        fontSize: 20,
        textAlign: 'left',
        marginBottom: 10,
    },
    information:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        // marginTop: 'auto',
        // marginBottom: 20,
        // marginRight: 'auto',
        // marginLeft: 'auto'
    }
});
