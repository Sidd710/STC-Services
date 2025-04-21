import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/apiService';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-view-complain',
  standalone:false,
  templateUrl: './admin-view-complain.page.html',
  styleUrls: ['./admin-view-complain.page.scss'],
})
export class AdminViewComplainPage {
  complaints: any[] = [];
  filteredComplaints: any[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';

  statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Open', value: 'Open' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' }
  ];

  constructor(private api: ApiService, private router: Router,private location: Location) {}

  ionViewWillEnter() {
    this.loadComplaints();
  }
  goBack() {
    this.location.back();
  }
  loadComplaints() {
    this.api.get('users/allcomplaints').subscribe((res: any) => {
      if (res.status) {
        this.complaints = res.all_complaints;
        this.filterComplaints();
      }
    });
  }

  filterComplaints() {
    const search = this.searchTerm.toLowerCase();
    this.filteredComplaints = this.complaints.filter(item => {
      const matchesSearch =
        item.pole_no.toLowerCase().includes(search) ||
        item.street.toLowerCase().includes(search) ||
        item.area.toLowerCase().includes(search);

      const matchesStatus =
        this.selectedStatus === 'all' || item.complaint_status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  applyStatusFilter(status: string) {
    this.selectedStatus = status;
    this.filterComplaints();
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'Open':
        return 'success';
      case 'Resolved':
        return 'warning';
      case 'Closed':
        return 'medium';
      default:
        return 'medium';
    }
  }

  editComplaint(id: string) {
    this.router.navigate(['/admin-tabs/complainsolve', id]);
  }

  deleteComplaint(id: string) {
    if (confirm('Delete this complaint?')) {
      this.api.post('Complaints/delete', { id }).subscribe(() => {
        this.loadComplaints();
      });
    }
  }

  openMap(pincode: string) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${pincode}`, '_system');
  }
}
