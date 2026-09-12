import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContactListComponent } from './contacts/contact-list/contact-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContactListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('my-dream-app1');
}
