import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  prefix?: string; // e.g. "$"
  icon: ReactNode; // Lucide or any icon component
}

export default function StatCard({
  label,
  value,
  prefix,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold text-gray-800">
            {prefix}
            {value}
          </h3>
        </div>
        <div className="text-gray-400">{icon}</div>
      </div>
    </div>
  );
}
