<?php

use Illuminate\Database\Seeder;

use App\Format;

class FormatsTableSeeder extends Seeder {
  public function run() {
    $formats = [
      ['slug' => 'article', 'label' => 'Article', 'description' => 'A blog-like entry for research, thoughts, or conjecture.', 'comments' => true, 'topics' => true, 'realms' => true],
      ['slug' => 'thread','label' => 'Thread','description' => 'A conversational space to chat.','comments' => true,'topics' => true, 'realms' => true],
      ['slug' => 'resource','label' => 'Resource', 'description' => 'Text resource archive.', 'comments' => true, 'topics' => true, 'realms' => true],
    ];

    foreach($formats as $format) {
      Format::create($format);
    }
  }
}
