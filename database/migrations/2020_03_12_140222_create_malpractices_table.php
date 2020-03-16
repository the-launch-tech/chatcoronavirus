<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMalpracticesTable extends Migration {
  public function up() {
    Schema::create('malpractices', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->bigIncrements('id');

      $t->uuid('reporter_id')->index();
      $t->uuid('reported_id')->index();
      $t->boolean('reported_item_id');
      $t->boolean('reported_item_table');

      $t->timestampsTz();
    });

    Schema::table('malpractices', function($t) {
      $t->foreign('reporter_id')->references('id')->on('users')->onDelete('cascade');
      $t->foreign('reported_id')->references('id')->on('users')->onDelete('cascade');
    });
  }

  public function down() {
    Schema::dropIfExists('malpractices');
  }
}
