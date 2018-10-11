import React from 'react';
import Random from './random'

const maxNumber = [50, 100, 500];

export default class Game{
    constructor(level) {
        this.maxButtons = 18;
        this.points = 0;
        this.level = level;
        this.divSet = new Set();
        this.prevNumSet = new Set();
        this.num = Random.randomInt(this.maxButtons+1, maxNumber[this.level]);
        this.startRound();
    }

    startRound(){
        if(this.prevNumSet.size == (maxNumber[this.level] - this.maxButtons)) {
            return true; //game is over - no more numbers.
        }
        while(this.prevNumSet.has(this.num))
            this.num = Random.randomInt(this.maxButtons+1, maxNumber[this.level]);
        this.divSet.clear();
        this.findAllDivisors(this.num);

        for(let item in this.divSet){
            if(this.divSet.size > this.maxButtons)
                this.divSet.delete(item);
        }
        this.numbersToDisplay = Random.paddWithRandoms(this.num, Array.from(this.divSet), this.maxButtons); //array of divisors and non-divisors

        this.numbersDict = {}; //maps divisor to a dictionary div:{enabled, badlySelected}
        for(let i=0; i<this.numbersToDisplay.length; i++){
            let currDiv = this.numbersToDisplay[i];
            this.numbersDict[currDiv] = {disabled: false, badlySelected: false};
        }
        return false; //game isn't over
    }

    //sets this.divSet
    findAllDivisors(num){
        let i;
        for(i=2; i <= Math.ceil(Math.sqrt(num)); i++){
            if(num%i == 0){
                this.divSet.add(i);
                this.divSet.add(num/i);
            }
        }
        this.divSet.add(num);  // num | num
    }

    handleSelectedDiv(selectedNum){
        this.numbersDict[selectedNum].disabled = true;
        if(this.num%selectedNum == 0){
            this.points++;
            this.divSet.delete(selectedNum);
            if(this.divSet.size == 0) { //found all divisors on the board
                this.prevNumSet.add(this.num);
                return true; //current round is over
            }
        }
        else {
            this.points--;
            this.numbersDict[selectedNum].badlySelected = true;
        }
        return false; //current round isn't over
    }

    getAvailableLevelsArray() {
        return [
            {label: 'easy  ', value: 0},
            {label: 'hard  ', value: 1},
            {label: 'extreme  ', value: 2}
        ];
    }

    toString() {
        return (
            'num: ' + this.num.toString() + ' divList: ' + this.divSet.toString() +
            'numbers to display: ' + this.numbersToDisplay.toString() + ' #divisors: ' +
            this.divSet.size.toString()
        );
    }
}
