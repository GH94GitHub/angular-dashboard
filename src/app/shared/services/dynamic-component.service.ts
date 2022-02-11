import { Component, ComponentRef, Injectable, Renderer2, RendererFactory2, ViewContainerRef } from '@angular/core';
import { Control } from '../interfaces/control.interface';
import { CreationArgs } from '../interfaces/creation-args.interface';
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
    component: Control,
    args?: CreationArgs
    ): ComponentRef<any> | null {

      // Check to see if component already exists
      for(let i = 0; i < this.existingComponents.length; i++) {
        if (this.existingComponents[i].name === component.componentName )
          return null;
      }

      const componentRef: ComponentRef<any> = locationToInsert.createComponent(component.componentType);
      componentRef.instance.viewRef = componentRef;
      const newComponent: ExistingComponent = {
        name: component.componentName,
        elRef: componentRef
      }
      this.existingComponents.push(newComponent);
      componentRef.onDestroy( () => {
        this.destroyComponent(componentRef)
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

    if (!(this.existingComponents.splice(existingIndex, 1)[0])) return false;
    componentRef.destroy();

    return true;
  }

/**
 * Returns the string representation of the passed in <Component>
 * @param componentType The type of component
 * @returns string representation of componentType
 */
  private getComponentName(componentRef: ComponentRef<any>): string {
    return componentRef.toString();
  }


  /**
   * Uses Renderer2 to add properties to element
   * @param componentRef The component to add the properties to
   * @param args Arguments specifying what to add (i.e. classes, attributes, etc.)
   */
  private addProperties(componentRef: ComponentRef<any>, args: CreationArgs): void {

    const nativeElement = componentRef.location.nativeElement.querySelector('.container');

    // console.log('~~ Inside addProperties ~~');
    // console.log()
    // console.log('~~ Native Element ~~');
    // console.log(nativeElement);
    // console.log()
    // console.log('~~ Passed-in Args ~~');
    // console.log(args);

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
