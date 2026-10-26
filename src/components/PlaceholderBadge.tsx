import { listPlaceholders } from "@/config/site";

/** Development-only reminder of sample values that still need replacing. Renders nothing in production. */
export function PlaceholderBadge() {
  if (process.env.NODE_ENV !== "development") return null;
  const left = listPlaceholders();
  if (left.length === 0) return null;
  return (
    <details className="ph-badge">
      <summary className="mono">⚠ {left.length} placeholder</summary>
      <p>Thay các giá trị mẫu trong src/config/site.ts trước khi gửi link:</p>
      <ul className="mono">
        {left.map((key) => (
          <li key={key}>{key}</li>
        ))}
      </ul>
    </details>
  );
}
