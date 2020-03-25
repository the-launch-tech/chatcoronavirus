<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFulltextTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
      DB::statement('
        ALTER TABLE posts
        ADD FULLTEXT post_index (
          title,
          excerpt,
          content
        )
      ');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {}
}
