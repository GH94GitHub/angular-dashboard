import { ComponentRef } from "@angular/core";

export interface Control {
  componentName: string,
  componentType: any,
  componentRef?: ComponentRef<any>
}
