import { Control } from "../interfaces/control.interface";
import { ClockWidgetComponent } from "../components/widgets/clock-widget/clock-widget.component";
import { WeatherWidgetComponent } from "../components/widgets/weather-widget/weather-widget.component";

export const WIDGETS: Control[] = [
  {
    componentName: 'Clock',
    componentType: ClockWidgetComponent
  },
  {
    componentName: 'Weather',
    componentType: WeatherWidgetComponent
  }
]
