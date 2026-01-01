import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map } from 'rxjs';
import { Data, Post, User } from '../services/data';

@Component({
  selector: 'app-service-dependency-example',
  imports: [CommonModule],
  templateUrl: './service-dependency-example.html',
  styleUrl: './service-dependency-example.scss',
})
export class ServiceDependencyExample implements OnInit {
  posts$!: Observable<Post[]>;
  users$!: Observable<User[]>;
  selectedPost$!: Observable<Post>;
  selectedPostId: number | null = null;

  // Constructor Dependency Injection
  constructor(private dataService: Data) {}

  ngOnInit() {
    // Initialize observables - async pipe will handle subscription
    this.posts$ = this.dataService.getPosts().pipe(
      map((posts) => posts.slice(0, 5)) // Show first 5 posts
    );

    this.users$ = this.dataService.getUsers().pipe(
      map((users) => users.slice(0, 3)) // Show first 3 users
    );
  }

  viewPost(id: number) {
    this.selectedPostId = id;
    this.selectedPost$ = this.dataService.getPost(id);
  }

  createNewPost() {
    const newPost = {
      userId: 1,
      title: 'New Post from Angular DI Example',
      body: 'This post was created using dependency injection in Angular!',
    };

    this.dataService.createPost(newPost).subscribe({
      next: (post) => {
        console.log('Post created:', post);
        alert(`Post created with ID: ${post.id}`);
      },
      error: (err) => {
        console.error('Failed to create post:', err);
      },
    });
  }

  // TrackBy function for better performance with ngFor
  trackByPostId(index: number, post: Post): number {
    return post.id;
  }
}
