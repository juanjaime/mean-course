import {Component} from '@angular/core';
import {Post} from '../post.models';
import {NgForm} from '@angular/forms';
import {PostsService} from '../post.service';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredContent = '';
  enteredTitle = '';
  constructor(public postsService: PostsService) {
  }
  onAddPost(form: NgForm) {
    if(form.invalid){
      return;
    }
    const post: Post = {
      title: form.value.title,
      content: form.value.content
    };
  this.postsService.addPost(form.value.title, form.value.content);
  form.resetForm();
  }
}
