<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {
  public function up() {
    Schema::create('users', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->uuid('id')->primary();
      $t->string('username', 100)->unique();
      $t->string('email', 70)->unique();
      $t->string('avatar', 255)->nullable();
      $t->unsignedTinyInteger('access')->default(0);
      $t->string('role', 50)->default('Nurse');
      $t->timestamp('email_verified_at')->nullable();
      $t->string('password');
      $t->string('country', 255)->nullable();
      $t->string('state', 255)->nullable();
      $t->integer('health_points')->default(0);
      $t->boolean('comment_cure_updates')->default(false);
      $t->boolean('post_cure_updates')->default(false);
      $t->boolean('pin_updates')->default(false);
      $t->boolean('subscriber_updates')->default(true);
      $t->boolean('malpractice_updates')->default(false);
      $t->boolean('comment_updates')->default(true);
      $t->boolean('chat_updates')->default(true);
      $t->boolean('at_updates')->default(true);

      $t->rememberToken();
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
