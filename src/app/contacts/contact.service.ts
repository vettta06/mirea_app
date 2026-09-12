import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from './contact';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private APIUrl = 'http://localhost:8000/v1/contact';
  constructor(private http: HttpClient) {}
  createContact(newContact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.APIUrl, newContact);
  }
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.APIUrl);
  }
  deleteContact(delContactId: string): Observable<string> {
    return this.http.delete<string>(this.APIUrl + '/' + delContactId);
  }
  updateContact(putContact: Contact): Observable<Contact> {
    const putUrl = this.APIUrl + '/' + putContact._id;
    return this.http.put<Contact>(putUrl, putContact);
  }
}
