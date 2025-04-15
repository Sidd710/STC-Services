import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { LocationService } from 'src/app/services/location.service';
import { HttpClient } from '@angular/common/http';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ApiService } from 'src/app/services/apiService';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-complain',

  templateUrl: './add-complain.page.html',
  standalone: false,
  styleUrls: ['./add-complain.page.scss'],
})
export class AddComplainPage implements OnInit {
  complainForm!: FormGroup;

  lat: number = 0;
  lng: number = 0;
  imageFile!: File;
  imagePreview?: string;
  isLoading = false;
  complaintTypes = [
    { id: '1', complaint_type: 'Broken Pole' },
    { id: '2', complaint_type: 'Bad Lighting' },
    { id: '3', complaint_type: 'Power Cut' },
    { id: '4', complaint_type: 'Electrical Failure' },
    { id: '5', complaint_type: 'Fire' },
    { id: '6', complaint_type: 'Apocalypse' }
  ];


  constructor(
    private fb: FormBuilder,
    private toastCtrl: ToastController,
    private locationService: LocationService,
    private http: HttpClient, private apiService: ApiService,private router:Router,private location: Location
  ) { }

  ngOnInit() {
    this.complainForm = this.fb.group({
      complaint_type: ['', Validators.required],
      pole_no: ['', Validators.required],
      street: ['', Validators.required],
      landmark: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      area: ['', Validators.required],
    });

    this.detectLocation(); // auto-detect on load
  }
  goBack() {
    this.location.back();
  }
  async detectLocation() {
    try {
      const position = await this.getCurrentPosition();
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      const res = await this.locationService.getAddressFromCoords(this.lat, this.lng);
      const components = res.results[0]?.address_components;

      const areaComp = components.find((c: any) =>
        c.types.includes('sublocality') || c.types.includes('locality')
      );
      const pincodeComp = components.find((c: any) =>
        c.types.includes('postal_code')
      );

      this.complainForm.patchValue({
        area: areaComp?.long_name || '',
        pincode: pincodeComp?.long_name || ''
      });

    } catch (err) {
      this.showToast('Failed to detect location.', 'danger');
    }
  }

  getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
      });
    });
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  async submitComplain() {


    const formData = new FormData();
    formData.append('pole_no', this.complainForm.value.pole_no);
    formData.append('street', this.complainForm.value.street);
    formData.append('landmark', this.complainForm.value.landmark);
    formData.append('area', this.complainForm.value.area);
    formData.append('pincode', this.complainForm.value.pincode);
    formData.append('lat', this.lat.toString());
    formData.append('lng', this.lng.toString());
    formData.append('image', this.imageFile);
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.isLoading = true;

    this.apiService.postPhoto('complaints/addcomplaint', formData).subscribe(
      (event: any) => {
        this.isLoading = false;

        this.showToast('Complaint logged  successfully', 'success');
        setTimeout(() => {
          this.router.navigate(['/citizen-tabs/view-complain']);
          this.router.navigate(['/login']);
        }, 500);

       
       
       
        

      },
      (error) => {
        this.isLoading = false;
        console.error('Upload failed:', error);

      }
    );
  }
  async selectImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt, // Camera or Gallery
      });

      if (image.webPath) {
        const resizedFile = await this.resizeImage(image.webPath, 2); // Resize to 2MB
        if (resizedFile) {
          this.imageFile = resizedFile;
          this.imagePreview = image.webPath;
        } else {
          this.showToast("Failed to process image.", "danger");
        }
      }
    } catch (error) {
      console.error('Camera error:', error);
      this.showToast('Camera access denied.', "danger");
    }
  }
  async resizeImage(imageUri: string, maxSizeMB: number): Promise<File | null> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUri;
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        // Resize while keeping aspect ratio
        const scaleFactor = Math.sqrt((maxSizeMB * 1024 * 1024) / (width * height));
        width *= scaleFactor;
        height *= scaleFactor;

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to Blob
          canvas.toBlob(async (blob) => {
            if (blob && blob.size <= maxSizeMB * 1024 * 1024) {
              const fileName = `estimate_${new Date().getTime()}.jpg`;
              const file = new File([blob], fileName, { type: "image/jpeg" });
              resolve(file);
            } else {
              resolve(null);
            }
          }, "image/jpeg", 0.8); // Compression quality
        } else {
          reject("Canvas not supported");
        }
      };

      img.onerror = () => reject("Image load error");
    });
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