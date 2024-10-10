export function calculateFieldSize(direction = "width") {
  const cellSize = 30;
  const freeSpacePercentage = 5;
  const screenResolution =
    direction === "height" ? window.innerHeight - 256 : window.innerWidth;
  const padding = direction === "height" ? 30 : 96;
  const freeSpace = screenResolution * (freeSpacePercentage / 100);
  const availableSpace = screenResolution - 2 * freeSpace - 2 * padding;
  const cellCount = Math.floor(availableSpace / cellSize);
  return cellCount;
}
