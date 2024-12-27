import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../material.module';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditComponent {
  taskForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.taskForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      dueDate: ['', Validators.required],
      isCompleted: [false],
    });

    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.isEditMode = true;
        this.loadTask(params['id']);
      }
    });
  }

  loadTask(id: number): void {
    const taskId = this.route.snapshot.paramMap.get('id');
    if (taskId) {
      this.taskService.getTaskById(+taskId).subscribe((task) => {
        if (task.dueDate) {
          task.dueDate = task.dueDate.split('T')[0];
        }
        this.taskForm.patchValue(task);
      });
    }
  }
  

  saveTask(): void {
    if (this.taskForm.invalid) {
      this.showSnackbar('Please fix the errors in the form before submitting.', 'error');
      return;
    }
  
    const taskData = this.taskForm.value;
  
    if (this.isEditMode) {
      this.taskService.updateTask(taskData).subscribe(
        () => {
          this.showSnackbar('Task updated successfully!', 'success');
          this.router.navigate(['/tasks']);
        },
        (error) => this.handleServerError(error)
      );
    } else {
      this.taskService.addTask(taskData).subscribe(
        () => {
          this.showSnackbar('Task added successfully!', 'success');
          this.router.navigate(['/tasks']);
        },
        (error) => this.handleServerError(error)
      );
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }

  showSnackbar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [`snackbar-${type}`],
    });
  }

  handleServerError(error: any): void {
    const fieldMapping: { [key: string]: string } = {
      DueDate: 'dueDate',
      Title: 'title',
      Description: 'description',
    };
  
    if (error.status === 400 && error.error && error.error.errors) {
      const serverErrors = error.error.errors;
  
      Object.keys(serverErrors).forEach((serverField) => {
        const clientField = fieldMapping[serverField]; // Map server field to form control name
        const formControl = this.taskForm.get(clientField);
  
        if (formControl) {
          formControl.setErrors({ serverError: serverErrors[serverField][0] });
        }
      });
  
      this.showSnackbar('Please fix the errors based on server validation.', 'error');
    } else {
      this.showSnackbar('An unexpected error occurred. Please try again.', 'error');
    }
  }
  
}
