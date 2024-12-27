import { Component, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    MaterialModule,
    CommonModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  displayedColumns: string[] = ['id', 'title', 'description', 'dueDate', 'isCompleted', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((data) => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  addEditTask(taskId: number | null): void {
    if(taskId === null || taskId === 0){
      this.router.navigate(['/tasks/add']);
    }
    else{
    this.router.navigate(['/tasks/edit', taskId]);
    }
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => this.loadTasks());
  }
}
