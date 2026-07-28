import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  trestleBoardMeta,
  memorialNotice,
  officerMessages,
  meetingSynopses,
  julyBirthdays,
  julyRaisings,
  milestoneHighlight,
  educationResources,
  lodgeResourceLinks,
  OfficerMessage,
  MeetingSynopsis,
  MilestonePerson,
  EducationResource,
  LodgeResourceLink,
} from './trestle-board.data';

@Component({
  selector: 'app-trestle-board',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trestle-board.component.html',
  styleUrls: ['./trestle-board.component.css'],
})
export class TrestleBoardComponent {
  readonly meta = trestleBoardMeta;
  readonly memorialNotice = memorialNotice;
  readonly officerMessages: OfficerMessage[] = officerMessages;
  readonly meetingSynopses: MeetingSynopsis[] = meetingSynopses;
  readonly birthdays: MilestonePerson[] = julyBirthdays;
  readonly raisings: MilestonePerson[] = julyRaisings;
  readonly milestoneHighlight = milestoneHighlight;
  readonly educationResources: EducationResource[] = educationResources;
  readonly lodgeResourceLinks: LodgeResourceLink[] = lodgeResourceLinks;

  activeOfficerId: string = officerMessages[0]?.id ?? 'wm';
  expandedSynopsisIndex: number | null = 0;

  get activeOfficer(): OfficerMessage | undefined {
    return this.officerMessages.find((m) => m.id === this.activeOfficerId);
  }

  selectOfficer(id: string): void {
    this.activeOfficerId = id;
  }

  toggleSynopsis(index: number): void {
    this.expandedSynopsisIndex = this.expandedSynopsisIndex === index ? null : index;
  }

  bookletResources(): EducationResource[] {
    return this.educationResources.filter((r) => r.group === 'booklet');
  }

  otherEducationResources(): EducationResource[] {
    return this.educationResources.filter((r) => r.group !== 'booklet');
  }
}
