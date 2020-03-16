<?php

use Illuminate\Database\Seeder;

use App\Realm;

class RealmsTableSeeder extends Seeder {
  public function run() {
    $realms = [
      ['slug' => 'scientific-research', 'label' => 'Scientific Research', 'description' => 'Peer reviewed or mainstream scientific literature.'],
      ['slug' => 'casual-research', 'label' => 'Casual Research',  'description' => 'Laymens research.'],
      ['slug' => 'conspiracy-research', 'label' => 'Conspiracy Research',  'description' => 'Research into possible under-the-hood actions.'],
      ['slug' => 'mainstream-media', 'label' => 'Mainstream Media',  'description' => 'Based on or sourced from mainstream media content.'],
      ['slug' => 'alternative-media', 'label' => 'Alternative Media',  'description' => 'Based on or sourced from alternative media content.'],
      ['slug' => 'general-conversation', 'label' => 'General Conversation',  'description' => 'Simply conversation, a general realm of information.'],
      ['slug' => 'conjecture', 'label' => 'Conjecture',  'description' => 'Pure conjecture - questioning the world?']
    ];

    foreach($realms as $realm) {
      Realm::create($realm);
    }
  }
}
