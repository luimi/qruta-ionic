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
import { UtilsService } from 'src/app/utils/utils.service';

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
  isMuted: boolean = true;
  private interval: any;
  private IMAGE_DURATION = 5000;

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(private cdr: ChangeDetectorRef, private utils: UtilsService) { }

  async ngOnInit() {
    await this.getStoryTimer();
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

  private async getStoryTimer() {
    const ads: any = await this.utils.getServerConfig("ads");
    this.IMAGE_DURATION = ads.storyTime;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }
  tooglePlay() {
    let vp = this.videoPlayer.nativeElement
    if(vp.paused) {
      vp.play()
    } else {
      vp.pause()
    }
  }
}
