import { X } from "lucide-react";
import { Badge } from "./ui/badge";
import { RecipeFilters } from "./Sidebar";

interface FilterChipsProps {
  filters: RecipeFilters;
  onRemoveFilter: (filterKey: keyof RecipeFilters) => void;
}

export function FilterChips({ filters, onRemoveFilter }: FilterChipsProps) {
  const activeFilters: { key: keyof RecipeFilters; label: string; icon: string }[] = [];

  if (filters.dietType !== "alle") {
    activeFilters.push({
      key: "dietType",
      label: filters.dietType === "vegan" ? "Vegan" : "Vegetarisch",
      icon: filters.dietType === "vegan" ? "🌱" : "🥬"
    });
  }

  if (filters.difficulty > 0) {
    activeFilters.push({
      key: "difficulty",
      label: `${filters.difficulty} ${filters.difficulty === 1 ? "Stern" : "Sterne"}`,
      icon: "⭐"
    });
  }

  if (filters.workTime[0] !== 0 || filters.workTime[1] !== 120) {
    activeFilters.push({
      key: "workTime",
      label: `${filters.workTime[0]}-${filters.workTime[1]} Min Arbeit`,
      icon: "⏱️"
    });
  }

  if (filters.totalTime[0] !== 0 || filters.totalTime[1] !== 240) {
    activeFilters.push({
      key: "totalTime",
      label: `${filters.totalTime[0]}-${filters.totalTime[1]} Min Gesamt`,
      icon: "⏰"
    });
  }

  if (filters.allergies.length > 0) {
    activeFilters.push({
      key: "allergies",
      label: `${filters.allergies.length} ${filters.allergies.length === 1 ? "Allergie" : "Allergien"}`,
      icon: "⚠️"
    });
  }

  if (filters.ingredients && filters.ingredients.trim()) {
    activeFilters.push({
      key: "ingredients",
      label: "Zutaten-Filter",
      icon: "🥕"
    });
  }

  if (filters.servings > 0) {
    activeFilters.push({
      key: "servings",
      label: `${filters.servings} ${filters.servings === 1 ? "Person" : "Personen"}`,
      icon: "👥"
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 animate-fade-in">
      {activeFilters.map((filter) => (
        <Badge
          key={filter.key}
          variant="secondary"
          className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 pl-2 pr-1 py-1 gap-1.5"
        >
          <span className="text-sm">{filter.icon}</span>
          <span className="text-xs">{filter.label}</span>
          <button
            onClick={() => onRemoveFilter(filter.key)}
            className="ml-1 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
