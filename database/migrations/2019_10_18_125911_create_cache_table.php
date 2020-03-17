<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCacheTable extends Migration {
  public function up() {
      Schema::dropIfExists('cache');
    Schema::create('cache', function (Blueprint $t) {
      $t->string('key', 100)->unique();
      $t->text('value');
      $t->integer('expiration');
    });
  }

  public function down() {
    Schema::dropIfExists('cache');
  }
}
