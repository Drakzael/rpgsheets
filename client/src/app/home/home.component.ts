import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { map } from 'rxjs';
import { MenuComponent } from '../menu/menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuComponent
  ],
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
