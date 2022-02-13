import { Component, ComponentRef, HostListener } from "@angular/core";
import { MessageService } from "primeng/api";
import { DynamicComponentService } from "../services/dynamic-component.service";

@Component({
  template: ''
})
export abstract class DynamicComponent{
  viewRef!: ComponentRef<any>;
  abstract styles: {
    'max-height'?: string,
    'max-width'?: string,
    'height': string,
    'width': string
  };
  constructor(
    protected messageService: MessageService,
    protected dynamicComponentService: DynamicComponentService
  ) {}

  @HostListener('mousedown', ['$event']) onClick($event: any): void {
    // If handle button is clicked emit the event
      if (
        ($event.target.className.includes('mat-button-wrapper') &&
        $event.path[1].className.includes('exit-button') ||
        $event.target.className.includes('exit-button'))
        &&
        $event.target.innerText === "X"
      ) {}
      else
        this.dynamicComponentService.moveToTop(this.viewRef);
  }

  /**
   * Called by a component or the view to destroy itself
   * ex. Targeting this method with a click event on an 'x' button
   */
  destroySelf(): void {
    this.viewRef.destroy();
  }

  /**
   * Sends a toast to the main screen
   * @param errorObj Contains information about the toast to send
   */
  pushError(errorObj: PrimeNgError): void {
    this.messageService.add(errorObj);
  }
}

export interface PrimeNgError {
  severity: string,
  summary: string,
  detail: string,
  life?: number,
  sticky?: boolean,
  data?: any
}
