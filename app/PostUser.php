<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PostUser extends Pivot {

  protected $table = 'post_user';

  public $incrementing = true;

  protected $guarded = [];
}
