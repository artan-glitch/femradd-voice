import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "femradd-bookmarks";

function readBookmarks(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useBookmark(slug: string) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(readBookmarks().includes(slug));
  }, [slug]);

  const toggle = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      const bookmarks = readBookmarks();
      const next = bookmarks.includes(slug)
        ? bookmarks.filter((s) => s !== slug)
        : [...bookmarks, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setSaved(next.includes(slug));
    },
    [slug]
  );

  return { saved, toggle };
}
