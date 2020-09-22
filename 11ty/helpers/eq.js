module.exports = (left, right, {fn, inverse}) => left == right ? fn() : inverse();
