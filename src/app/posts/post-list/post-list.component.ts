import { Component, OnInit } from '@angular/core';
import {Post} from '../post.models';
import {Subscription} from 'rxjs';
import {PostsService} from '../post.service';
import {PageEvent} from '@angular/material';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
/*  posts = [{title: 'First Post', content: 'This is the first post\'s content' },
    {title: 'Second Post', content: 'This is the second post\'s content'},
    {title: 'Third Post', content: 'This is the third post\'s content'}];*/
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private postsSub: Subscription;
  constructor(public postsService: PostsService) {
  }
  ngOnInit() {
    this.isLoading = true;
  this.postsService.getPosts(this.postsPerPage, this.currentPage);
  this.postsSub = this.postsService.getPostUpdateListener().subscribe((postsData: {posts: Post[] , postscount: number}) => {
    this.isLoading = false;
    this.totalPosts = postsData.postscount;
  this.posts = postsData.posts;
  });
  }
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex+1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);

  }
  onDelete(postId: string) {
    this.isLoading=true;
  this.postsService.deletePost(postId).subscribe(() =>
    {
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    }
  );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
