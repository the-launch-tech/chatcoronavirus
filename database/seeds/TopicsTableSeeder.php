<?php

use Illuminate\Database\Seeder;

use App\User;
use App\Topic;

class TopicsTableSeeder extends Seeder {
  public function run() {
    $user_id = User::where('email', 'daniel@thelaunch.tech')->first()->getId();
    
    $topics = [
      ['slug' => 'economy', 'label' => 'Economy', 'description' => 'General content about the economy.', 'primary' => 1, 'user_id' => $user_id],
      ['slug' => 'localities', 'label' => 'Localities', 'description' => 'Specific information about localities across the world.', 'primary' => 1, 'user_id' => $user_id],
      ['slug' => 'health-and-wellness', 'label' => 'Health and Wellness',  'description' => 'Information about health and wellness related to Covid-19.', 'primary' => 1, 'user_id' => $user_id],
      ['slug' => 'governance', 'label' => 'Gonvernance',  'description' => 'Government responses, quarentines, violations.', 'primary' => 1, 'user_id' => $user_id],
      ['slug' => 'experiences', 'label' => 'Experiences',  'description' => 'Personal experiences with Covid-19.', 'primary' => 1, 'user_id' => $user_id]
    ];

    foreach($topics as $topic) {
      Topic::create($topic);
    }
  }
}
