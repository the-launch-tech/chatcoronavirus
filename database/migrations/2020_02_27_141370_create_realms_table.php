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
    Schema::dropIfExists('realms');
  }
}
