import colorNameList from "color-name-list";

export const getColorNameFromRGB = (rgbString: string) => {
  const match = rgbString.match(/\d+/g);
  if (!match) return "Unknown color";

  const r = parseInt(match[0]);
  const g = parseInt(match[1]);
  const b = parseInt(match[2]);

  let closestColor = null;
  let closestDistance = Number.MAX_VALUE;

  for (const color of colorNameList) {
    const hex = color.hex;
    const r2 = parseInt(hex.substring(1, 3), 16);
    const g2 = parseInt(hex.substring(3, 5), 16);
    const b2 = parseInt(hex.substring(5, 7), 16);
    const distance = Math.sqrt(
      Math.pow(r - r2, 2) + Math.pow(g - g2, 2) + Math.pow(b - b2, 2)
    );
    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = color.name;
    }
  }

  return closestColor;
};
