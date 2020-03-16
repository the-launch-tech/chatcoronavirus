<?php

namespace App\Http\Controllers;

use Str;
use App\Post;
use Debugbar;
use Exception;
use App\Topic;
use App\User;
use Illuminate\Http\Request;

class TopicsController extends Controller {

  public function saveTopic(Request $request, $user_id) {
    $params = $request->all();
    $topic = new Topic();
    $topic->label = Str::title($params['label']);
    $topic->slug = Str::slug($params['label']);
    if (array_key_exists('description', $params)) {
      $topic->description = $params['description'];
    }
    $topic->primary = array_key_exists('primary', $params);
    $topic->withUser(User::find($user_id));
    $saved = $topic->push();
    if ($saved) {
      if (array_key_exists('topic_id', $params)) {
        $topic->withTopic(Topic::find($params['topic_id']));
        $topic->push();
      }
      User::incrementHealthPoints($user_id);
      return response()->json(compact('topic'), 200);
    } else {
      return response()->json(['message' => 'Error saving topic!'], 500);
    }
  }

  public function topics(Request $request) {
    try {
      $params = $request->all();
      if (array_key_exists('primary', $params)) {
        $topics = Topic::where('primary', (int)$params['primary'])->select(['label', 'id', 'slug', 'description'])->orderBy('label', 'ASC')->get();
      } else {
        $topics = Topic::select(['label', 'id', 'slug', 'description'])->orderBy('label', 'ASC')->get();
      }
      return response()->json(compact('topics'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function archive(Request $request) {
    $params = $request->all();

    $posts_per_page = (int)$params['posts_per_page'];
    $paged = (int)$params['paged'];

    if ($params['type'] === 'topic') {
      $query = Topic::select('label', 'slug', 'id', 'description');
    }

    $total = round($query->count() * $posts_per_page);

    try {
      $terms = $query
        ->with(['user' => function ($q) {
          $q->select('username', 'health_points', 'access');
        }])
        ->with(['topic' => function ($q) {
          $q->select('label', 'slug', 'description');
        }])
        ->withCount('posts')
        ->skip($paged * $posts_per_page)
        ->take($posts_per_page)
        ->orderBy($params['orderby'], 'DESC')
        ->get();
      return response()->json(['terms' => $terms, 'total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function maxPages(Request $request) {
    $params = $request->all();

    if ($params['type'] === 'topic') {
      $count = Topic::all()->count();
    }

    try {
      $total = round($count / $params['posts_per_page']);
      return response()->json(['total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

}
