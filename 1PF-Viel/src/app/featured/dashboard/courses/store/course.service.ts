import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, Subject } from 'rxjs';
import { Course } from '../interfaces/Course';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  private coursesTitlesSubject = new BehaviorSubject<string[]>([]);
  coursesTitles$ = this.coursesTitlesSubject.asObservable();

  courseEdit = new BehaviorSubject<Course | null>(null);
  courseEdit$ = this.courseEdit.asObservable();

  constructor(private http: HttpClient) {}

  private _courses: Course[] = [
//     {
//       title: 'Angular',
//       description: 'Angular es un framework para construir aplicaciones web',
//     },
];

setUpdateCourse(id: string) {
  const course = this._courses.find((course) => course.id === id);

  if (!course) {
    alert('Course not found');
    return;
  }
  this.courseEdit.next(course);
}

updateCourse(course: Course) {
  this.http
    .put<Course>(`${environment.apiUrl}/courses/${course.id}`, course)
    .subscribe({
      next: (course) => {
        this._courses = this._courses.map((c) =>
          c.id === course.id ? course : c
        );
        this.coursesSubject.next(this._courses);
        this.coursesTitlesSubject.next(
          this._courses.map((course) => course.title)
        );
        this.courseEdit.next(null);
      },
      error: (error) => {
        console.error('Error updating course:', error);
      },
    });
}

getCourses() {
  this.coursesSubject.next(this._courses);
  return this.http
    .get<Course[]>(`${environment.apiUrl}/courses`)
     .pipe(delay(2000));
}

getCoursesTitles(): void {
  const names = this._courses.map((course) => course.title);
  this.coursesTitlesSubject.next(names);
}

addCourse(course: Course): Observable<Course> {
  return this.http.post<Course>(`${environment.apiUrl}/courses`, course)
}

deleteCourse(id: string) {
  return this.http.delete<Course>(`${environment.apiUrl}/courses/${id}`)
}

getByTitle(title: string) {
  return new Observable<Course>((subscriber) => {
    const course = this._courses.find(
      (course) => course.title.toLowerCase() === title.toLowerCase()
    );

    if (course) {
      subscriber.next(course);
    } else {
      subscriber.error('Course not found');
    }
  });
}
}

//   getCourses(): void {
//     this.coursesSubject.next(this._courses);
//   }

//   getCoursesTitles(): void {
//     const names = this._courses.map((course) => course.title);
//     this.coursesTitlesSubject.next(names);
//   }

//   addCourse(course: Course): void {
//     this._courses = [...this._courses, course];
//     this.coursesSubject.next(this._courses);
//     this.coursesTitlesSubject.next(this._courses.map((course) => course.title));
//   }

//   getByTitle(title: string) {
//     return new Observable<Course>((subscriber) => {
//       const course = this._courses.find(
//         (course) => course.title.toLowerCase() === title.toLowerCase()
//       );

//       if (course) {
//         subscriber.next(course);
//       } else {
//         subscriber.error('Course not found');
//       }
//     });
//   }
