<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Pin extends Pivot {
  protected $table = 'pins';
  public $incrementing = true;
  protected $guarded = [];
}
