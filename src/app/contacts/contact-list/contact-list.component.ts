import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Contact } from '../contact';
import { ContactService } from '../contact.service';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';

@Component({
  selector: 'contact-list',
  standalone: true,
  imports: [CommonModule, ContactDetailsComponent],
  templateUrl: './contact-list.component.html',
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactService.getContacts().subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });
  }

  private getIndexOfContact(contactId: string): number {
    return this.contacts.findIndex((contact) => contact._id === contactId);
  }

  selectContact(contact: Contact): void {
    this.selectedContact = contact;
  }

  createNewContact(): void {
    const contact: Contact = {
      username: '',
      email: '',
      telephone: {
        mobile: '',
        home: '',
      },
    };

    this.selectContact(contact);
  }

  deleteContact = (contactId: string): Contact[] => {
    const idx = this.getIndexOfContact(contactId);

    if (idx !== -1) {
      this.contacts.splice(idx, 1);
      this.selectedContact = null;
    }

    return this.contacts;
  };

  addContact = (contact: Contact): Contact[] => {
    this.contacts.push(contact);
    this.selectContact(contact);

    return this.contacts;
  };

  updateContact = (contact: Contact): Contact[] => {
    const idx = this.getIndexOfContact(contact._id!);

    if (idx !== -1) {
      this.contacts[idx] = contact;
      this.selectContact(contact);
    }

    return this.contacts;
  };
}
