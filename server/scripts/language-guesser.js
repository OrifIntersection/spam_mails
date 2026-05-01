const { Language } = require('node-nlp');
const chalk = require('chalk');

function languageGuesser(texteComplet) {
    let guess = [];
    if (texteComplet) {
        const text = texteComplet.split('>')[4] || texteComplet;
        const languageDetector = new Language();

        // Réinitialiser les valeurs de base
        languageDetector.languages = [];
        languageDetector.languagesAlias = {};
        guess = languageDetector.guess(text);
    }
    return guess;
};

module.exports = languageGuesser;