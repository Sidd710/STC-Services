import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { LocationService } from 'src/app/services/location.service';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/apiService';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  isLoading = false;

  lat: number | null = null;
  lng: number | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService, private locationService: LocationService,private router:Router,private apiService:ApiService
  ) { }

  ngOnInit() {

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      landmark: ['', Validators.required],
      area: ['', Validators.required],
    });
    this.fetchLocation();

  }

  async fetchLocation() {
    try {
      const position = await this.locationService.getCurrentPosition();
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;


      const response: any = await this.locationService.getAddressFromCoords(this.lat, this.lng);
      console.log('Geocode API Response:', response);

      const result = response.results[0];

      const components = result.address_components;
      const areaComponent = components.find((c: any) =>
        c.types.includes('sublocality') || c.types.includes('locality')
      );
      const formattedAddress: string = result.formatted_address;
      console.log('Formatted Address:', formattedAddress);

      if (!formattedAddress.toLowerCase().includes('ahmedabad')) {
        this.showToast('Registration allowed only from Ahmedabad.', 'danger');
        return;
      }



      this.registerForm.patchValue({ area: areaComponent?.long_name || 'Unknown' });

      this.showToast('Location fetched successfully!', 'success');
    } catch (error) {
      console.error('Location error:', error);
      this.showToast('Failed to get location.', 'danger');
    }
  }



  async onRegister() {
    this.submitted = true;

    if (this.registerForm.invalid || this.lat === null || this.lng === null) {
      this.showToast('Please complete the form and detect location.', 'danger');
      return;
    }

    this.isLoading = true;

    const form = this.registerForm.value;

    const payload = {
      first_name: form.firstName,
      last_name: form.lastName,
      phone_no: form.mobile,
      email_id: form.email,
      area: form.area,
      landmark: form.landmark,
      address: form.address,
      lat: this.lat,
      lng: this.lng
    };

   
      this.apiService.post('auth/createcitizen', payload ).subscribe(
        (res: any) => {
          this.isLoading=false;
          if (!res.status) {

            this.showToast(res.msg || 'Registration failed.', 'danger');
            return;
          }

          this.showToast('Registered successfully!', 'success');
          this.router.navigate(['/login'])
          this.registerForm.reset();
          this.submitted = false;

        },
        (error) => {
          this.isLoading=false;
          this.showToast(error, 'danger');
          console.error('API Error:', error);
        });
      }
    
  

  async showToast(msg: string, color: string) {
      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2500,
        color,
        position: 'top',
      });
      toast.present();
    }
  }
