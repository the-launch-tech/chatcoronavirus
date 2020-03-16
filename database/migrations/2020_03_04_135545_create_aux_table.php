<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAuxTable extends Migration {
  public function up() {
    Schema::create('aux', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->uuid('id')->primary();
      $t->string('source', 255);
      $t->string('title', 255);
      $t->string('url', 1000);
      $t->string('excerpt', 1000)->nullable();

      $t->timestampsTz();
    });
  }

  public function down() {
    Schema::dropIfExists('aux');
  }
}
