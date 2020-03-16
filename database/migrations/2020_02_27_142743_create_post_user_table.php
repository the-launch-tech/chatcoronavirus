<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostUserTable extends Migration {
  public function up() {
    Schema::create('post_user', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->bigIncrements('id');
      $t->boolean('primary')->default(1);
      
      $t->uuid('user_id')->index();
      $t->uuid('post_id')->index();
    });

    Schema::table('post_user', function($t) {
      $t->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $t->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
    });
  }

  public function down() {
    Schema::dropIfExists('post_user');
  }
}
