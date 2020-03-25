<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRealmsTable extends Migration {
  public function up() {
    Schema::create('realms', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->uuid('id')->primary();
      $t->string('slug', 255)->unique();
      $t->string('label', 255)->unique();
      $t->string('description', 255)->unique();

      $t->timestampsTz();
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
