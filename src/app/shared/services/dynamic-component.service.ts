import { ComponentRef, Injectable, Renderer2, RendererFactory2, ViewContainerRef } from '@angular/core';
import { Control } from '../interfaces/control.interface';
import { CreationArgs } from '../interfaces/creation-args.interface';
import { ExistingComponent } from '../interfaces/existing-component.interface';

@Injectable({
  providedIn: 'root'
})
export class DynamicComponentService {

  private existingComponents: ExistingComponent[] = [];
  private renderer: Renderer2;
  private dashboardContainer!: ViewContainerRef;

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
    component: Control,
    args?: CreationArgs
    ): ComponentRef<any> | null {
      this.dashboardContainer = locationToInsert;

      // Check to see if component already exists
      for(let i = 0; i < this.existingComponents.length; i++) {
        if (this.existingComponents[i].name === component.componentType.name) {
          return null;
        }
      }

      const componentRef: ComponentRef<any> = locationToInsert.createComponent(component.componentType);
      componentRef.instance.viewRef = componentRef;
      const newComponent: ExistingComponent = {
        name: componentRef.componentType.name,
        elRef: componentRef
      }
      this.existingComponents.push(newComponent);
      componentRef.onDestroy( () => {
        this.destroyComponent(componentRef);
      });
      if (args) this.addProperties(componentRef, args);

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
      (existingComponent: ExistingComponent) => existingComponent.name === componentName
    );

    const removedComponent = this.existingComponents.splice(existingIndex, 1)[0];
    if (removedComponent) return false;
    componentRef.destroy();

    return true;
  }

  moveToTop(componentRef: ComponentRef<any>): void {
    this.dashboardContainer.move(componentRef.hostView, this.dashboardContainer.length - 1);
  }

/**
 * Returns the string representation of the passed in <Component>
 * @param componentType The type of component
 * @returns string representation of componentType
 */
  private getComponentName(componentRef: ComponentRef<any>): string {
    return componentRef.componentType.name;
  }


  /**
   * Uses Renderer2 to add properties to element
   * @param componentRef The component to add the properties to
   * @param args Arguments specifying what to add (i.e. classes, attributes, etc.)
   */
  private addProperties(componentRef: ComponentRef<any>, args: CreationArgs): void {

    const nativeElement = componentRef.location.nativeElement;

    try {

      if (args.classes) args.classes.forEach( className => this.renderer.addClass(nativeElement, className));
      if (args.attributes) args.attributes.forEach(
        attribute => this.renderer.setAttribute(nativeElement, attribute.name, attribute.value, attribute.namespace)
      );
      if (args.properties) args.properties.forEach(
        property => this.renderer.setProperty(nativeElement, property.name, property.value)
      );
    }
    catch(e) {

      console.log(e);
      throw Error('Error in adding properties with Renderer2');
    }
  }
}
