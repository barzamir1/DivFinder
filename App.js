import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableHighlight, Image, TextInput,KeyboardAvoidingView,ScrollView } from 'react-native';
import CountDown from 'react-native-countdown-component';

import Game from './gameLogic'
import ModalSettings from './settings'
import ModalRecord from './recordsDB'
export default class GamePage extends Component {

    state = {empty: true};
    recObj = null;

    render() {
        return (
            <KeyboardAvoidingView keyboardVerticalOffset={-500} behavior="padding">
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.instruction}>Find all divisors!</Text>
                        {this.renderMenuIcons()}
                        {(this.state.empty || this.state.isGameOver) ? this.renderGameOver() : this.renderGame()}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
    /*render new game, settings and records icons*/
    renderMenuIcons() {
        return (
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{paddingRight: 10}}>
                    <TouchableHighlight onPress={() => {
                        if (this.state.empty) {
                            this.setState(
                                this.startNewGame(0, 30)); //default level and time
                        }
                        else
                            this.setState(this.startNewGame(this.state.maxLevel, this.state.timePerRound));
                    }}>
                        <Image source={require('./menuIcons/reload.png')}/>
                    </TouchableHighlight>
                </View>
                <View style={{paddingRight: 10}}>
                    <ModalSettings onSave={this.changeSettingHandler}/>
                </View>
                <View style={{flex: 1}}>
                    <ModalRecord onRef={ref => (this.recordRef = ref)}/>
                </View>
            </View>
        );
    }
    /*render the current number, the points and the board*/
    renderGame(){
        let game = this.state.game;
        let touchableStyle = Object.assign({}, styles.button); //copy style
        //set a random background color every new round
        touchableStyle.backgroundColor = (this.state.currBackground == '0') ? (this.getRandomColor()) : this.state.currBackground;
        this.state.currBackground = touchableStyle.backgroundColor;

        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', marginBottom: 0,}}>
                    <View style={{flex: 1, marginTop: 5}}>
                        <Text style={styles.points}>Points: {game.points}</Text>
                    </View>
                    <View style={{flex: 1, marginTop: 5}}>
                        <Text style={styles.points}>Round: {this.state.currRound}</Text>
                    </View>
                    <View style={{flex: 1, alignItems: 'flex-end'}}>
                        <CountDown
                            key = {game.num}
                            until={this.state.timePerRound}
                            size={15}
                            timeToShow = {['S']}
                            onFinish={() => {
                                let currState = this.state;
                                currState.timeUp = true;
                                this.setState(currState);
                            }}
                        />
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
    /*render game over message and possibly the save record form*/
    renderGameOver() {
        if(this.state.empty)
            return;
        if(this.state.timeUp || this.state.isGameOver) { //user either lost (time's up) or won (no more numbers)
            let congrats = this.state.isGameOver ? ', all done!' : '';
            return (
                <View style={styles.container}>
                    <Text style={styles.points}>Game Over {congrats}</Text>
                    <Text style={styles.text}> save record</Text>
                    {this.renderSaveRecordForm()}
                </View>
            );
        }
        else //game hasn't started yet
            return <Text style={styles.text}> press 'start new game'</Text>
    }
    /*render the save record form*/
    renderSaveRecordForm() {
        let text = '';
        return (
            <View style={{flexDirection: 'row', marginTop: 20}}>
                <View style={{flex:1, paddingRight: 10}}>
                    <TextInput style={{borderColor: 'black', borderWidth: 1,height:40}}
                               underlineColorAndroid="transparent"
                               placeholder="enter name"
                               autoCapitalize="none"
                               onChangeText={(value) => {
                                   text = value;
                               }}/>
                </View>
                <View>
                    <TouchableHighlight style={{alignItems: 'flex-start', backgroundColor: 'green', height:40 }}
                        onPress={() => {
                            ModalRecord.addRecord(text, this.state.game);
                            this.recordRef.setTableNotLoaded(); //table will load when record modal is visible
                            this.setState(this.startNewGame(this.state.maxLevel, this.state.timePerRound));
                        }}>
                        <Text style={{fontSize: 20, color:'white', paddingTop: 5}}> Save </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
    /*render 3 rows of divisors buttons, 7 buttons in each row*/
    renderButtonsRows() {
        const buttonsRow = [[], [], []];
        let start = 0;
        let game = this.state.game;
        let numOfButtonsInRow = game.maxButtons/3;
        for (let j = 0; j < 3; j++) {
            for (let i = start; i < start + numOfButtonsInRow; i++) {
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
            start += numOfButtonsInRow;
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
                <View style={{flexDirection: 'row', marginBottom: 5}}>
                    <Text style={{fontSize:15}}>find {game.divSet.size} more</Text>
                </View>
            </View>
        )
    }
    /*when a gameboard button is pressed*/
    selectedDivHandler = div => {
        let newState = this.state;
        let game = this.state.game;
        let isRoundOver = game.handleSelectedDiv(div);
        if(isRoundOver){
            //accelerate game difficulty every 5 rounds
            if(newState.currRound % 5 == 0)
                if(newState.currLevel < newState.maxLevel) {
                    newState.currLevel++;
                    game.level = newState.currLevel;
                    game.points += 50; //level bonus
                }

            let isGameOver = game.startRound();
            if(isGameOver) //no more numbers
               newState.isGameOver = true;
            else {
                newState.currRound++;
                newState.selectedDiv = 0;
                newState.currBackground = '0' //0 = new background color
            }
        }
        else
            newState.selectedDiv = div;
        this.setState(newState);
    };

    getRandomColor(){
        let possibleColors = ['#008900', '#0000ff', '#bf00ff', '#98044E', '#33C623', '#dc7e0d', '#00bfff', '#FF5E00'];
        return possibleColors[this.state.currRound % possibleColors.length];
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

    /*called when settings are changed. starts new game*/
    changeSettingHandler = (level, timePerRound) => {
        this.setState(this.startNewGame(level, timePerRound));
    };

    startNewGame(maxLevel, timePerRound) {
        return {
            empty: false,
            currRound: 1,
            currBackground: '0',
            timePerRound: timePerRound,
            maxLevel: maxLevel,
            currLevel: 0,
            game: new Game(0),
            selectedDiv: 0,
            timeUp: false,
            isGameOver: false,
            recObj: this.state.recObj
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
        fontSize: 30,
        color: 'black'
    },
    mainNumber: {
        fontSize: 70,
        textAlign: 'center',
        marginBottom: 0,
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
    }
});
