export function indexToCoord(pixelIndex, width, height) {
  const yCoord = Math.floor(pixelIndex / (width * 4));
  const xCoord = (pixelIndex - yCoord * (width * 4)) / 4;

  return { x: xCoord, y: yCoord };
}
