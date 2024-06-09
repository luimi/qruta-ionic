import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent implements OnInit {
  @Input() icon = '';
  @Input() text = '';
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
  public apply(changes: {text: string, icon: string, progress: boolean}){
    Object.keys(changes).forEach((param: string) => {
      switch(param) {
        case 'icon': this.icon = changes[param]; break;
        case 'text': this.text = changes[param]; break;
        case 'progress': this.progress = changes[param]; break;
      }
    })
  }
}
