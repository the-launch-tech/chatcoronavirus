<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSubscriptionsTable extends Migration {
  public function up() {
    Schema::create('subscriptions', function (Blueprint $t) {
      $t->engine = 'InnoDB';

      $t->bigIncrements('id');

      $t->uuid('subscriber_id')->index();
      $t->uuid('subscription_id')->index();
      $t->boolean('email_updates')->default(false);

      $t->timestampsTz();
    });

    Schema::table('subscriptions', function($t) {
      $t->foreign('subscriber_id')->references('id')->on('users')->onDelete('cascade');
      $t->foreign('subscription_id')->references('id')->on('users')->onDelete('cascade');
    });
  }

  public function down() {
    Schema::dropIfExists('subscriptions');
  }
}
