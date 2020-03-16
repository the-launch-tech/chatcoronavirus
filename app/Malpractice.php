<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Malpractice extends Pivot {
  protected $table = 'malpractices';
  public $incrementing = true;
  protected $guarded = [];
}
