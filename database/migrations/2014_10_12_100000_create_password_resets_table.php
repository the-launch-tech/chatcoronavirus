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
    Schema::dropIfExists('password_resets');
  }
}
