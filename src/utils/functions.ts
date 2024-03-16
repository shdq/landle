export const getNextUniqueRandomNumber = (prevNumber = 1) => {
  const getRandomNumber = () => Math.floor(Math.random() * 99) + 1;
  let newNumber = getRandomNumber();
  while (prevNumber === newNumber) {
    newNumber = getRandomNumber();
  }
  return newNumber;
};
