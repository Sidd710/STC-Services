// src/app/pages/dashboard/dashboard.page.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/services/apiService';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

  encapsulation: ViewEncapsulation.None

})
export class DashboardPage {
  user: any = {}; // from localStorage or service
  stats = {
    total: 0,
    ongoing: 0,
    completed: 0,
    pending:0
  };

  constructor(private auth: AuthService,private apiService: ApiService) {
    this.user = this.auth.getCurrentUser();
  }
  ionViewWillEnter() {
    this.user = JSON.parse(localStorage.getItem('userData') || '{}');
    this.fetchComplaintStats();
  }
  
  fetchComplaintStats() {
    this.apiService.get<any>('citizens/dashboard').subscribe(res => {
      if (res.status) {
        this.stats.total = res.data.total_complaints || 0;
        this.stats.pending = res.data.pending_complaints || 0;
        this.stats.ongoing = res.data.ongoing_complaints || 0;
        this.stats.completed = res.data.completed_complaints| 0;
      }
    });
  }
  logout() {
    this.auth.logout();
  }
}
