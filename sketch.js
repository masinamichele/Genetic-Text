/**
 * Author: Michele Masina 2016
 * Description: Generates populations of random strings and mate them to reach a target.
 */

// Algorithm customization
var target = "red unicorn"; // The target sentence
var maxPop = 300; // How many elements should each generation have
var mutationRate = 0.01; // Percentage of the mutation rate [0-1]
var maxCycles = 1000; // Maximum number of generations (to avoid infinite loops)

// Which charset to be used. From hardest to easiest
// var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnoprstuvxwyz";
var charset = "abcdefghijklmnoprstuvxwyz ";
// var charset = target;

var targetArray = [];
var fittest = 0;
var fittestStr;
var generation = 0;

// These are the selectors for the DOM elements
var p_target;
var p_generation;
var p_population;
var p_mutation;
var p_targetfit;
var p_average;
var p_bestfit;
var p_fittest;
var p_caption;
var p_generated;

function setup() {
    noCanvas();
    selectElements();
    targetToArray();
    generateRandomPopulation();
}

function draw() {
    generation++;
    updateValues();
    generateMatingPool();
    for (var i = 0; i < population.length; i++) {
        pickParents();
    }
    renewPopulation();

    if (fittestStr === target || generation == maxCycles) {
        noLoop();
        console.log("END");
    }
}

function selectElements() {
    p_target = select('#target');
    p_generation = select('#generation');
    p_population = select('#population');
    p_mutation = select('#mutation');
    p_targetfit = select('#targetfit');
    p_average = select('#average');
    p_bestfit = select('#bestfit');
    p_fittest = select('#fittest');
    p_caption = select('#caption');
    p_generated = select('#generated');
}

function updateValues() {
    p_target.html(target);
    p_generation.html(generation);
    p_population.html(maxPop);
    p_mutation.html(mutationRate * 100);
    p_targetfit.html(target.length);
    p_average.html(averageFitness());
    p_caption.html(generateCaption());
}

function generateString(len = target.length) {
    // This f. generates an array of characters
    var text = [];
    for (var i = 0; i < len; i++) {
        text.push(charset.substr(floor(random(0, charset.length)), 1));
    }
    return text;
}

function generateChar() {
    // This f. generates a single character (NOT an array!)
    var char = charset.substr(floor(random(0, charset.length)), 1);
    return char;
}

function targetToArray() {
    // This f. converts the target string to an array because
    // it seems it's the only way I can manage to handle it...
    var char;
    for (var i = 0; i < target.length; i++) {
        char = target.substr(i, 1);
        targetArray.push(char);
    }
}

function generateCaption() {
    var caption = 'Gen# | Best ';
    var subline = '-----|------';
    if (target.length > 3) {
        for (var i = 0; i < target.length - 4; i++) {
            caption += '&nbsp;';
            subline += '-';
        }
    }
    caption += '| Fitness<br />';
    subline += '|--------';
    caption += subline;
    return caption;
}

function averageFitness() {
    if (allFitness) {
        var sum = allFitness.reduce(function(total, sum) {
            return total + sum;
        });
        var avg = sum / allFitness.length;
        avg = map(avg, 0, target.length, 0, 100);
        return round(avg * 100) / 100;
    } else {
        return 0;
    }
}
