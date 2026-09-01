import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EducationResource, educationResources } from './masonic-education.data';

@Component({
  selector: 'app-masonic-education',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './masonic-education.component.html',
  styleUrls: ['./masonic-education.component.css'],
})
export class MasonicEducationComponent {
  readonly resources: EducationResource[] = educationResources;
  readonly secretarySite = 'https://139sec.org';

  bookletResources(): EducationResource[] {
    return this.resources.filter((r) => r.group === 'booklet');
  }

  otherResources(): EducationResource[] {
    return this.resources.filter((r) => r.group !== 'booklet');
  }
}
