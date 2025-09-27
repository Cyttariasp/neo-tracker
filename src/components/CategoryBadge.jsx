import { memo } from "react";
import { Soup, Tag, Bus, Clapperboard, Bike, Car, ShoppingBag } from "lucide-react"; // ← Falta importar Tag

const CategoryBadge = ({ category, size = "sm", className = "" }) => { // ← Nombre debe empezar con mayúscula
  const Icons = {
    food: Soup,
    transport: Bus,
    entertainment: Clapperboard,
    delivery: Bike,  
    ridehail: Car,
    necessary: ShoppingBag,
  };

  const Colors = {
    food: "#22c55e",          // verde
    transport: "#60a5fa",     // azul
    entertainment: "#f59e0b", // ámbar
    delivery: "#f472b6",      // rosa
    ridehail: "#22d3ee",      // cian
    necessary: "#a78bfa",     // violeta
  };

    const Icon = Icons[category] || Tag;
    const color = Colors[category] || "#94a3b8";

    const px = size === "md" ? 50 : 40;
    const r = size === "md" ? 12 : 10;
    const iconPx = Math.round(px * 0.58);

    return (
        <span
            className={`cat-badge ${className}`}
            aria-label={category}
            title={category}
            style={{
                "--c": color,
                width: `${px}px`,
                height: `${px}px`,
                borderRadius: `${r}px`,
            }}
        >
            <Icon size={iconPx} />
        </span>
    );
};

export default memo(CategoryBadge); // ← Nombre con mayúscula