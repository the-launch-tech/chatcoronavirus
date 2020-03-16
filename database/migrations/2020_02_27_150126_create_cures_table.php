<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCuresTable extends Migration {
  public function up() {
    Schema::create('cures', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->bigIncrements('id');

      $t->uuid('user_id')->index();
      $t->uuid('post_id')->index()->nullable();
      $t->uuid('cmt_id')->index()->nullable();

      $t->timestampsTz();
    });

    Schema::table('cures', function($t) {
      $t->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $t->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
      $t->foreign('cmt_id')->references('id')->on('comments')->onDelete('cascade');
    });
  }

  public function down() {
    Schema::dropIfExists('cures');
  }
}
