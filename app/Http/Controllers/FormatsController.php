<?php

namespace App\Http\Controllers;

use App\Format;
use Illuminate\Http\Request;

class FormatsController extends Controller {

  public function formats(Request $request) {
    try {
      $formats = Format::select(['label', 'id', 'slug', 'description'])->orderBy('label', 'ASC')->get();
      return response()->json(compact('formats'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

}
