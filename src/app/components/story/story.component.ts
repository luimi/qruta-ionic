import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
  standalone: false
})
export class StoryComponent implements OnInit {
  @Input() stories: any[] = [];
  @Output() onAllStoriesEnd = new EventEmitter<void>();

  currentIndex: number = 0;
  progress: number = 0;
  private interval: any;
  private readonly IMAGE_DURATION = 5000;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.startStory();
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  startStory() {
    this.clearTimer();
    const current = this.stories[this.currentIndex];

    if (current.type === 'image') {
      this.startImageTimer();
    }
  }

  startImageTimer() {
    this.progress = 0;
    const step = 100 / (this.IMAGE_DURATION / 100);

    this.interval = setInterval(() => {
      this.progress += step;
      if (this.progress >= 100) {
        this.nextStory();
      }
      this.cdr.detectChanges();
    }, 100);
  }

  nextStory() {
    if (this.currentIndex < this.stories.length - 1) {
      this.currentIndex++;
      this.progress = 0;
      this.startStory();
    } else {
      this.onAllStoriesEnd.emit();
      this.clearTimer();
    }
  }

  prevStory() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.progress = 0;
      this.startStory();
    }
  }

  private clearTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  onVideoEnded() {
    this.nextStory();
  }
}
