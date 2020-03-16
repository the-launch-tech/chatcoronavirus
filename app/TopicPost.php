<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class TopicPost extends Pivot {
  protected $table = 'topic_post';
  public $incrementing = true;
  protected $guarded = [];
}
