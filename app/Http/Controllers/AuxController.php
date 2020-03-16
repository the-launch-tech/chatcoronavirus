<?php

namespace App\Http\Controllers;

use Str;
use Debugbar;
use Exception;
use App\Aux;
use Illuminate\Http\Request;

class AuxController extends Controller {

  public function get(Request $request, $source) {
    $params = $request->all();
    try {
      $aux = Aux::limit($params['limit'])->orderBy('created_at', 'DESC')->where('source', Str::lower($source))->get();
      return response()->json(compact('aux'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function save(Request $request, string $source) {
    $token = $request->header('x-scraper-token');
    $result = $request->only('title', 'url');

    if ($token !== config('app.scraper_token')) {
      return response()->json(['message' => 'Invalid Scraper Token!'], 500);
    }

    try {
      if ($result) {
        $aux = new Aux();
        $aux->source = 'google';
        $aux->title = Str::title($result['title']);
        $aux->url = $result['url'];
        $aux->save();
      }

      return response()->json(['message' => 'Success saving results!'], 200);
    } catch (Exception $e) {
      return response()->json(['message' => 'ERROR: '.$source.' '.$result['title'].' ' . $result['url'] . '' . $e->getMessage()], 500);
    }
  }

}
