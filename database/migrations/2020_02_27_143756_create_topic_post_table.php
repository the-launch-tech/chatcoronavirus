<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTopicPostTable extends Migration {
  public function up() {
    Schema::create('topic_post', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->bigIncrements('id');
      $t->boolean('primary')->default(1);
      
      $t->uuid('post_id')->index();
      $t->uuid('topic_id')->index();
    });

    Schema::table('topic_post', function($t) {
      $t->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
      $t->foreign('topic_id')->references('id')->on('topics')->onDelete('cascade');
    });
  }

  public function down() {
    Schema::dropIfExists('topic_post');
  }
}
