import IconFog from "../assets/images/icon-fog.webp";
import IconOvercast from "../assets/images/icon-overcast.webp";
import IconPartlyCloudy from "../assets/images/icon-partly-cloudy.webp";
import IconSunny from "../assets/images/icon-sunny.webp";
import IconRain from "../assets/images/icon-rain.webp";
import IconSnow from "../assets/images/icon-snow.webp";
import IconStorm from "../assets/images/icon-storm.webp";
import IconDrizzle from "../assets/images/icon-drizzle.webp";

const WEATHER_CODE_MAP = {
  // Clear sky
  0: IconSunny,
  1: IconSunny,
  
  // Partly cloudy
  2: IconPartlyCloudy,
  
  // Overcast
  3: IconOvercast,
  
  // Fog
  45: IconFog,
  48: IconFog,
  
  // Drizzle
  51: IconDrizzle,
  53: IconDrizzle,
  55: IconDrizzle,
  
  // Rain
  61: IconRain,
  63: IconRain,
  65: IconRain,
  80: IconRain,
  81: IconRain,
  82: IconRain,
  
  // Snow
  71: IconSnow,
  73: IconSnow,
  75: IconSnow,
  77: IconSnow,
  85: IconSnow,
  86: IconSnow,
  
  // Thunderstorm
  95: IconStorm,
  96: IconStorm,
  99: IconStorm,
};

export class WeatherIconMapper {
  constructor(customMappings = {}) {
    this.iconMap = { ...WEATHER_CODE_MAP, ...customMappings };
    this.defaultIcon = IconSunny;
  }

  getIcon(weatherCode) {
    return this.iconMap[weatherCode] || this.defaultIcon;
  }

  addMapping(weatherCode, iconPath) {
    this.iconMap[weatherCode] = iconPath;
  }

  setDefaultIcon(iconPath) {
    this.defaultIcon = iconPath;
  }
}

export const weatherIconMapper = new WeatherIconMapper();

export const getWeatherIcon = (weatherCode) => {
  return weatherIconMapper.getIcon(weatherCode);
};