<?php

namespace App\Services;

use Carbon\Carbon;

class ExcerptExtractor {

  public function __construct(string $content) {
    $this->content = $content;
    $this->excerpt = null;
  }

  public function findExcerpt() {
    $src = false;
    $document = new \DOMDocument();
    $document->loadHTML($this->content);
    $list = $document->getElementsByTagName('iframe');
    for ($i = 0; $i < ($list->length > 1 ? 1 : $list->length); $i++) {
        $iframe = $list->item($i);
        $this->excerpt = $document->saveHTML($iframe);
    }
  }

  public function hasExcerpt() {
    return $this->excerpt ? true : false;
  }

  public function getExcerpt() {
    return $this->excerpt;
  }

}
