import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { Data, Post, User } from '../services/data';

@Component({
  selector: 'app-service-dependency-example',
  imports: [CommonModule],
  templateUrl: './service-dependency-example.html',
  styleUrl: './service-dependency-example.scss',
})
export class ServiceDependencyExample implements OnInit {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();
  users$!: Observable<User[]>;
  selectedPost$!: Observable<Post>;
  selectedPostId: number | null = null;
  postsToShow = 5;
  editingPostId: number | null = null;

  // Constructor Dependency Injection
  constructor(private dataService: Data) {}

  ngOnInit() {
    // Load initial posts
    this.dataService
      .getPosts()
      .pipe(
        map((posts) => {
          console.log('Posts loaded:', posts);
          return posts.slice(0, 5); // Show first 5 posts
        })
      )
      .subscribe((posts) => {
        this.postsSubject.next(posts);
      });

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
      userId: 1000,
      title: 'New Post from Angular DI Example',
      body: 'This post was created using dependency injection in Angular!',
    };

    this.dataService.createPost(newPost).subscribe({
      next: (createdPost) => {
        console.log('Post created:', createdPost);
        alert(`Post created with ID: ${createdPost.id}`);

        // Optimistically add the new post to the beginning of the list
        const currentPosts = this.postsSubject.value;
        const updatedPosts = [createdPost, ...currentPosts].slice(0, ++this.postsToShow); // Keep max postsToShow + 1 posts
        this.postsSubject.next(updatedPosts);
      },
      error: (err) => {
        console.error('Failed to create post:', err);
      },
    });
  }

  deletePost(id: number, event: Event) {
    // Prevent triggering the viewPost click event
    event.stopPropagation();

    if (confirm('Are you sure you want to delete this post?')) {
      this.dataService.deletePost(id).subscribe({
        next: () => {
          console.log('Post deleted:', id);
          alert(`Post with ID ${id} has been deleted!`);

          // If the deleted post was selected, clear the selection
          if (this.selectedPostId === id) {
            this.selectedPostId = null;
          }

          // Optimistically remove the post from the list
          const currentPosts = this.postsSubject.value;
          const updatedPosts = currentPosts.filter((post) => post.id !== id);
          this.postsSubject.next(updatedPosts);
        },
        error: (err) => {
          console.error('Failed to delete post:', err);
          alert('Failed to delete post. Please try again.');
        },
      });
    }
  }

  updatePost(id: number, updatedData: Partial<Post>) {
    this.dataService.updatePost(id, updatedData).subscribe({
      next: (updatedPost) => {
        console.log('Post updated:', updatedPost);
        alert(`Post with ID ${id} has been updated!`);

        // Optimistically update the post in the local state
        const currentPosts = this.postsSubject.value;
        const updatedPosts = currentPosts.map((post) =>
          post.id === id ? { ...post, ...updatedData } : post
        );
        this.postsSubject.next(updatedPosts);

        // If the updated post was selected, refresh the selected post
        if (this.selectedPostId === id) {
          this.selectedPost$ = this.dataService.getPost(id);
        }
      },
      error: (err) => {
        console.error('Failed to update post:', err);
        alert('Failed to update post. Please try again.');
      },
    });
  }

  // Quick update methods for common operations
  updatePostTitle(id: number, newTitle: string, event: Event) {
    event.stopPropagation();

    if (newTitle.trim()) {
      this.updatePost(id, { title: newTitle.trim() });
    }
  }

  updatePostBody(id: number, newBody: string, event: Event) {
    event.stopPropagation();

    if (newBody.trim()) {
      this.updatePost(id, { body: newBody.trim() });
    }
  }

  editPost(post: Post, event: Event) {
    event.stopPropagation();

    const newTitle = prompt('Edit post title:', post.title);
    if (newTitle !== null && newTitle.trim() !== post.title) {
      this.updatePost(post.id, { title: newTitle.trim() });
    }
  }

  // TrackBy function for better performance with ngFor
  trackByPostId(index: number, post: Post): number {
    return post.id;
  }
}
