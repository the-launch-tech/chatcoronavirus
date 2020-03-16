<?php

namespace App;

use App\Traits\UsesUuid;
use Illuminate\Database\Eloquent\Model;

class Aux extends Model {

  use UsesUuid;

  protected $table = 'aux';

  protected $fillable = ['url', 'title', 'url', 'excerpt'];

  public function getId() {
    return $this->id;
  }

  public function getUrl() {
    return $this->url;
  }

  public function getLabel() {
    return $this->label;
  }

  public function getExcerpt() {
    return $this->excerpt;
  }

}
