<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePasswordResetsTable extends Migration {
  public function up() {
    Schema::create('password_resets', function (Blueprint $t) {
      $t->string('email', 50)->index();
      $t->string('token');
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
