<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostsTable extends Migration {
  public function up() {
    Schema::dropIfExists('pin_user');

    Schema::create('posts', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->uuid('id')->primary();
      $t->string('title', 255);
      $t->string('slug', 255)->unique();
      $t->longText('content');
      $t->string('excerpt', 500)->nullable();
      $t->string('featured_image', 755)->nullable();
      $t->integer('views')->default(0);

      $t->uuid('format_id')->index();

      $t->timestampsTz();
    });

    Schema::table('posts', function($t) {
      $t->foreign('format_id')->references('id')->on('formats');
    });
  }

  public function down() {
    Schema::dropIfExists('posts');
  }
}
