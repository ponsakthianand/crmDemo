import { useEffect, useState } from "react";

function getInitials(str: string) {
  if (!str || typeof str !== "string") return "";
  // Split the string into words and remove extra spaces
  const words = str.trim().split(/\s+/);
  // Get the first letter of the first word
  const firstInitial = words[0][0].toUpperCase();
  // Get the first letter of the last word (if exists, otherwise same as first word)
  const lastInitial = words.length > 1 ? words[words.length - 1][0].toUpperCase() : "";
  // Return initials, combining both
  return firstInitial + lastInitial;
}

function getRandomAvatarColors() {
  // Generate random RGB color
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Determine text color (black or white) based on luminance
  const textColor = luminance > 0.5 ? "text-black" : "text-white";

  // Convert RGB to HEX for Tailwind's bg-[color] utility
  const backgroundColor = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return { backgroundColor, textColor };
}

interface AvatarProps {
  name: string,
  userId: string,
  className?: string
}

export default function Avatar(props: AvatarProps) {
  const { name, userId, className } = props;
  const [colors, setColors] = useState({ backgroundColor: "", textColor: "" });

  useEffect(() => {
    // Fetch colors for the specific user from sessionStorage
    const storedColors = sessionStorage.getItem(`avatarColors_${userId}`);
    if (storedColors) {
      setColors(JSON.parse(storedColors));
    } else {
      // Generate and save new colors for the user
      const newColors = getRandomAvatarColors();
      sessionStorage.setItem(`avatarColors_${userId}`, JSON.stringify(newColors));
      setColors(newColors);
    }
  }, [userId]);

  const initials = getInitials(name);
  // const bgColor = getRandomHexColor();
  return (
    <div className={`flex items-center justify-center w-[40px] h-[40px] rounded-full ${colors.textColor} ${className}`}
      style={{ backgroundColor: colors.backgroundColor }} title={name}>
      {initials}
    </div >
  )
}