<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Cure extends Pivot {
  protected $table = 'cures';
  public $incrementing = true;
  protected $guarded = [];
}
