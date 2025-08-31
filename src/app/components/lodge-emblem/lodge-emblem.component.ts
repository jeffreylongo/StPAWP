import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lodge-emblem',
  standalone: true,
  template: `
    <div class="lodge-emblem-container">
      <img 
        [src]="imageSrc" 
        [alt]="altText"
        [class]="imageClass"
        [style.width]="width"
        [style.height]="height"
        loading="lazy">
    </div>
  `,
  styles: [`
    .lodge-emblem-container {
      display: inline-block;
      line-height: 0;
    }
    
    .lodge-emblem-container img {
      display: block;
      max-width: 100%;
      height: auto;
    }
    
    .emblem-shadow {
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }
    
    .emblem-hover {
      transition: transform 0.3s ease, filter 0.3s ease;
    }
    
    .emblem-hover:hover {
      transform: scale(1.05);
      filter: drop-shadow(0 6px 12px rgba(198, 168, 74, 0.3));
    }
  `]
})
export class LodgeEmblemComponent {
  @Input() width: string = '80px';
  @Input() height: string = '80px';
  @Input() imageSrc: string = '/assets/coa.png';
  @Input() altText: string = 'St. Petersburg Lodge No. 139 F&AM Coat of Arms';
  @Input() imageClass: string = 'emblem-shadow emblem-hover';
}