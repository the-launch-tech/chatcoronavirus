<?php

namespace App;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;

class Format extends Model {

  use UsesUuid;

  protected $table = 'formats';

  protected $fillable = [];

  public function posts() {
    return $this->hasMany('App\Post');
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
