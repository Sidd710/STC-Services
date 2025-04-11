import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/apiService';

@Component({
  selector: 'app-view-complain',
 
  templateUrl: './view-complain.page.html',
  standalone:false,
  styleUrls: ['./view-complain.page.scss'],
})
export class ViewComplainPage implements OnInit {

  complaints: any[] = [];
  filteredComplaints: any[] = [];
  statusFilters = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: '1' },
    { label: 'Inactive', value: '0' },
    { label: 'Resolved', value: '2' }, // if applicable
  ];
  selectedStatus: string = 'all';

  
  searchTerm = '';
  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,private apiService:ApiService
  ) {}
  ngOnInit() {
    this.fetchComplaints();
  }
  applyStatusFilter(status: string) {
    this.selectedStatus = status;
    this.filterComplaints();
  }
  ionViewWillEnter() {
    this.searchTerm = '';
    this.fetchComplaints();
  }
  
  fetchComplaints() {
    this.apiService.get<any>('Complaints/mycomplaints').subscribe({
      next: (res) => {
        if (res.status && res.all_complaints) {
          this.complaints = res.all_complaints;
          this.filteredComplaints = [...this.complaints];
        
        } else {
          this.showToast('No complaints found.', 'warning');
        }
      },
      error: () => this.showToast('Failed to fetch complaints', 'danger')
    });
  }
  filterComplaints() {
    const search = this.searchTerm?.toLowerCase() || '';
  
    this.filteredComplaints = this.complaints.filter(item => {
      const matchesSearch =
        item.pole_no?.toLowerCase().includes(search) ||
        item.street?.toLowerCase().includes(search) ||
        item.area?.toLowerCase().includes(search);
  
      const matchesStatus =
        this.selectedStatus === 'all' || item.status === this.selectedStatus;
  
      return matchesSearch && matchesStatus;
    });
  }

  editComplaint(complaintId: string) {
    this.router.navigate(['/citizen-tabs/edit-complaint', complaintId]);
  }

  async deleteComplaint(complaintId: string) {
    let data={
      "complaint_id":complaintId
    }
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this complaint?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => {
            this.apiService.deleteComplaint('complaints/deletecomplaint',data).subscribe({
              next: () => {
                this.showToast('Complaint deleted successfully.', 'success');
                this.fetchComplaints(); // refresh
              },
              error: () => this.showToast('Delete failed.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }

}
