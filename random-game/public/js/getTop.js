export function getTop(limit = 10) {
  const results = [];
  const prefix = 'belialbehemothbeelzebub_game_result';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) {
      const result = JSON.parse(localStorage.getItem(key));
      console.log(result);
      results.push(result);
    }
  }

  results.sort((a, b) => {
    if (b.mines !== a.mines) {
      return b.mines - a.mines;
    }
    return new Date(a.date) - new Date(b.date);
  });

  return results.slice(0, limit);
}
