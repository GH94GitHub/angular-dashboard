export interface Weather {
  city: string,
  time: string,
  weather: string,
  icon: string,
  temp: Temperature,
  wind: Wind,
}

interface Wind {
  speed: string,
  direction: string
}

interface Temperature {
  now: number,
  feelsLike: number,
  humidity: number
}
