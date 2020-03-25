<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsersTable extends Migration {
  public function up() {
    Schema::table('users', function (Blueprint $t) {
      $t->string('banner', 255)->nullable();
    });
  }

  public function down() {}
}
