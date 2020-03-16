<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStopwordsTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
      // Schema::create('stopwords', function (Blueprint $table) {
      //   $t->engine = 'InnoDB';
      //   $table->string('value', 30);
      // });
      // DB::raw('INSERT INTO stopwords (value) VALUES (a), (about), (an), (are), (as), (at), (be), (by)');
      // DB::statement('SET GLOBAL innodb_ft_server_stopword_table="stopwords"');
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {}
}
