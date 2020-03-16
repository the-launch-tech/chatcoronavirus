<?php

namespace App\Http\Controllers;

use App\Realm;
use Illuminate\Http\Request;

class RealmsController extends Controller {

  public function realms(Request $request) {
    try {
      $realms = Realm::select(['label', 'id', 'slug', 'description'])->orderBy('label', 'ASC')->get();
      return response()->json(compact('realms'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

}
