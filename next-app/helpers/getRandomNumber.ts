const getRandomNumber = (lowerLimit: number, upperLimit: number) => {
  return Math.floor(Math.random() * (upperLimit - lowerLimit + 1)) + lowerLimit;
};

export default getRandomNumber;
