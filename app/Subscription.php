<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Subscription extends Pivot {
  protected $table = 'subscriptions';
  public $incrementing = true;
  protected $guarded = [];
}
