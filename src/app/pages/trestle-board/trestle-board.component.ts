import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  trestleBoardMeta,
  memorialNotice,
  officerMessages,
  OfficerMessage,
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
  readonly secretarySite = 'https://139sec.org';

  activeOfficerId: string = officerMessages[0]?.id ?? 'wm';

  get activeOfficer(): OfficerMessage | undefined {
    return this.officerMessages.find((m) => m.id === this.activeOfficerId);
  }

  selectOfficer(id: string): void {
    this.activeOfficerId = id;
  }
}
