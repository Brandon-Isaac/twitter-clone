// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { User, Post, Comment } from './interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styles: [
    `
      /* ... previous styles remain the same ... */
    `,
  ],
})
export class AppComponent implements OnInit {
  users: User[] = [];
  posts: Post[] = [];
  comments: Comment[] = [];

  selectedUserId: number = 1;
  selectedUser: User | null = null;

  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<User[]>(`${this.apiUrl}/users`).subscribe((users) => {
      this.users = users;
      // Set default to first user
      this.onUserSelect();
    });
  }

  onUserSelect() {
    // Find selected user
    const user = this.users.find((u) => u.id === this.selectedUserId);

    if (user) {
      this.selectedUser = user;
      this.loadUserPosts(user.id);
    }
  }

  loadUserPosts(userId: number) {
    this.http
      .get<Post[]>(`${this.apiUrl}/posts?userId=${userId}`)
      .subscribe((posts) => {
        this.posts = posts;

        // Load comments for first post if posts exist
        if (posts.length > 0) {
          this.loadPostComments(posts[0].id);
        } else {
          this.comments = [];
        }
      });
  }

  loadPostComments(postId: number) {
    this.http
      .get<Comment[]>(`${this.apiUrl}/comments?postId=${postId}`)
      .subscribe((comments) => {
        this.comments = comments;
      });
  }
}
