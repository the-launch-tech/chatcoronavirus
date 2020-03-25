<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTopicsTable extends Migration {
  public function up() {
    Schema::create('topics', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->uuid('id')->primary();
      $t->string('slug', 255)->unique();
      $t->string('label', 255)->unique();
      $t->string('description', 1000)->nullable();
      $t->boolean('primary')->default(0);

      $t->uuid('user_id')->index();

      $t->timestampsTz();
    });

    Schema::table('topics', function($t) {
      $t->foreign('user_id')->references('id')->on('users');
    });
  }

  public function down() {
    Schema::dropIfExists('topics');
  }
}
