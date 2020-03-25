<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRealmPostTable extends Migration {
  public function up() {
    Schema::create('realm_post', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->bigIncrements('id');

      $t->uuid('post_id')->index();
      $t->uuid('realm_id')->index();
    });

    Schema::table('realm_post', function($t) {
      $t->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
      $t->foreign('realm_id')->references('id')->on('realms')->onDelete('cascade');
    });
  }

  public function down() {
    Schema::dropIfExists('realm_post');
  }
}
