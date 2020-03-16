<?php

namespace App\Utils;

use Storage;

class Helpers {
  public static function getDefaultImage(string $type, int $min = 1, int $max = 7) {
    $number = self::getRandomNumber($min, $max);

    if ($type === 'article') {
      $file = 'articles/default-post-image-' . $number;
    } else if ($type === 'user') {
      $file = 'avatars/default-avatar-' . $number;
    }

    if ($file) {
      if (Storage::url($file . '.jpg')) {
        return $file . '.jpg';
      } else if (Storage::url($file . '.png')) {
        return $file . '.png';
      }
    }

    return null;
  }

  public static function getRandomNumber(int $min = 1, int $max = 7) : int {
    if (function_exists('random_int')) {
      return random_int($min, $max);
    } else if (function_exists('mt_rand')) {
      return mt_rand($min, $max);
    }
    return rand($min, $max);
  }
}
