<?php

namespace App;

use Str;
use File;
use Exception;
use Debugbar;
use Purify;
use Carbon\Carbon;
use App\User;
use App\Format;
use App\Topic;
use App\Realm;
use App\Utils\Helpers;
use App\Services\ExcerptExtractor;
use App\Services\ImageUploader;
use App\Traits\UsesUuid;
use App\Traits\FullTextSearch;
use Illuminate\Database\Eloquent\Model;

class Post extends Model {

  const FORMATS = [
    'articles' => 'article',
    'threads' => 'thread',
    'resources' => 'resource',
    'chats' => 'chat'
  ];

  protected $searchable = [
    'title',
    'excerpt',
    'content'
  ];

  use UsesUuid, FullTextSearch;

  protected $table = 'posts';

  protected $fillable = ['title', 'slug', 'excerpt', 'content', 'featured_image', 'views', 'format_id', 'user_id', 'chat_id'];

  public function format() {
    return $this->belongsTo('App\Format');
  }

  public function chat() {
    return $this->belongsTo('App\Post', 'chat_id', 'id');
  }

  public function chats() {
    return $this->hasMany('App\Post', 'chat_id', 'id');
  }

  public function comments() {
    return $this->hasMany('App\Comment');
  }

  public function user() {
    return $this->belongsTo('App\User');
  }

  public function topics() {
    return $this->belongsToMany(
      'App\Topic',
      'topic_post',
      'post_id',
      'topic_id'
      )
      ->as('topic');
  }

  public function realms() {
    return $this->belongsToMany(
      'App\Realm',
      'realm_post',
      'post_id',
      'realm_id'
      )
      ->as('realm');
  }

  public function pins() {
    return $this->belongsToMany(
      'App\User',
      'pins',
      'post_id',
      'user_id'
      )
      ->as('pin');
  }

  public function cures() {
    return $this->belongsToMany(
      'App\User',
      'cures',
      'post_id',
      'user_id'
      )
      ->as('cure');
  }

  public function getId() {
    return $this->id;
  }

  public function getTitle() {
    return $this->title;
  }

  public function getSlug() {
    return $this->slug;
  }

  public function getExcerpt() {
    return $this->excerpt;
  }

  public function getContent() {
    return $this->content;
  }

  public function getFeaturedImage() {
    return $this->featured_image;
  }

  public function getImageForUploader() {
    return $this->featured_image;
  }

  public function getViews() {
    return $this->views;
  }

  public function getRole() {
    return $this->role;
  }

  public function getContentAttribute($value) {
    return Purify::clean($value);
  }

  public function getExcerptAttribute($value) {
    return Purify::clean($value);
  }

  public function withFormat(Format $Format) {
    $this->format()->associate($Format);
    return $this;
  }

  public function withUser(User $User) {
    $this->user()->associate($User);
    return $this;
  }

  public function withTopic(Topic $Topic) {
    $this->topics()->attach($Topic);
    return $this;
  }

  public function withRealm(Realm $Realm) {
    $this->realms()->attach($Realm);
    return $this;
  }

  public function setTitle(array $params, bool $edit = false) : self {
    if (array_key_exists('title', $params)) {
      $this->title = !$edit || $this->title !== $params['title'] ?
        Str::title($params['title']) :
        $this->title;
    }
    return $this;
  }

  public function slugFromTitle(bool $edit = false) : self {
    $newSlug = str_replace(' ', '-', strtolower(trim($this->getTitle())));
    $this->slug = !$edit || $this->slug !== $newSlug ?
      Str::slug($newSlug) :
      $this->slug;
    return $this;
  }

  public function setContent(array $params, bool $edit = false) : self {
    if (array_key_exists('content', $params)) {
      $this->content = $params['content'];
    }
    return $this;
  }

  public function setExcerpt(array $params, bool $edit = false) : self {
    if (array_key_exists('excerpt', $params)) {
      $this->excerpt = !$edit || $this->excerpt !== $params['excerpt'] ?
        $params['excerpt'] :
        Str::limit($this->excerpt, 100, '...');
    } else {
      $Extractor = new ExcerptExtractor($params['content']);
      $Extractor->findExcerpt();
      if ($Extractor->hasExcerpt()) {
        $this->excerpt = $Extractor->getExcerpt();
      }
    }
    return $this;
  }

  public function associateFormat(string $format) : self {
    $Format = Format::bySlug(self::FORMATS[$format]);
    $this->withFormat($Format);
    return $this;
  }

  public function associateUser($user_id, bool $edit = false) : self {
    $User = User::findOrFail($user_id);
    $this->withUser($User);
    return $this;
  }

  public function setFeaturedImage(string $format, $file, bool $edit = false) : self {
    if ($file) {
      $uploader = new ImageUploader([
        'file' => $file,
        'edit' => $edit,
        'prefix' => $format,
        'width' => 1200,
        'height' => 400,
        'compress' => true,
        'resize' => true,
        'model' => $this
      ]);
      $this->featured_image = $uploader
        ->upload()
        ->resize()
        ->compress()
        ->getFilename();
    } else {
      $this->featured_image = Helpers::getDefaultImage('article', 1, 7);
    }
    return $this;
  }

  public function attachRealms(array $params, bool $edit = false) : self {
    if (array_key_exists('realms', $params)) {
      if ($edit) {
        foreach ($this->realms as $oldRealm) {
          $this->realms()->detach($oldRealm);
        }
      }
      foreach (explode(',', $params['realms']) as $slug) {
        $Realm = Realm::bySlug($slug);
        if ($Realm) {
          $this->withRealm($Realm);
        }
      }
    }
    return $this;
  }

  public function attachTopics(array $params, bool $edit = false) : self {
    if (array_key_exists('topics', $params)) {
      if ($edit) {
        foreach ($this->topics as $oldTopic) {
          $this->topics()->detach($oldTopic);
        }
      }
      if (count(explode(',', $params['topics'])) > 0) {
        foreach (explode(',', $params['topics']) as $slug) {
          if (strlen($slug) > 0) {
            $Topic = Topic::bySlug($slug);
            if ($Topic) {
              $this->withTopic($Topic);
            }
          }
        }
      }
    }
    return $this;
  }

  public static function getPosts(array $args = []) {
    $Format = Format::bySlug(self::FORMATS[$args['format']]);

    $query = self::where('format_id', $Format->getId());

    if (array_key_exists('user_id', $args)) {
      $query->where('user_id', $args['user_id']);
    }

    if (array_key_exists('with', $args)) {
      $query->with($args['with']);
    }

    $query->withCount('cures');
    $query->withCount('comments');

    if (array_key_exists('select', $args)) {
      $query->select($args['select']);
    }

    $posts = $query->get();

    return $posts;
  }

  public static function getPost(array $args = []) {
    $Format = Format::bySlug(self::FORMATS[$args['format']]);

    $query = self::where('format_id', $Format->getId());

    if (array_key_exists('user_id', $args)) {
      $query->where('user_id', $args['user_id']);
    }

    if (array_key_exists('slug', $args)) {
      $query->where('slug', $args['slug']);
    }

    if (array_key_exists('with', $args)) {
      $query->with($args['with']);
    }

    $query->withCount('cures');
    $query->withCount('comments');

    $post = $query->first();

    return $post;
  }

  public static function error(string $type) : string {
    return 'Error ' . $type . ' posts.';
  }

  public static function success(string $type) : string {
    return 'Success ' . $type . ' posts.';
  }

  public function handleDelete() {
    if ($this->featured_image && strpos($this->featured_image, 'default-post') !== true) {
      if (File::exists($this->featured_image)) {
        File::delete($this->featured_image);
      }
    }
    return $this->delete();
  }

  public function incrementView() {
    $this->views = $this->views += 1;
    return $this->save();
  }

  public static function maxPages($query, $posts_per_page) {
    return round($query->count() / $posts_per_page);
  }

  public function scopeWithRelations($query) {
    return $query
      ->withCount('comments')
      ->withCount('cures')
      ->withCount('pins')
      ->withCount('chats')
      ->with(['user' => function ($q) {
        $q->withCount('subscribers');
      }])
      ->with(['topics' => function ($q) {
        $q->select('slug', 'label');
      }])
      ->with(['realms' => function ($q) {
        $q->select('slug', 'label');
      }])
      ->with('format');
  }

  public function scopeWithPagination($query, int $paged, int $posts_per_page) {
    return $query
      ->skip($posts_per_page * $paged)
      ->take($posts_per_page);
  }

  public function scopeUserCured($query, User $User) {
    return $query->orWhereHas('cures', function ($q) use ($User) {
      $q->where('user_id', $User->getId());
    });
  }

  public function scopeUserPinned($query, User $User) {
    return $query->orWhereHas('pins', function ($q) use ($User) {
      $q->where('user_id', $User->getId());
    });
  }

  public function scopeUserAuthored($query, User $User) {
    return $query->where('user_id', $User->getId());
  }

  public function scopeUserAssociatedPosts($query, string $username) {
    $User = User::where('username', $username)->first();
    return $query
      ->userAuthored($User)
      ->userPinned($User);
  }

  public function scopeAuthSubscribed($query, $auth_id) {
    if ($auth_id) {
      $query->whereHas('user', function ($q) use ($auth_id) {
        $q->whereHas('subscribers', function ($q2) use ($auth_id) {
          $q2->where('subscriber_id', '=', $auth_id);
        });
      });
    }
    return $query;
  }

  public function scopeSearchOrder($query, $search, string $orderby, string $order) {
    if ($orderby === 'relevance' && $search) {
      return $query->relevance($order);
    } else if ($orderby === 'relevance') {
      return $query->orderBy('created_at', $order);
    } else {
      return $query->orderBy($orderby, $order);
    }
  }

  public function scopeWithCommentPreview($query, int $limit = 2) {
    return $query->with(['comments' => function ($q) use ($limit) {
      $q
        ->orderBy('created_at', 'DESC')
        ->where('comment_id', '=', null)
        ->with('user')
        ->limit($limit);
    }]);
  }

  public function scopeWhereRealmSlugIn($query, $realms) {
    if ($realms) {
      return $query->whereHas('realms', function ($q) use ($realms) {
        $q->whereIn('slug', '=', $realms);
      });
    }
    return $query;
  }

  public function scopeWhereRealmSlug($query, $slug) {
    if ($slug) {
      return $query->whereHas('realms', function ($q) use ($slug) {
        $q->where('slug', '=', $slug);
      });
    }
    return $query;
  }

  public function scopeWhereTopicSlugIn($query, $topics) {
    if ($topics) {
      return $query->whereHas('topics', function ($q) use ($topics) {
        $q->whereIn('slug', '=', $topics);
      });
    }
    return $query;
  }

  public function scopeWhereTopicSlug($query, $slug) {
    if ($slug) {
      return $query->whereHas('topics', function ($q) use ($slug) {
        $q->where('slug', '=', $slug);
      });
    }
    return $query;
  }

  public function scopeWhereFormatSlugIn($query, $formats) {
    if ($formats) {
      return $query->whereHas('format', function ($q) use ($formats) {
        $q->whereIn('slug', '=', $formats);
      });
    }
    return $query;
  }

  public function scopeWhereFormatSlug($query, $slug) {
    if ($slug) {
      return $query->whereHas('format', function ($q) use ($slug) {
        $q->where('slug', '=', $slug);
      });
    }
    return $query;
  }

  public function scopeCreatedCutoff($query, $since) {
    if ($since > 0) {
      return $query->where('created_at', '>', Carbon::now()->subHours($since));
    }
    return $query;
  }

  public function scopeByArchiveGroup($query, $type, $slug) {
    if ($type === 'format') {
      return $query->whereFormatSlug($slug);
    } elseif ($type === 'realm') {
      return $query->whereRealmSlug($slug);
    } elseif ($type === 'topic') {
      return $query->whereTopicSlug($slug);
    }
    return $query;
  }

}
