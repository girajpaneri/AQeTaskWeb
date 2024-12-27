import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'http://localhost:5169/api'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  getTasks(): Observable<any> {
    return this.http.get(`${this.apiUrl}/Task`);
  }

  getTaskById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/Task/${id}`);
  }

  addTask(task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Task`, task);
  }

  updateTask(task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Task/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Task/${id}`);
  }
}
