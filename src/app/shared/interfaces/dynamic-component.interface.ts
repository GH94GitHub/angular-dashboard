import { ComponentRef } from "@angular/core";

export class DynamicComponent {
  viewRef!: ComponentRef<any>;

  destroySelf(): void {
    this.viewRef.destroy();
  }
}
