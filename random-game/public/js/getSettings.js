export function getSettings() {
  const key = "belialbehemothbeelzebub_gameSettings";
  const savedData = localStorage.getItem(key);

  if (savedData) {
    return JSON.parse(savedData);
  }
  return null;
}
