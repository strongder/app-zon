type ColorInfo = {
    name: string;
    rgb: string;
};

type ColorPaletteType = {
    [key: string]: ColorInfo;
};

const colorPalette: ColorPaletteType = {
    black: { name: 'Đen', rgb: 'rgb(0, 0, 0)' },
    white: { name: 'Trắng', rgb: 'rgb(255, 255, 255)' },
    brown: { name: 'Nâu', rgb: 'rgb(139, 69, 19)' },
    beige: { name: 'Be (Kem)', rgb: 'rgb(245, 245, 220)' },
    red: { name: 'Đỏ', rgb: 'rgb(255, 0, 0)' },
    yellow: { name: 'Vàng', rgb: 'rgb(255, 255, 0)' },
    blue: { name: 'Xanh dương', rgb: 'rgb(0, 0, 255)' },
    green: { name: 'Xanh lá cây', rgb: 'rgb(0, 255, 0)' },
    gray: { name: 'Xám', rgb: 'rgb(169, 169, 169)' },
    pastelPink: { name: 'Hồng pastel', rgb: 'rgb(255, 182, 193)' },
    mintGreen: { name: 'Xanh bạc hà', rgb: 'rgb(170, 255, 195)' },
    lightPurple: { name: 'Tím nhạt', rgb: 'rgb(230, 230, 250)' },
    gold: { name: 'Vàng kim', rgb: 'rgb(255, 223, 0)' },
    silver: { name: 'Bạc', rgb: 'rgb(192, 192, 192)' },
    camo: { name: 'Camo', rgb: 'rgb(127, 140, 141)' },
    pink: { name: 'Hồng', rgb: 'rgb(255, 105, 180)' },
    orange: { name: 'Cam', rgb: 'rgb(255, 165, 0)' },
    purple: { name: 'Tím', rgb: 'rgb(128, 0, 128)' },
};

export const getColorName = function (rgbValue: string): string | null {
    for (const key in colorPalette) {
        if (colorPalette[key].rgb === rgbValue) {
            return colorPalette[key].name;
        }
    }
    return null; // Return null if no match is found
};

export const getColorRGB = function (colorName: string): string | null {
    for (const key in colorPalette) {
        if (colorPalette[key].name === colorName) {
            return colorPalette[key].rgb;
        }
    }
    return null; // Return null if no match is found
};

export default colorPalette; 