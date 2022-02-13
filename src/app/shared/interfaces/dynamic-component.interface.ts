import { ComponentRef } from "@angular/core";
import { MessageService } from "primeng/api";


export abstract class DynamicComponent {
  viewRef!: ComponentRef<any>;
  abstract styles: {
    'max-height'?: string,
    'max-width'?: string,
    'height': string,
    'width': string
  };
  constructor(
    protected messageService: MessageService
  ) {}

  /**
   * Called by a component or the view to destroy itself
   * ex. Targeting this method with a click event on an 'x' button
   */
  destroySelf(): void {
    this.viewRef.destroy();
  }

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
