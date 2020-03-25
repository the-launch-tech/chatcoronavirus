<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFormatsTable extends Migration {
  public function up() {
    Schema::create('formats', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->uuid('id')->primary();
      $t->string('slug', 255)->unique();
      $t->string('label', 255)->unique();
      $t->string('description', 255)->nullable();
      $t->boolean('comments')->default(true);
      $t->boolean('topics')->default(true);
      $t->boolean('realms')->default(true);

      $t->timestampsTz();
    });
  }

  public function down() {
    Schema::dropIfExists('formats');
  }
}
