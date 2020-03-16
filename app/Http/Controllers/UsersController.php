<?php

namespace App\Http\Controllers;

use App\Post;
use App\Comment;
use App\User;
use Illuminate\Http\Request;

class UsersController extends Controller {

  public function users(Request $request) {
    $params = $request->all();
    try {
      $query = User::withCount('subscribers');
      if (array_key_exists('limit', $params)) {
        $query->limit((int)$params['limit']);
      } else {
        $query->limit(5);
      }
      if (array_key_exists('order', $params) && array_key_exists('orderby', $params)) {
        $query->orderBy($params['orderby'], $params['order']);
      } else {
        $query->orderBy('health_points', 'DESC');
      }
      $users = $query->get();
      return response()->json(compact('users'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function healthPoints(Request $request, string $user_id) {
    try {
      $user = User::findOrFail($user_id);
      $user->health_points = $user->health_points + 1;
      $saved = $user->save();
      return response()->json(['saved' => $saved], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function togglePin(Request $request, string $user_id, string $type, string $post_id) {
    $unpinned = false;
    $pinned = false;
    try {
      $User = User::findOrFail($user_id);
      $Post = Post::findOrFail($post_id);
      if ($User->pins()->where('post_id', $post_id)->exists()) {
        $unpinned = $User->pins()->detach($Post);
      } else {
        $User->withPin($Post);
        $pinned = $User->push();
        $poster_id = $Post->users()->where('primary', 1)->first()->getId();
        User::incrementHealthPoints($poster_id, 3);
        User::incrementHealthPoints($user_id, 1);
      }
      return response()->json(['pinned' => $pinned, 'unpinned' => $unpinned], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function toggleCure(Request $request, string $user_id, string $type, string $item_id) {
    $cured = false;
    $uncured = false;
    try {
      if ($type === 'post') {
        $User = User::findOrFail($user_id);
        $Post = Post::findOrFail($item_id);
        if ($User->postCures()->where('post_id', $item_id)->exists()) {
          $uncured = $User->postCures()->detach($Post);
        } else {
          $User->withPostCure($Post);
          $cured = $User->push();
          $poster_id = $Post->users()->where('primary', 1)->first()->getId();
          User::incrementHealthPoints($poster_id, 3);
          User::incrementHealthPoints($user_id, 1);
        }
      } else if ($type === 'comment') {
        $User = User::findOrFail($user_id);
        $Comment = Comment::findOrFail($item_id);
        if ($User->commentCures()->where('cmt_id', $item_id)->exists()) {
          $uncured = $User->commentCures()->detach($Comment);
        } else {
          $User->withCommentCure($Comment);
          $cured = $User->push();
          $commenter_id = $Comment->user()->first()->getId();
          User::incrementHealthPoints($commenter_id, 3);
          User::incrementHealthPoints($user_id, 1);
        }
      } else {
        return response()->json(['message' => 'Invalid Type'], 500);
      }
      return response()->json(['cured' => $cured, 'uncured' => $uncured], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function toggleSubscription(Request $request, string $subscriber_id, string $type, string $subscription_id) {
    $unsubscribed = false;
    $subscribed = false;
    try {
      $Subscriptor = User::find($subscription_id);
      $Subscriber = User::findOrFail($subscriber_id);
      if ($Subscriptor->subscribers()->where('subscriber_id', $subscriber_id)->exists()) {
        $unsubscribed = $Subscriptor->subscribers()->detach($Subscriber);
      } else {
        $Subscriptor->withSubscriber($Subscriber);
        $subscribed = $Subscriptor->push();
        User::incrementHealthPoints($subscriber_id, 1);
        User::incrementHealthPoints($subscription_id, 3);
      }
      return response()->json(['subscribed' => $subscribed, 'unsubscribed' => $unsubscribed], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function toggleMalpractice(Request $request, string $user_id, string $type, string $item_id) {
    $unreported = false;
    $reported = false;
    try {
      $Reporter = User::findOrFail($user_id);
      if ($type === 'post') {
        $Target = Post::findOrFail($item_id);
        $TargetUser = $Target->users()->where('primary', 1)->first();
        $itemTable = 'posts';
      } else if ($type === 'comment') {
        $Target = Comment::findOrFail($item_id);
        $TargetUser = $Target->user();
        $itemTable = 'comments';
      } else {
        throw new Exception('Missing Target In Report!');
      }
      if ($Reporter->reports()->where('reported_item_id', $itemId)->exists()) {
        $unreported = $Reporter->malpractices()->where('reported_item_id', '=', $itemId)->detach($TargetUser);
      } else {
        $Reporter->withReport(
          $TargetUser,
          ['reported_item_id' => $itemId, 'reported_item_table' => $itemTable],
          ['target' => $TargetUser, 'item_id' => $itemId, 'item_table' => $itemTable]
        );
        $reported = $Reporter->push();
      }
      return response()->json(['reported' => $reported, 'unreported' => $unreported], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

}
