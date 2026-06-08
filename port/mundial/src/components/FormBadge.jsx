const styles = {
  W: "bg-green-500 text-white",
  D: "bg-yellow-400 text-pitch-950",
  L: "bg-red-500 text-white",
};

const labels = { W: "V", D: "E", L: "D" };

export function FormBadge({ result }) {
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-sm text-[10px] font-bold ${styles[result]}`}
    >
      {labels[result]}
    </span>
  );
}

export function FormRow({ form }) {
  const slots = Array.from({ length: 5 }, (_, i) => form[i] ?? null);
  return (
    <div className="flex gap-0.5">
      {slots.map((result, i) =>
        result ? (
          <FormBadge key={i} result={result} />
        ) : (
          <span
            key={i}
            className="inline-block h-5 w-5 rounded-sm bg-pitch-700/50"
          />
        ),
      )}
    </div>
  );
}
