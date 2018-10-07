import React, {Component} from 'react';
import Random from './random'

const maxDivisorsToDisplay = 15; //the max number of divisor to display on the game board
const  numberOfGameButtons = 21;
export default class Game{
    constructor(level) {
        this.maxButtons = 21;
        this.points = 0;
//        if(level != 80 && level != 200 && level !=1000)
//            level = 80;
        this.level = level;
        this.prevNum = [];
        this.num = Random.randomInt(numberOfGameButtons, this.level);
        this.startRound();
    }

    startRound(){
        while(this.prevNum.includes(this.num))
            this.num = Random.randomInt(numberOfGameButtons, this.level);
        this.findAllDivisors(this.num);
        this.numOfDivsOnDisplay = (this.divArray.length <=maxDivisorsToDisplay) ? this.divArray.length : maxDivisorsToDisplay;
        let slicedDivisors = Random.shuffle(this.divArray.slice(0,this.numOfDivsOnDisplay)); //choose x random divisors, x<=maxDivisorsToDisplay
        this.numbersToDisplay = Random.paddWithRandoms(this.num, slicedDivisors, numberOfGameButtons); //array of divisors and non-divisors

        this.numbersDict = {}; //maps divisor to a dictionary div:{enabled, badlySelected}
        for(let i=0; i<this.numbersToDisplay.length; i++){
            let currDiv = this.numbersToDisplay[i];
            this.numbersDict[currDiv] = {disabled: false, badlySelected: false};
        }
    }

    //sets this.divArray
    findAllDivisors(num){
        let i;
        let lst = []
        for(i=2; i <= Math.ceil(Math.sqrt(num)); i++){
            if(num%i == 0){
                if(num/i == i)
                    lst = lst.concat([i]);
                else
                    lst = lst.concat([i, num/i]);
            }
        }
        this.divArray = lst.concat([num]); // num | num
    }

    handleSelectedDiv(selectedNum){
        this.numbersDict[selectedNum].disabled = true;
        if(this.num%selectedNum == 0){
            this.points++;
            this.numOfDivsOnDisplay--;
            if(this.numOfDivsOnDisplay == 0) { //found all divisors on the board
                this.prevNum.push(this.num);
                return true; //current round is over
            }
        }
        else {
            this.points--;
            this.numbersDict[selectedNum].badlySelected = true;
        }
        return false; //current round isn't over
    }
    toString() {
        return (
            'num: ' + this.num.toString() + ' divList: ' + this.divArray.toString() +
            'numbers to display: ' + this.numbersToDisplay.toString() + ' #divisors: ' +
            this.numOfDivsOnDisplay
        );
    }
}
