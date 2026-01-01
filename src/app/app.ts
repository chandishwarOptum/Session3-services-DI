import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServiceDependencyExample } from './service-dependency-example/service-dependency-example';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ServiceDependencyExample],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('services-DI');
}
