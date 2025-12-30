import { useMemo, useState } from "react";

export function useProgressiveDisclosure<T extends { id: string }>(
  items: T[]
) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const enriched = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        isActive: item.id === activeId,
        activate: () => setActiveId(item.id),
        deactivate: () => setActiveId(null),
      })),
    [items, activeId]
  );

  return { activeId, setActiveId, items: enriched };
}
