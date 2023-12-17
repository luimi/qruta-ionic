import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent implements OnInit {
  @Input() icon = 'heart';
  @Input() text = 'Texto de referencia';
  @Input() fullContent = true;
  @Input() progress = false;
  constructor() { }

  ngOnInit() { }
  public setIcon(icon: string) {
    this.icon = icon;
  }
  public setText(text: string) {
    this.text = text;
  }
  public showProgress() {
    this.progress = true;
  }
  public hideProgress() {
    this.progress = false;
  }
}
