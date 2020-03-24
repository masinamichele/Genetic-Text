var population = [];
var newPopulation = [];
var matingPool = [];
var allFitness = [];

function Element(pA = -1, pB = -1) {
    // This constructor generates a single element of the population
    if (pA < 0) { // If no paramenters are specified, it generates a random element
        this.genes = generateString();
    } else { // If parents are specified, it generates a child
        this.genes = [];
        for (var i = 0; i < target.length; i++) {
            var mutation = random();
            if (mutation < mutationRate) {
                // It also generates a new gene if the mutation happens,
                // ignoring what that gene would have been
                this.genes.push(generateChar());
            } else {
                // If a parent have the same i-th gene as the target,
                // that is applied to the child.
                // If not, a new gene is generated
                if (matingPool[pA][i] == targetArray[i]) {
                    this.genes.push(matingPool[pA][i]);
                } else if (matingPool[pB][i] == targetArray[i]) {
                    this.genes.push(matingPool[pB][i]);
                } else {
                    this.genes.push(generateChar());
                }
            }
        }
    }

    this.calculateFitness = function() {
        // The fitness is evaluated based on how many genes
        // are correct and in the right position
        this.fitness = 0;
        for (var i = 0; i < this.genes.length; i++) {
            if (this.genes[i] == targetArray[i]) {
                this.fitness += 1;
            }
        }
        allFitness.push(this.fitness);
        return this.fitness;
    }

    this.fitness = this.calculateFitness();

    // If the new element is fitter or equal than the previous fittest,
    // update that and log that in the area below
    if (this.fitness >= fittest) {
        fittest = this.fitness;
        fittestStr = this.genes.join('');
        p_fittest.html(fittestStr);
        p_bestfit.html(round(map(this.fitness, 0, target.length, 0, 100) * 100) / 100);
        var tempText = p_generated.html();
        var newText = ('...' + generation).slice(-4) + ' | ' +
            fittestStr + ' | ' +
            fittest + '<br />' +
            tempText;
        p_generated.html(newText);
    }
}

function generateRandomPopulation() {
    for (var i = 0; i < maxPop; i++) {
        element = new Element();
        population.push(element);
    }
}

function generateMatingPool() {
    // This f. generates a mating pool array, putting every element of the population
    // at least one time. It appears more times the more fitness that element has
    for (var i = 0; i < maxPop; i++) {
        for (j = 0; j <= population[i].fitness; j++) {
            matingPool.push(population[i].genes);
        }
    }
}

function pickParents() {
    // Randomly pick two parents from the mating pool
    // and generate a new population using the childs
    var parentA = floor(random(0, matingPool.length));
    var parentB = floor(random(0, matingPool.length));

    // if (parentB == parentA) {
    //     pickParents();
    // }

    newPopulation.push(new Element(parentA, parentB));
}

function renewPopulation() {
    // Discards the "parents" population in favor of the "childs"
    for (var i = 0; i < maxPop; i++) {
        population[i] = newPopulation[i];
    }
}
