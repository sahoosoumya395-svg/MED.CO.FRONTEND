import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.css']
})
export class ContactUs {

}
