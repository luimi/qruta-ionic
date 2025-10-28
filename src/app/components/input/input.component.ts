import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    standalone: false
})
export class InputComponent implements OnInit {
  @Input() title: string | undefined;
  @Input() placeholder: string = "";
  @Input() icon: string | undefined;
  @Input() type: string = "text";
  @Output() changed = new EventEmitter<string>()
  @Output() isValid = new EventEmitter<boolean>()

  constructor() { }

  ngOnInit() { }

  async onInputChanged(event: any, input: any) {
    const value = (event.target as HTMLIonInputElement).value ?? '';
    const inputElement = await input.getInputElement()
    const validity = inputElement.validity;
    this.changed.emit(`${value}`)
    this.isValid.emit(validity !== undefined ? validity.valid : false)
  }

}
