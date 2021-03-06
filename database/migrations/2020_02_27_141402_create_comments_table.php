<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommentsTable extends Migration {
  public function up() {
    Schema::create('comments', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->uuid('id')->primary();
      $t->longText('content');

      $t->uuid('post_id')->index();
      $t->uuid('user_id')->index();
      $t->uuid('comment_id')->index()->nullable();

      $t->timestampsTz();
    });

    Schema::table('comments', function($t) {
      $t->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $t->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
      $t->foreign('comment_id')->references('id')->on('comments')->onDelete('cascade');
    });
  }

  public function down() {
    Schema::dropIfExists('comments');
  }
}
