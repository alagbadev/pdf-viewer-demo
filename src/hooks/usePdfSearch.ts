import { useMemo, useState } from 'react';

export function usePdfSearch(
  pagesText: Record<number, string>,
  query: string
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const resultsByPage = useMemo(() => {
    if (!query) return {};
    const regex = new RegExp(query, 'gi');
    const res: Record<number, { start: number; end: number }[]> = {};
    Object.entries(pagesText).forEach(([pageStr, text]) => {
      const pageNum = Number(pageStr);
      const matches = [];
      let match;
      while ((match = regex.exec(text))) {
        matches.push({ start: match.index, end: regex.lastIndex });
      }
      if (matches.length) res[pageNum] = matches;
    });
    return res;
  }, [pagesText, query]);

  const flatResults = useMemo(
    () =>
      Object.entries(resultsByPage).flatMap(([pageStr, arr]) =>
        arr.map((m, i) => ({ page: Number(pageStr), ...m, index: i }))
      ),
    [resultsByPage]
  );

  const goNext = () =>
    setCurrentIndex((i) => Math.min(i + 1, flatResults.length - 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  return { resultsByPage, flatResults, currentIndex, goNext, goPrev };
}
