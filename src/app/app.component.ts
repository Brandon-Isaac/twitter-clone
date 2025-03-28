import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/api.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [NgFor, NgIf],
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  posts: any[] = [];
  selectedPost: any = null;
  comments: { [postId: number]: any[] } = {}; // Changed to an object to store comments by post ID
  selectedPostComments: any[] = []; // New property to track comments for the selected post

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getUsers().subscribe((users) => {
      this.users = users;
      // Set default user (ID 1)
      const defaultUser = this.users.find((user) => user.id === 1);
      if (defaultUser) {
        this.onUserSelect(defaultUser.id);
      }
    });
  }

  onUserSelect(userId: number | string): void {
    // Convert string to number if needed
    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    const user = this.users.find((u) => u.id === id);
    if (!user) return;

    this.selectedUser = user;
    this.posts = [];
    this.comments = {};
    this.selectedPostComments = [];

    this.apiService.getUserPosts(id).subscribe((posts) => {
      this.posts = posts;
      // Set default post (first post)
      if (this.posts.length > 0) {
        this.selectedPost = this.posts[0];
      }
    });
  }

  onPostSelect(post: any): void {
    this.selectedPost = post;
    this.selectedPostComments = []; // Clear comments when selecting a new post
  }

  loadComments(postId: number): void {
    // If comments for this post are not already loaded, fetch them
    if (!this.comments[postId]) {
      this.apiService.getPostComments(postId).subscribe((comments) => {
        // Store comments for this specific post
        this.comments[postId] = comments;
        // Set the selected post's comments
        this.selectedPostComments = comments;
        this.selectedPost = this.posts.find((post) => post.id === postId);
      });
    } else {
      // If comments are already loaded, just set them
      this.selectedPostComments = this.comments[postId];
      this.selectedPost = this.posts.find((post) => post.id === postId);
    }
  }
}
