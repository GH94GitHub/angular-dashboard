import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.component.html',
  styleUrls: ['./handle.component.scss']
})
export class HandleComponent {

  @Output() exit: EventEmitter<string> = new EventEmitter();

  constructor() {}

  emitExit(): void {
    this.exit.next('exit');
  }
}
