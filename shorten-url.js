const letters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

const rng = () =>  {
  return Math.floor(Math.random() * (26 - 0) + 0);
}

const shortenURL = (link) => {
  let body = link.split('').map((iteratee, i) => {
    if (i % 2 === 0) {
      iteratee = generateRandomNumber();
      return iteratee;
    } else {
      iteratee = generateRandomLetter();
      return iteratee;
    }

  }).slice(1, 7).join('');
  return `http://${body}.io`

}

const generateRandomLetter = () => {
  const number = rng();
  return letters[number];
}

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 100);
}

module.exports = shortenURL;
