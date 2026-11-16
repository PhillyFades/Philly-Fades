export type ScheduleBlock = {
  startsOn: string;
  endsOn: string;
  kind: "blackout" | "available";
};

export function isDateOpen(iso: string, blocks: ScheduleBlock[]) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const closed = blocks.some((block) => block.kind === "blackout" && iso >= block.startsOn && iso <= block.endsOn);
  if (closed) return false;
  const openings = blocks.filter((block) => block.kind === "available");
  if (!openings.length) return true;
  return openings.some((block) => iso >= block.startsOn && iso <= block.endsOn);
}

export function describeBlocks(blocks: ScheduleBlock[]) {
  return blocks.map((block) => {
    const range = block.startsOn === block.endsOn ? block.startsOn : `${block.startsOn} to ${block.endsOn}`;
    return `${block.kind === "blackout" ? "Closed" : "Open"} ${range}`;
  });
}
