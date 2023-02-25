const calcXY = (idx: number) => {
  let x = idx % 10 === 0 ? 10 : idx % 10;
  let y = Math.ceil(idx / 10);
  return { x, y };
};

export default calcXY;
