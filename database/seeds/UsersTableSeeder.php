<?php

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;
use App\User;

class UsersTableSeeder extends Seeder {
  public function run() {
    $users = [
      [
        'username' => 'ChatCoronavirus',
        'email' => 'daniel@thelaunch.tech',
        'country' => 'United States',
        'state' => 'North Carolina',
        'access' => 3,
        'role' => 'Medical Official',
        'avatar' => null,
        'health_points' => 1000,
        'malpractices' => 0,
        'password' => Hash::make('Round123123')
      ],
      [
        'username' => 'DanielGriffiths',
        'email' => 'danielbgriffiths@protonmail.com',
        'country' => 'United States',
        'state' => 'North Carolina',
        'access' => 2,
        'role' => 'Doctor',
        'avatar' => null,
        'health_points' => 0,
        'malpractices' => 0,
        'password' => Hash::make('Round123123')
      ],
      [
        'username' => 'CarolynCarter',
        'email' => 'daniel@pennerwebdesign.com',
        'country' => 'Canada',
        'state' => 'Toronto',
        'access' => 1,
        'role' => 'Nurse',
        'avatar' => null,
        'health_points' => 100,
        'malpractices' => 0,
        'password' => Hash::make('Round123123')
      ],
      [
        'username' => 'PianoGoy',
        'email' => 'westernrealist@gmail.com',
        'country' => 'United States',
        'state' => 'Virginia',
        'access' => 1,
        'role' => 'Nurse',
        'avatar' => null,
        'health_points' => 2,
        'malpractices' => 0,
        'password' => Hash::make('Round123123')
      ],
      [
        'username' => 'LacyLu',
        'email' => 'danielcasmir.media@gmail.com',
        'country' => 'United States',
        'state' => 'New York',
        'access' => 1,
        'role' => 'Nurse',
        'avatar' => null,
        'health_points' => 240,
        'malpractices' => 0,
        'password' => Hash::make('Round123123')
      ],
      [
        'username' => 'troxy',
        'email' => 'danielgriffiths.coding@yahoo.com',
        'country' => 'United States',
        'state' => 'North Carolina',
        'access' => 1,
        'role' => 'Nurse',
        'avatar' => null,
        'health_points' => 758,
        'malpractices' => 0,
        'password' => Hash::make('Round123123')
      ]
    ];

    foreach($users as $user) {
      User::create($user);
    }
  }
}
