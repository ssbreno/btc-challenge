export const generateRandomNumber = () => {
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
  };