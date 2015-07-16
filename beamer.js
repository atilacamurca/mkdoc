/* Use the same Latex class, the only difference is the init param "beamer" */

var Latex = require('./latex.js').Latex;

module.exports = new Latex('beamer');
