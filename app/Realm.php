<?php

namespace App;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;

class Realm extends Model {

  use UsesUuid;

  protected $table = 'realms';

  protected $fillable = [];

  public function posts() {
    return $this->belongsToMany(
      'App\Post',
      'realm_post',
      'realm_id',
      'post_id'
      )
      ->as('post');
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

  public function scopeBySlug($query, string $slug) : self {
    return $query->where('slug', $slug)->first();
  }

}
