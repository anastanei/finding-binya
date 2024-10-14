export function saveSettings(rows, columns, mines, playerName) {
  const data = {
    rows,
    columns,
    mines,
    playerName,
    date: new Date().toISOString(),
  };

  const key = "belialbehemothbeelzebub_gameSettings";

  localStorage.setItem(key, JSON.stringify(data));
}
