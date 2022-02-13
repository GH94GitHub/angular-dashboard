export interface Weather {
  city: string,
  weather: string,
  temp: Temperature,
  wind: Wind,
  icon: string
}

interface Wind {
  speed: string,
  direction: string
}

interface Temperature {
  now: number,
  feelsLike: number,
  min: number,
  max: number,
  humidity: number
}
