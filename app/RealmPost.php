<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RealmPost extends Pivot {
  protected $table = 'realm_post';
  public $incrementing = true;
  protected $guarded = [];
}
