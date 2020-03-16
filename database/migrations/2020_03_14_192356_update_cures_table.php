<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateCuresTable extends Migration {
  public function up() {
    Schema::table('cures', function($t) {
      $t->uuid('cmt_id')->index()->nullable();
    });

    Schema::table('cures', function($t) {
      $t->foreign('cmt_id')->references('id')->on('comments')->onDelete('cascade');
    });
  }

  public function down() {}
}
