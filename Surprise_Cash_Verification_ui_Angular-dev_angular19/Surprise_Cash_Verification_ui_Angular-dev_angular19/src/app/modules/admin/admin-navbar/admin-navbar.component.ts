import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterComponent } from '../../common/footer/footer.component';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-admin-navbar',
  imports: [AdminHeaderComponent, FooterComponent],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})
export class AdminNavbarComponent {

  constructor(private router: Router) {

  }
  onAdminPage() {
    this.router.navigateByUrl('/admin-list');
  }
}
