import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/services/apiService';

@Component({
  selector: 'app-complainclose',
  standalone: false,
  templateUrl: './complainclose.component.html',
  styleUrls: ['./complainclose.component.scss'],
})
export class ComplaincloseComponent implements OnInit {

  complaint: any;
  statusForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router, private toastCtrl: ToastController,
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      citizen_issue: [''],
      work_done: ['', Validators.required]
    });
  }
  ngOnInit() {
    // Assuming complaint data comes from route params or service
    const complaintId = this.route.snapshot.paramMap.get('id');
    this.loadComplaint(complaintId);
  }

  patchFormValues() {
    if (this.complaint) {
      this.statusForm.patchValue({
        citizen_issue: this.complaint.citizen_issue,
        work_done:this.complaint.work_done
      });
    }
  }
  ionViewWillEnter() {
    const complaintId = this.route.snapshot.paramMap.get('id');
    this.loadComplaint(complaintId);
  }


  loadComplaint(id: any) {
    let data = {

      "complaint_id": id

    }
    this.api.post<any>(`complaints/getsinglecomplaint`, data).subscribe({
      next: res => {
        this.complaint = res.complaint;
      },
      error: () => this.showToast('Failed to load complaint.', 'danger')
    });
  }

  submitStatusChange() {
    const newStatus = this.statusForm.value.status;
    const workDone = this.statusForm.value.work_done;

    this.api.post('complaints/changestatus', {
      complaint_id: this.complaint.id,
      status: newStatus,
      work_done: workDone,
      citizen_issue: this.statusForm.value.citizen_issue
    }).subscribe((res: any) => {
        this.showToast(res.msg,'success' );
      this.router.navigate(['/admin-tabs/viewcomplain']);
        }
      )
    }
  

  // reopenComplaint() {
  //   this.api.post('Complaints/updateStatus', {
  //     id: this.complaint.id,
  //     status: 'Open'
  //   }).subscribe(() => {
  //     this.router.navigate(['/admin-tabs/view-complaints']);
  //   });
  // }
  async showToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      color,
      position: 'top',
    });
    toast.present();
  }

  goBack() {
    this.router.navigate(['/admin-tabs/viewcomplain']);
  }
  
}  
