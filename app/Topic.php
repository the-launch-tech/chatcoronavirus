<?php

namespace App;

use App\User;
use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;

class Topic extends Model {

  use UsesUuid;

  protected $table = 'topics';

  protected $fillable = ['slug', 'label', 'description', 'user_id', 'topic_id', 'primary'];

  public function user() {
    return $this->belongsTo('App\User');
  }

  public function topic() {
    return $this->belongsTo('App\Topic');
  }

  public function topics() {
    return $this->hasMany('App\Topic');
  }

  public function posts() {
    return $this->belongsToMany(
      'App\Post',
      'topic_post',
      'topic_id',
      'post_id'
      )
      ->as('post')
      ->withPivot(['primary']);
  }

  public function getId() {
    return $this->id;
  }

  public function getSlug() {
    return $this->slug;
  }

  public function getLabel() {
    return $this->label;
  }

  public function getDescription() {
    return $this->description;
  }

  public function withTopic(self $topic) {
    $this->topic()->associate($topic);
    return $this;
  }

  public function withUser(User $user) {
    $this->user()->associate($user);
    return $this;
  }

  public function scopeBySlug($query, string $slug) : self {
    return $query->where('slug', $slug)->first();
  }

}
