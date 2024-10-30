import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  test: string = "nothing";

  constructor(private http: HttpClient) {

  }

  testPublic() {
    console.log("public ?");
    this.http.get<string>("/api/test/public").pipe(map(r => {
      this.test = r;
      return r;
    })).subscribe({});
  }

  testPrivate() {
    console.log("private ?");
    this.http.get<string>("/api/test/private").pipe(map(r => {
      this.test = r;
      return r;
    })).subscribe({});
  }
}
