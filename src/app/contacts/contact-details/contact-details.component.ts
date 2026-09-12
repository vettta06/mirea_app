import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';

@Component({
  selector: 'contact-details',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact-details.component.html',
})
export class ContactDetailsComponent {
  @Input() contact!: Contact;

  @Input() createHandler!: Function;

  @Input() updateHandler!: Function;

  @Input() deleteHandler!: Function;

  constructor(private contactService: ContactService) {}

  createContact(contact: Contact): void {
    this.contactService.createContact(contact).subscribe((newContact: Contact) => {
      this.createHandler(newContact);
    });
  }

  updateContact(contact: Contact): void {
    this.contactService.updateContact(contact).subscribe((updatedContact: Contact) => {
      this.updateHandler(updatedContact);
    });
  }

  deleteContact(contactId: string): void {
    this.contactService.deleteContact(contactId).subscribe((deletedContactId: string) => {
      this.deleteHandler(deletedContactId);
    });
  }
}
