/**
 * QuestionnaireField Component
 *
 * Displays a single field with label and value formatting.
 * Handles different value types: strings, arrays, booleans, objects.
 */

interface QuestionnaireFieldProps {
  label: string;
  value: unknown;
  className?: string;
}

/**
 * Format a boolean value for display
 */
function BooleanValue({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
        value ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
      }`}
    >
      {value ? "כן" : "לא"}
    </span>
  );
}

/**
 * Format a list value for display
 */
function ListValue({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <span className="text-[#B2B2B2]">-</span>;
  }

  return (
    <ul className="list-disc list-inside space-y-1">
      {items.map((item, index) => (
        <li key={index} className="text-[#1D1D1B]">
          {item}
        </li>
      ))}
    </ul>
  );
}

/**
 * Format any value for display
 */
function formatValue(value: unknown): React.ReactNode {
  // Null/undefined
  if (value === null || value === undefined || value === "") {
    return <span className="text-[#B2B2B2]">-</span>;
  }

  // Boolean
  if (typeof value === "boolean") {
    return <BooleanValue value={value} />;
  }

  // Array of strings
  if (Array.isArray(value)) {
    const stringItems = value.filter((item): item is string => typeof item === "string");
    if (stringItems.length > 0) {
      return <ListValue items={stringItems} />;
    }
    // Array of objects or mixed - show as JSON
    return (
      <pre className="text-xs bg-[#F7F7F7] p-2 rounded overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // Object
  if (typeof value === "object") {
    return (
      <pre className="text-xs bg-[#F7F7F7] p-2 rounded overflow-x-auto">
        {JSON.stringify(value, null, 2)}
      </pre>
    );
  }

  // Number
  if (typeof value === "number") {
    return <span className="text-[#1D1D1B]">{value.toLocaleString("he-IL")}</span>;
  }

  // String
  return <span className="text-[#1D1D1B]">{String(value)}</span>;
}

export function QuestionnaireField({ label, value, className = "" }: QuestionnaireFieldProps) {
  return (
    <div className={`${className}`}>
      <dt className="text-sm text-[#706F6F] mb-1">{label}</dt>
      <dd className="text-sm">{formatValue(value)}</dd>
    </div>
  );
}

