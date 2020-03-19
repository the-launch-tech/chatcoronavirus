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

  public static function error(string $type) : string {
    return 'Error ' . $type . ' posts.';
  }

  public static function success(string $type) : string {
    return 'Success ' . $type . ' posts.';
  }

  public function savePost(Request $request, string $format, string $user_id) {
    $params = $request->all();
    $file = $request->file('featured_image');
    try {
      $post = new Post();
      $saved = $post
        ->setTitle($params)
        ->slugFromTitle()
        ->setContent($params)
        ->associateFormat($format)
        ->setExcerpt($params)
        ->setFeaturedImage($format, $file, false)
        ->push();
      if ($saved) {
        $resaved = $post
          ->attachRealms($params)
          ->attachTopics($params)
          ->attachUser($user_id)
          ->push();
        User::incrementHealthPoints($user_id);
        if ($resaved) {
          return response()->json(['message' => self::success('saving')], 200);
        } else {
          $post->delete();
          throw new Error();
        }
      } else {
        throw new Error();
      }
    } catch (Exception $e) {
      return response()->json(['message' => self::error('saving')], 500);
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
          ->attachUser($user_id, true)
          ->push();
        User::incrementHealthPoints($user_id);
        if ($resaved) {
          return response()->json(['message' => self::success('updating')], 200);
        } else {
          throw new Exception('Unable To Save');
        }
      } else {
        throw new Exception('Unable To Save');
      }
    } catch (Exception $e) {
      return response()->json(['message' => self::error('updating')], 500);
    }
  }

  public function deletePost(Request $request, string $format, string $user_id, string $id) {
    try {
      $post = Post::findOrFail($id);
      if ($post->featured_image && strpos($post->featured_image, 'default-post') !== true) {
        if (File::exists($post->featured_image)) {
          File::delete($post->featured_image);
        }
      }
      $deleted = $post->delete();
      User::incrementHealthPoints($user_id);
      if ($deleted) {
        return response()->json(['message' => self::success('deleting')], 200);
      } else {
        throw new Error();
      }
    } catch (Exception $e) {
      return response()->json(['message' => self::error('deleting')], 500);
    }
  }

  public function posts(Request $request) {
    $params = $request->all();
    try {
      $posts = Post::with(['users' => function ($q) {
          $q->where('primary', 1)->withCount('subscribers');
        }])
        ->with('format')
        ->with(['realms' => function ($q) {
          $q->select('label', 'slug');
        }])->with(['topics' => function ($q) {
          $q->select('label', 'slug');
        }])
        ->with(['comments' => function ($q) {
          $q
            ->orderBy('created_at', 'DESC')
            ->where('comment_id', '=', null)
            ->with('user')
            ->limit(2);
        }])
        ->withCount('cures')
        ->withCount('comments')
        ->withCount('pins')
        ->limit($params['limit'])
        ->orderBy($params['orderby'], 'DESC')
        ->get();
      return response()->json(compact('posts'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function timeline(Request $request) {
    $params = $request->all();
    try {
      $posts_per_page = (int)$params['posts_per_page'];
      $paged = (int)$params['paged'];

      $query = Post::with(['users' => function ($q) {
          $q->where('primary', 1)->withCount('subscribers');
        }]);

      $total = round($query->count() / $posts_per_page);

      $posts = $query
        ->with('format')
        ->with(['realms' => function ($q) {
          $q->select('label', 'slug');
        }])->with(['topics' => function ($q) {
          $q->select('label', 'slug');
        }])
        ->withCount('cures')
        ->withCount('comments')
        ->withCount('pins')
        ->with(['comments' => function ($q) {
          $q
            ->orderBy('created_at', 'DESC')
            ->where('comment_id', '=', null)
            ->with('user')
            ->limit(2);
        }])
        ->skip($paged * $posts_per_page)
        ->take($posts_per_page)
        ->orderBy($params['orderby'], 'DESC')
        ->get();
      return response()->json(['posts' => $posts, 'total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function trending(Request $request) {
    $params = $request->only('limit', 'formats', 'trending_time');

    $trendCap = Carbon::now()->subDays($params['trending_time']);
    $formats = $params['formats'];
    $limit = $params['limit'];

      try {
        $posts = Post::with(['format' => function ($q) use ($formats) {
            $q->whereIn('slug', $formats);
          }])
          ->with(['comments' => function ($q) use ($trendCap) {
            $q->where('created_at', '>', $trendCap);
          }])
          ->with(['cures' => function ($q) use ($trendCap) {
            $q->where('cures.created_at', '>', $trendCap);
          }])
          ->with(['pins' => function ($q) use ($trendCap) {
            $q->where('pins.created_at', '>', $trendCap);
          }])
          ->with(['users' => function ($q) {
            $q->where('primary', 1)->select('username', 'avatar');
          }])
          ->withCount('comments')
          ->withCount('cures')
          ->withCount('pins')
          ->orderBy('comments_count', 'DESC')
          ->orderBy('cures_count', 'DESC')
          ->orderBy('pins_count', 'DESC')
          ->orderBy('views', 'DESC')
          ->limit($limit)
          ->get();
        return response()->json(compact('posts'), 200);
      } catch (Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
      }
  }

  public function archive(Request $request) {
    $params = $request->all();

    if ($params['type'] === 'format') {
      $query = Post::where('format_id', Format::where('slug', $params['slug'])->first()->getId());
    } elseif ($params['type'] === 'realm') {
      $query = Post::whereHas('realms', function ($q) use ($params) {
        $q->where('slug', '=', $params['slug']);
      });
    } elseif ($params['type'] === 'topic') {
      $query = Post::whereHas('topics', function ($q) use ($params) {
        $q->where('slug', $params['slug']);
      });
    }

    $total = round($query->count() / (int)$params['posts_per_page']);

    try {
      $posts = $query
        ->with('format')
        ->with(['users' => function ($q) {
          $q->where('primary', 1)->withCount('subscribers');
        }])
        ->with(['topics' => function ($q) {
          $q->select('label', 'slug');
        }])
        ->with(['realms' => function ($q) {
          $q->select('label', 'slug');
        }])
        ->with(['comments' => function ($q) {
          $q
            ->orderBy('created_at', 'DESC')
            ->where('comment_id', '=', null)
            ->with('user')
            ->limit(3);
        }])
        ->withCount('cures')
        ->withCount('comments')
        ->withCount('pins')
        ->skip(((int)$params['paged']) * (int)$params['posts_per_page'])
        ->take((int)$params['posts_per_page'])
        ->orderBy($params['orderby'], 'DESC')
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

      $query = Post::selectRelevance($search);

      Debugbar::info($relevance_cutoff);

      $query->search($search, $relevance_cutoff);

      $searchPosts = $query->get();

      Debugbar::info($searchPosts);

      if ($since > 0) {
        $query->where('created_at', '>', Carbon::now()->subHours($since));
      }

      if ($formats) {
        $query->whereIn('format_id', Format::whereIn('slug', $formats)->select('id')->get());
      }

      if ($realms) {
        $query->whereHas('realms', function ($q) use ($realms) {
          $q->whereIn('slug', '=', $realms);
        });
      }

      $total = round($query->count() / $posts_per_page);

      $query
        ->with('format')
        ->with(['users' => function ($q) {
          $q->where('primary', 1)->withCount('subscribers');
        }])
        ->with(['topics' => function ($q) {
          $q->select('label', 'slug');
        }])
        ->with(['realms' => function ($q) {
          $q->select('label', 'slug');
        }])
        ->with(['comments' => function ($q) {
          $q
            ->orderBy('created_at', 'DESC')
            ->where('comment_id', '=', null)
            ->with('user')
            ->limit(2);
        }])
        ->withCount('cures')
        ->withCount('pins')
        ->withCount('comments');

      $query
        ->skip($paged * $posts_per_page)
        ->limit($posts_per_page);

      if ($orderby === 'relevance' && $search) {
        $query->relevance($order);
      } else if ($orderby === 'relevance') {
        $query->orderBy('created_at', $order);
      } else {
        $query->orderBy($orderby, $order);
      }

      $posts = $query->get();

      Debugbar::info($posts);

      return response()->json(['posts' => $posts, 'total' => $total], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function post(Request $request, string $format, string $slug) {
    try {
      $post = Post::where('format_id', '=', Format::where('slug', $format)->first()->getId())
        ->where('slug', '=', $slug)
        ->withCount('comments')
        ->withCount('cures')
        ->withCount('pins')
        ->with(['realms' => function ($q) {
          $q->select('label', 'slug', 'description');
        }])
        ->with(['topics' => function ($q) {
          $q->select('label', 'slug', 'description');
        }])
        ->with('format')
        ->with(['users' => function ($q) {
          $q->where('primary', 1)->withCount('subscribers');
        }])
        ->first();
      return response()->json(compact('post'), 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

  public function view(Request $request, string $post_id) {
    try {
      $post = Post::find($post_id);
      $post->views = $post->views += 1;
      $saved = $post->save();
      User::incrementHealthPoints($post->users()->where('primary', 1)->first()->getId());
      return response()->json(['saved' => $saved], 200);
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }

}
