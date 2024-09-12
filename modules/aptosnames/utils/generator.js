let randomWords;

async function initialize() {
    const module = await import('random-words');
    randomWords = module.generate;
}


const generateRandomNumber = function() {
    return Math.floor(Math.random() * 10000).toString();
};

const addStart = function(word) {
    return generateRandomNumber() + word;
};

const addMiddle = function(word) {
    const position = Math.floor(word.length / 2);
    return word.slice(0, position) + generateRandomNumber() + word.slice(position);
};

const addRandomMiddle = function(word) {
    const position = Math.floor(Math.random() * (word.length - 1)) + 1;
    return word.slice(0, position) + generateRandomNumber() + word.slice(position);
};

const addEnd = function(word) {
    return word + generateRandomNumber();
};

const positions = [
    ['start', addStart],
    ['middle', addMiddle],
    ['end', addEnd],
    ['start-middle', function(word) { return addMiddle(addStart(word)); }],
    ['start-end', function(word) { return addEnd(addStart(word)); }],
    ['middle-end', function(word) { return addEnd(addMiddle(word)); }],
    ['only-start', addStart],
    ['only-middle', addRandomMiddle],
    ['only-end', addEnd]
];

const addRandomNumberToWord = function(word) {
    const shouldAddNumber = Math.random() < 0.5;
    if (!shouldAddNumber) {
        return word;
    }

    const randomPosition = positions[Math.floor(Math.random() * positions.length)][1];
    return randomPosition(word);
};

exports.initialize = initialize;
exports.domainGenerator = function() {
    const randomWord = randomWords();
    return addRandomNumberToWord(randomWord);
};
