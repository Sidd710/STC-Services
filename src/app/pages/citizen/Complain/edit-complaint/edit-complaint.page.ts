import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/apiService';

@Component({
  selector: 'app-edit-complaint',
  standalone:false,
  templateUrl: './edit-complaint.page.html',
  styleUrls: ['./edit-complaint.page.scss'],
})
export class EditComplaintPage implements OnInit {
  complaintForm!: FormGroup;
  complaintId!: string;
  existingImage: string = '';
  newImageFile?: File;
  imageDeleted = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router,
    private apiService:ApiService
  ) {}

  ngOnInit() {
    this.complaintId = this.route.snapshot.paramMap.get('id')!;
    this.buildForm();
    this.loadComplaint();
  }

  buildForm() {
    this.complaintForm = this.fb.group({
      pole_no: ['', Validators.required],
      street: ['', Validators.required],
      area: ['', Validators.required],
      landmark: [''],
      pincode: ['']
    });
  }

  loadComplaint() {
    let data={
      
        "complaint_id" : this.complaintId
    
    }
    this.apiService.post<any>(`complaints/getsinglecomplaint`,data).subscribe({
      next: res => {
        const data = res.complaint;
        this.complaintForm.patchValue({
          pole_no: data.pole_no,
          street: data.street,
          area: data.area,
          landmark: data.landmark,
          pincode: data.pincode
        });
        this.existingImage = data.img_url;
      },
      error: () => this.showToast('Failed to load complaint.', 'danger')
    });
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.newImageFile = file;
      this.imageDeleted = false; // In case they re-add after delete
    }
  }

  async confirmDeleteImage() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Image?',
      message: 'Do you want to remove the existing image?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => {
            this.imageDeleted = true;
            this.existingImage = '';
            this.newImageFile = undefined;
          }
        }
      ]
    });
    await alert.present();
  }

  async onSubmit() {
    if (this.complaintForm.invalid) {
      this.showToast('Please fill all required fields.', 'danger');
      return;
    }

    const formData = new FormData();
    formData.append('pole_no', this.complaintForm.value.pole_no);
    formData.append('street', this.complaintForm.value.street);
    formData.append('area', this.complaintForm.value.area);
    formData.append('landmark', this.complaintForm.value.landmark);
    formData.append('pincode', this.complaintForm.value.pincode);
    formData.append('complaint_id', this.complaintId); // Assuming required for update

    if (this.newImageFile) {
      formData.append('image', this.newImageFile);
    } else if (this.imageDeleted) {
      formData.append('delete_image', '1');
    }

    this.apiService.postPhoto('complaints/editcomplaint', formData).subscribe({
      next: () => {
        this.showToast('Complaint updated successfully!', 'success');
        this.router.navigate(['/citizen-tabs/view-complain']);
      },
      error: () => this.showToast('Failed to update complaint.', 'danger')
    });
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
