<?php

namespace App\Http\Controllers;

use DB;
use Str;
use File;
use Debugbar;
use Carbon\Carbon;
use App\Cure;
use App\Post;
use App\Format;
use App\User;
use App\Topic;
use App\Realm;
use Illuminate\Http\Request;

class PostsController extends Controller {

  public function savePost(Request $request, string $format, string $user_id) {
    $params = $request->all();
    $file = $request->file('featured_image');
    try {
      if ($format === 'chat') {
        $content = $params['content'];
        $User = User::find($user_id);
        $Format = Format::where('slug', $format)->first();
        $Chat = new Post();
        $Chat->title = Str::title($User->username . '_' . Carbon::now()->format('Y-M-D-H-m-s'));
        $Chat->slug = Str::slug($Chat->title);
        $Chat->content = $content;
        $Chat->withFormat($Format);
        $Chat->withUser($User);
        $saved = $Chat->save();
        if ($saved) {
          return response()
            ->json([
              'post' => Post::where('title', $Chat->title)
                ->withRelations()
                ->first()
          ], 200);
        } else {
          return response()->json(['message' => 'Chat save failed.'], 500);
        }
      } else {
        $post = new Post();
        $saved = $post
          ->setTitle($params)
          ->slugFromTitle()
          ->setContent($params)
          ->associateFormat($format)
          ->associateUser($user_id)
          ->setExcerpt($params)
          ->setFeaturedImage($format, $file, false)
          ->push();
        if ($saved) {
          $resaved = $post
            ->attachRealms($params)
            ->attachTopics($params)
            ->push();
          User::incrementHealthPoints($user_id);
          if ($resaved) {
            return response()->json(['message' => Post::success('saving')], 200);
          } else {
            $post->delete();
            throw new Error();
          }
        } else {
          throw new Error();
        }
      }
    } catch (Exception $e) {
      return response()->json(['message' => Post::error('saving')], 500);
    }
  }

  public function getUserPosts(Request $request, string $format, string $user_id) {
    try {
      $posts = Post::getPosts([
        'format' => Str::lower($format),
        'user_id' => (string)$user_id,
        'select' => ['title', 'excerpt', 'id', 'slug', 'created_at', 'views'],
        'with' => ['cures']
      ]);
      return response()->json(compact('posts'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function getUserPost(Request $request, string $format, string $user_id, string $slug) {
    try {
      $post = Post::getPost([
        'format' => Str::lower($format),
        'user_id' => (string)$user_id,
        'slug' => Str::slug($slug),
        'with' => ['cures', 'topics', 'realms']
      ]);
      return response()->json(compact('post'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function editPost(Request $request, string $format, string $user_id, string $id) {
    $params = $request->all();
    $file = $request->file('featured_image');
    try {
      $post = Post::findOrFail($id);
      $saved = $post
        ->setTitle($params, true)
        ->slugFromTitle(true)
        ->setContent($params, true)
        ->setExcerpt($params, true)
        ->setFeaturedImage($format, $file, true)
        ->push();
      if ($saved) {
        $resaved = $post
          ->attachRealms($params, true)
          ->attachTopics($params, true)
          ->push();
        User::incrementHealthPoints($user_id);
        if ($resaved) {
          return response()->json(['message' => Post::success('updating')], 200);
        } else {
          throw new Exception('Unable To Save');
        }
      } else {
        throw new Exception('Unable To Save');
      }
    } catch (Exception $e) {
      return response()->json(['message' => Post::error('updating')], 500);
    }
  }

  public function deletePost(Request $request, string $format, string $user_id, string $id) {
    try {
      $post = Post::findOrFail($id);
      $deleted = $post->handleDelete();
      User::incrementHealthPoints($user_id);
      if ($deleted) {
        return response()->json(['message' => Post::success('deleting')], 200);
      } else {
        throw new Error();
      }
    } catch (Exception $e) {
      return response()->json(['message' => Post::error('deleting')], 500);
    }
  }

  public function posts(Request $request) {
    $params = $request->all();
    try {
      $posts = Post::withRelations()
        ->withCommentPreview(2)
        ->limit($params['limit'])
        ->orderBy($params['orderby'], 'DESC')
        ->get();
      return response()->json(['posts' => $posts], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function publicTimeline(Request $request) {
    $params = $request->all();
    try {
      $posts_per_page = (int)$params['posts_per_page'];
      $paged = (int)$params['paged'];
      $orderby = $params['orderby'];
      $auth_id = $params['authId'];
      $type = $params['timeline_content'];
      $query = Post::withRelations();
      if ($auth_id && $type === 'personalized') {
        $query->authSubscribed($auth_id);
      }
      $total = Post::maxPages($query, $posts_per_page);
      $posts = $query
        ->withCommentPreview(2)
        ->withPagination($paged, $posts_per_page)
        ->orderBy($params['orderby'], 'DESC')
        ->get();
      return response()->json(['posts' => $posts, 'total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function trending(Request $request) {
    $params = $request->only('limit', 'formats', 'trending_time');
    try {
      $trendCap = Carbon::now()->subDays($params['trending_time']);
      $formats = $params['formats'];
      $limit = $params['limit'];
      $posts = Post::whereHas('format', function ($q) {
          $q->where('slug', '!=', 'chat');
        })
        ->with('format')
        ->with(['comments' => function ($q) use ($trendCap) {
          $q->where('created_at', '>', $trendCap);
        }])
        ->with(['cures' => function ($q) use ($trendCap) {
          $q->where('cures.created_at', '>', $trendCap);
        }])
        ->with(['pins' => function ($q) use ($trendCap) {
          $q->where('pins.created_at', '>', $trendCap);
        }])
        ->with(['user' => function ($q) {
          $q->select('username', 'avatar');
        }])
        ->withCount('cures')
        ->withCount('pins')
        ->withCount('comments')
        ->withCount('chats')
        ->orderBy('cures_count', 'DESC')
        ->orderBy('pins_count', 'DESC')
        ->orderBy('views', 'DESC')
        ->orderBy('comments_count', 'DESC')
        ->orderBy('chats_count', 'DESC')
        ->limit($limit)
        ->get();
      return response()->json(['posts' => $posts], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function archive(Request $request) {
    $params = $request->all();
    try {
      $paged = (int)$params['paged'];
      $posts_per_page = (int)$params['posts_per_page'];
      $orderby = $params['orderby'];
      $type = $params['type'];
      $slug = $params['slug'];
      $query = Post::byArchiveGroup($type, $slug);
      $total = Post::maxPages($query, $posts_per_page);
      $posts = $query
        ->withRelations()
        ->withCommentPreview(3)
        ->withPagination($paged, $posts_per_page)
        ->orderBy($orderby, 'DESC')
        ->get();
      return response()->json(['posts' => $posts, 'total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function search(Request $request) {
    $params = $request->all();
    try {
      $paged = (int)$params['paged'];
      $posts_per_page = (int)$params['posts_per_page'];
      $formats = array_key_exists('format', $params) ? $params['format'] : null;
      $realms = array_key_exists('realm', $params) ? $params['realm'] : null;
      $search = array_key_exists('search', $params) && strlen($params['search']) > 0 ? $params['search'] : null;
      $since = array_key_exists('since', $params) ? (int)$params['since'] : -1;
      $order = array_key_exists('order', $params) ? $params['order'] : 'DESC';
      $orderby = array_key_exists('orderby', $params) ? $params['orderby'] : 'relevance';
      $relevance_cutoff = array_key_exists('relevance_cutoff', $params) ? (int)$params['relevance_cutoff'] : 0;
      $query = Post::selectRelevance($search)
        ->search($search, $relevance_cutoff)
        ->createdCutoff($since)
        ->whereFormatSlugIn($formats)
        ->whereRealmSlugIn($realms);
      $total = Post::maxPages($query, $posts_per_page);
      $posts = $query
        ->withRelations()
        ->withCommentPreview()
        ->withPagination($paged, $posts_per_page)
        ->searchOrder($search, $orderby, $order)
        ->get();
      return response()->json(['posts' => $posts, 'total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function post(Request $request, string $format, string $slug) {
    try {
      $Format = Format::bySlug($format);
      $post = Post::where('format_id', '=', $Format->getId())
        ->where('slug', '=', $slug)
        ->withRelations()
        ->first();
      return response()->json(['post' => $post], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function view(Request $request, string $post_id) {
    try {
      $post = Post::findOrFail($post_id);
      $saved = $post->incrementView();
      User::incrementHealthPoints($post->user->getId());
      return response()->json(['saved' => $saved], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function profileTimeline(Request $request, string $username) {
    $params = $request->only('paged', 'posts_per_page');
    try {
      $posts_per_page = (int)$params['posts_per_page'];
      $paged = (int)$params['paged'];
      $query = Post::userAssociatedPosts($username);
      $total = Post::maxPages($query, $posts_per_page);
      $posts = $query
        ->withRelations()
        ->orderBy('created_at', 'DESC')
        ->withPagination($paged, $posts_per_page)
        ->get();
      return response()->json(['posts' => $posts, 'total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function expansion(Request $request, string $slug) {
    try {
      $post = Post::where('slug', '=', $slug)
        ->withRelations()
        ->first();
      return response()->json(['post' => $post], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }
}
