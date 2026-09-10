export type PriceTagProps = {
  usd?: number | null;
  uah?: number | null;
};

// Tabular figures keep digits aligned when prices differ in length across cards
export function PriceTag({ usd, uah }: PriceTagProps) {
  return (
    <div className="flex items-baseline gap-2 font-semibold text-accent tabular-nums">
      {usd && <span className="text-2xl">${usd.toLocaleString('en-US')}</span>}
      {uah && <span className="text-sm text-text-secondary">₴{uah.toLocaleString('uk-UA')}</span>}
    </div>
  );
}
