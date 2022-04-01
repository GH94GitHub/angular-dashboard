import { ComponentRef, Injectable, Renderer2, RendererFactory2, ViewContainerRef } from '@angular/core';
import { Control } from '../interfaces/control.interface';
import { ExistingComponent } from '../interfaces/existing-component.interface';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {

  private existingComponents: ExistingComponent[] = [];
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Creates a component dynamically and sets up onDestroy()
   * @param locationToInsert Inserts componentType at this location
   * @param componentType The type of component
   * @param args Optional. Provides the renderer with additional options such as styles, attributes, etc.
   * @returns Existing ComponentRef or the reference to the newly created component
   */
  insertComponentDynamically(
    locationToInsert: ViewContainerRef,
    component: Control
    ): ComponentRef<any> | null {
      // Check to see if component already exists
      for(let i = 0; i < this.existingComponents.length; i++) {
        if (this.existingComponents[i].name === component.componentName) {
          return null;
        }
      }

      const componentRef: ComponentRef<any> = locationToInsert.createComponent(component.componentType);
      componentRef.instance.viewRef = componentRef;
      const newComponent: ExistingComponent = {
        name: component.componentName,
        elRef: componentRef
      }
      this.existingComponents.push(newComponent);
      this.moveToTop(componentRef);
      componentRef.onDestroy( () => {
        this.destroyComponent(componentRef);
      });
      return componentRef;
  }

  /**
   * Destroys the component
   * @param componentRef
   * @returns Boolean indicating if a component was destroyed
   */
  private destroyComponent(componentRef: ComponentRef<any>): boolean {

    const componentName = this.getComponentName(componentRef);
    const existingIndex = this.existingComponents.findIndex(
      (existingComponent: ExistingComponent) => {
        return componentName.indexOf(existingComponent.name) === 0 ? true : false;
      }
    );

    this.existingComponents.splice(existingIndex, 1)[0];
    componentRef.destroy();

    return true;
  }

  /**
   * Gives a component the highest zIndex in relative to the other dynamic components that are created
   *   using this service.
   * @param componentRef The component to put on top zIndex wise
   * @returns void
   */
  moveToTop(componentRef: ComponentRef<any>): void {
    const componentToMove = componentRef.location.nativeElement.querySelector('.component-container');
    if(componentToMove.className.includes('on-top')) return;

    // Remove 'on-top' class from all dynamically created components
    for(let i = 0; i < this.existingComponents.length; i++) {
      const elRef = this.existingComponents[i].elRef.location.nativeElement.querySelector('.component-container');
      this.renderer.removeClass(elRef, 'on-top');

      // Lower every component one layer, but no less than 0 zIndex
      if (elRef.style.zIndex > 0)
        elRef.style.zIndex -= 1;
    }

    this.renderer.addClass(componentToMove, 'on-top');
    //Give current component highest zIndex of other dynamic components
    componentToMove.style.zIndex = this.existingComponents.length;
  }

/**
 * Returns the string representation of the passed in <Component>
 * @param componentType The type of component
 * @returns string representation of componentType
 */
  private getComponentName(componentRef: ComponentRef<any>): string {
    return componentRef.componentType.name;
  }
}
