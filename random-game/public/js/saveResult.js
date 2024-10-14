export function saveResult(playerName, mineAmount) {
  const prefix = "belialbehemothbeelzebub";
  const timestamp = Date.now();
  const key = `${prefix}_${playerName}_${mineAmount}_${timestamp}`;
  const result = {
    playerName: playerName,
    mines: mineAmount,
    date: new Date().toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(result));
}
