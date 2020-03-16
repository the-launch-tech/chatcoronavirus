<?php

namespace App\Http\Controllers;

use Debugbar;
use App\User;
use App\Post;
use App\Comment;
use Illuminate\Http\Request;

class CommentsController extends Controller {

  public function comments(Request $request) {
    $params = $request->all();
    try {
      $comments = Comment::with(['user' => function ($q) {
          $q->select('username', 'id', 'health_points', 'avatar');
        }])
        ->with('post.format')
        ->withCount('comments')
        ->limit($params['limit'])
        ->orderBy('created_at', 'DESC')
        ->get();
      return response()->json(compact('comments'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function postComments(Request $request, string $post_id) {
    $params = $request->all();

    try {
      $query = Comment::where('post_id', '=', $post_id)
        ->where('comment_id', '=', null);

      $posts_per_page = (int)$params['posts_per_page'];
      $paged = (int)$params['paged'];

      $total = round($query->count() / $posts_per_page);

      $comments = $query->with('user')
        ->with(['recursiveChildren' => function ($q) {
          $q->with('user');
        }])
        ->skip($paged * $posts_per_page)
        ->take($posts_per_page)
        ->orderBy('created_at', 'DESC')
        ->get();

      return response()->json(['comments' => $comments, 'total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function save(Request $request,  $post_id, $user_id) {
    $params = $request->only('content', 'comment_id');
    try {
      $comment = new Comment();
      $comment->content = $params['content'];
      $comment->withPost(Post::find($post_id));
      $comment->withUser(User::find($user_id));
      if ($params['comment_id'] && strlen($params['comment_id']) > 2) {
        $comment->withComment(Comment::find($params['comment_id']));
      }
      $comment->push();
      $comment->recursive_children = [];
      User::incrementHealthPoints($user_id);
      return response()->json(compact('comment'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function edit(Request $request, $post_id, $user_id, $id) {
    $params = $request->only('content');
    try {
      $comment = Comment::find($id);
      if ($params['content'] !== $comment->getContent()) {
        $comment->content = $params['content'];
      }
      $updated = $comment->save();
      User::incrementHealthPoints($user_id);
      return response()->json(['comment' => ['content' => $params['content'], 'id' => $id]], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function delete(Request $request, $post_id, $user_id, $id) {
    try {
      $comment = Comment::find($id);
      $deleted = $comment->delete();
      User::incrementHealthPoints($user_id);
      return response()->json(['comment' => ['id' => $id]], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

}
