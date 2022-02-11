import { ComponentRef } from "@angular/core";

export abstract class DynamicComponent {
  viewRef!: ComponentRef<any>;
  abstract styles: {
    'min-height': string,
    'min-width': string,
    'height': string,
    'width': string
  };

  /**
   * Called by a component or the view to destroy itself
   * ex. Targeting this method with a click event on an 'x' button
   */
  destroySelf(): void {
    this.viewRef.destroy();
  }
}
