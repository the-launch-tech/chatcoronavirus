<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePinsTable extends Migration {
  public function up() {
    Schema::create('pins', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->bigIncrements('id');

      $t->uuid('user_id')->index();
      $t->uuid('post_id')->index()->nullable();

      $t->timestampsTz();
    });

    Schema::table('pins', function($t) {
      $t->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
      $t->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
    });
  }

  public function down() {
    Schema::dropIfExists('malpractices');
    Schema::dropIfExists('pins');
    Schema::dropIfExists('subscriptions');
    Schema::dropIfExists('aux');
    Schema::dropIfExists('cures');
    Schema::dropIfExists('realm_post');
    Schema::dropIfExists('topic_post');
    Schema::dropIfExists('post_user');
    Schema::dropIfExists('comments');
    Schema::dropIfExists('realms');
    Schema::dropIfExists('topics');
    Schema::dropIfExists('posts');
    Schema::dropIfExists('formats');
    Schema::dropIfExists('cache');
    Schema::dropIfExists('password_resets');
    Schema::dropIfExists('users');
  }
}
