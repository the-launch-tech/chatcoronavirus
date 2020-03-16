<?php

namespace App;

use Purify;
use App\Post;
use App\User;
use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model {

  use UsesUuid;

  protected $table = 'comments';

  protected $fillable = [];

  public function user() {
    return $this->belongsTo('App\User');
  }

  public function post() {
    return $this->belongsTo('App\Post');
  }

  public function comment() {
    return $this->belongsTo('App\Comment');
  }

  public function comments() {
    return $this->hasMany('App\Comment');
  }

  public function cures() {
    return $this->belongsToMany(
      'App\User',
      'cures',
      'cmt_id',
      'user_id'
      )
      ->as('cure');
  }

  public function recursiveChildren() {
    return $this->comments()->with(['recursiveChildren' => function ($q) {
      $q->with('user');
    }]);
  }

  public function recursiveParent() {
    return $this->comment()->with('recursiveParent');
  }

  public function getId() {
    return $this->id;
  }

  public function getContent() {
    return $this->content;
  }

  public function getCommentId() {
    return $this->comment_id;
  }

  public function getContentAttribute($value) {
    return Purify::clean($value);
  }

  public function withPost(Post $post) {
    $this->post()->associate($post);
  }

  public function withUser(User $user) {
    $this->user()->associate($user);
  }

  public function withComment(self $comment) {
    $this->comment()->associate($comment);
  }

}
