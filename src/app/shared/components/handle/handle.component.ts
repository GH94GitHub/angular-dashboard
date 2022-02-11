import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-handle',
  templateUrl: './handle.component.html',
  styleUrls: ['./handle.component.scss']
})
export class HandleComponent implements OnInit {

  @Output() exit: EventEmitter<string> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  emitExit(): void {
    this.exit.emit('exit');
  }
}
