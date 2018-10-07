export default class Random {
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* receives an array of numbers and returns a random permutation */
    static shuffle(array) {
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    static shuffleArrays(array1, array2) {
        return Random.shuffle(array1.concat(array2));
    }

    /* receives a number, an array of its divisor and the number of non-divisors to add.
    returns a shuffled array of size len(dicArray) + len(paddLen)
     */
    static paddWithRandoms(num, divArray, finaleLength) {
        let i, nonDivisor;
        let numsToDisplay = Random.insertPrimes(divArray);
        let arr = [];
        for (i = 0; i < finaleLength-numsToDisplay.length; i++) {
            nonDivisor = Random.randomInt(2, num);
            while (numsToDisplay.includes(nonDivisor) || arr.includes(nonDivisor))
                nonDivisor = Random.randomInt(2, num);
            arr.push(nonDivisor);
        }
        return Random.shuffle(numsToDisplay.concat(arr));
    }

    /* receives array of numbers and inserts small primes if needed. */
    static insertPrimes(array){
        let i;
        let primes = [2,3,5,7,11], newArray=[];
        for(i=0; i<primes.length; i++){
            if(!(array.includes(primes[i])))
                newArray.push(primes[i]);
        }
        return newArray.concat(array);
    }
}