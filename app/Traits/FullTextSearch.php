<?php

namespace App\Traits;

trait FullTextSearch {

  protected function fullTextWildcards($term) {
    $reservedSymbols = ['-', '+', '<', '>', '@', '(', ')', '~'];
    $term = str_replace($reservedSymbols, '', $term);
    $words = explode(' ', $term);
    foreach ($words as $key => $word) {
      if (strlen($word) >= 3) {
        $words[$key] = '+' . $word . '*';
      }
    }
    $searchTerm = implode( ' ', $words);
    return $searchTerm;
  }

  public function scopeSelectRelevance($query, $term) {
    if (!$term) {
      return $query;
    }

    $columns = implode(',',$this->searchable);
    $searchableTerm = $this->fullTextWildcards($term);
    return $query->selectRaw("*, MATCH ({$columns}) AGAINST (? IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AS relevance", [$searchableTerm]);
  }

  public function scopeSearch($query, $term, $cutoff = 3) {
    if (!$term) {
      return $query;
    }

    $columns = implode(',',$this->searchable);
    $searchableTerm = $this->fullTextWildcards($term);
    return $query->whereRaw("MATCH ({$columns}) AGAINST (? IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) > ?", [$searchableTerm, $cutoff]);
  }

  public function scopeRelevance($query, $order = 'DESC') {
    $query->orderBy('relevance', $order);
    return $query;
  }
}
