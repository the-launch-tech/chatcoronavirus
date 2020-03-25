<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostUserTable extends Migration {
  public function up() {}

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
