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
    'resources' => 'resource'
  ];

  protected $searchable = [
    'title',
    'excerpt',
    'content'
  ];

  use UsesUuid, FullTextSearch;

  protected $table = 'posts';

  protected $fillable = ['title', 'slug', 'excerpt', 'content', 'featured_image', 'views', 'format_id'];

  public function format() {
    return $this->belongsTo('App\Format');
  }

  public function comments() {
    return $this->hasMany('App\Comment');
  }

  public function users() {
    return $this->belongsToMany(
      'App\User',
      'post_user',
      'post_id',
      'user_id'
      )
      ->as('user')
      ->withPivot(['primary']);
  }

  public function topics() {
    return $this->belongsToMany(
      'App\Topic',
      'topic_post',
      'post_id',
      'topic_id'
      )
      ->as('topic')
      ->withPivot(['primary']);
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
      ->as('pin')
      ->withPivot(['email_updates']);
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

  public function withUser(User $User, bool $primary) {
    $this->users()->attach($User, ['primary' => $primary]);
    return $this;
  }

  public function withTopic(Topic $Topic, bool $primary = false) {
    $this->topics()->attach($Topic, ['primary' => $primary]);
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
    Debugbar::info($params);
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

  public function attachUser($user_id, bool $edit = false) : self {
    $User = User::findOrFail($user_id);
    if ($edit && $User) {
      $this->withUser($User, false);
    } else if ($User) {
      $this->withUser($User, true);
    }
    return $this;
  }

  public static function getPosts(array $args = []) {
    $Format = Format::bySlug(self::FORMATS[$args['format']]);

    $query = self::where('format_id', $Format->getId());

    if (array_key_exists('user_id', $args)) {
      $query->whereHas('users', function ($q) use ($args) {
        $q->where('user_id', $args['user_id']);
      });
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
      $query->whereHas('users', function ($q) use ($args) {
        $q->where('user_id', $args['user_id']);
      });
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

}
