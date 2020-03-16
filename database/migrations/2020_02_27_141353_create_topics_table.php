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
      $t->boolean('primary')->default(false);

      $t->uuid('user_id')->index();
      $t->uuid('topic_id')->index()->nullable();

      $t->timestampsTz();
    });

    Schema::table('topics', function($t) {
      $t->foreign('user_id')->references('id')->on('users');
      $t->foreign('topic_id')->references('id')->on('topics');
    });
  }

  public function down() {
    Schema::dropIfExists('topics');
  }
}
