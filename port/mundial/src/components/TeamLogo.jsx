export function TeamLogo({ team, size = "md" }) {
  const sizeClass =
    size === "sm" ? "h-5 w-5" : size === "lg" ? "h-8 w-8" : "h-6 w-6";

  if (team?.logo) {
    return (
      <img
        src={team.logo}
        alt={team.name}
        className={`${sizeClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-pitch-700 text-[10px] font-bold text-gray-300`}
    >
      {team?.abbreviation?.slice(0, 3) ?? "?"}
    </span>
  );
}
