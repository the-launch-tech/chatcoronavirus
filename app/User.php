<?php

namespace App;

use Mail;
use App\Mail\SubscriberUpdate;
use App\Mail\MalpracticeUpdate;
use App\Mail\PinUpdate;
use App\Mail\PostCureUpdate;
use App\Mail\CommentCureUpdate;
use App\Services\ImageUploader;
use App\Traits\UsesUuid;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements JWTSubject {

  use UsesUuid, Notifiable;

  protected $table = 'users';

  const USER = 1;

  const SUPER = 2;

  const ADMIN = 3;

  protected $fillable = [
    'username', 'email', 'password', 'avatar', 'country', 'state', 'health_points', 'malpractices', 'access', 'role', 'banner'
  ];

  protected $hidden = [
    'password', 'remember_token',
  ];

  protected $casts = [
    'email_verified_at' => 'datetime',
  ];

  public function getJWTIdentifier() {
    return $this->getKey();
  }

  public function getJWTCustomClaims() {
    return [];
  }

  public function topics() {
    return $this->hasMany('App\Topic');
  }

  public function comments() {
    return $this->hasMany('App\Comment');
  }

  public function posts() {
    return $this->hasMany('App\Post');
  }

  public function pins() {
    return $this->belongsToMany(
      'App\Post',
      'pins',
      'user_id',
      'post_id'
      )
      ->as('pin');
  }

  public function postCures() {
    return $this->belongsToMany(
      'App\Post',
      'cures',
      'user_id',
      'post_id'
      )
      ->as('postCure');
  }

  public function commentCures() {
    return $this->belongsToMany(
      'App\Comment',
      'cures',
      'user_id',
      'cmt_id'
      )
      ->as('commentCure');
  }

  public function subscriptions() {
    return $this->belongsToMany(
      'App\User',
      'subscriptions',
      'subscriber_id',
      'subscription_id'
    )
    ->as('subscription');
  }

  public function subscribers() {
    return $this->belongsToMany(
      'App\User',
      'subscriptions',
      'subscription_id',
      'subscriber_id'
    )
    ->as('subscriber');
  }

  public function reports() {
    return $this->belongsToMany(
      'App\User',
      'malpractices',
      'reporter_id',
      'reported_id'
      )
      ->as('report')
      ->withPivot(['reported_item_id', 'reported_item_table']);
  }

  public function malpractices() {
    return $this->belongsToMany(
      'App\User',
      'malpractices',
      'reported_id',
      'reporter_id'
      )
      ->as('malpractice')
      ->withPivot(['reported_item_id', 'reported_item_table']);
  }

  public function withSubscriber(User $User) : self {
    if ($this->subscriber_updates) {
      Mail::to($this->getEmail())->send(new SubscriberUpdate(['subscriber' => $User, 'subscription' => $this]));
    }
    $this->subscribers()->attach($User);
    return $this;
  }

  public function withCommentCure(Comment $Comment) : self {
    $User = $Comment->user()->first();
    if ($User->comment_cure_updates) {
      Mail::to($User->getEmail())->send(new CommentCureUpdate(['cured_comment' => $Comment, 'comment_author' => $User, 'comment_curer' => $this]));
    }
    $this->commentCures()->attach($Comment);
    return $this;
  }

  public function withPostCure(Post $Post) : self {
    $User = $Post->user()->first();
    if ($User->post_cure_updates) {
      Mail::to($User->getEmail())->send(new PostCureUpdate(['cured_post' => $Post, 'post_author' => $User, 'post_curer' => $this]));
    }
    $this->postCures()->attach($Post);
    return $this;
  }

  public function withPin(Post $Post) : self {
    $User = $Post->user()->first();
    if ($User->pin_updates) {
      Mail::to($User->getEmail())->send(new PinUpdate(['pinned_post' => $Post, 'post_author' => $User, 'post_pinner' => $this]));
    }
    $this->pins()->attach($Post);
    return $this;
  }

  public function withReport(User $User, array $pivotAttrs = [], array $emailAttrs) : self {
    if ($User->malpractice_updates) {
      Mail::to($User->getEmail())->send(new MalpracticeUpdate($emailAttrs));
    }
    $this->reports()->attach($User, $pivotAttrs);
    return $this;
  }

  public function getId() {
    return $this->id;
  }

  public function getUsername() {
    return $this->username;
  }

  public function getEmail() {
    return $this->email;
  }

  public function getAvatar() {
    return $this->avatar;
  }

  public function getImageForUploader() {
    return $this->getAvatar();
  }

  public function getPassword() {
    return $this->password;
  }

  public function getCountry() {
    return $this->country;
  }

  public function getState() {
    return $this->state;
  }

  public function getHealthPoints() {
    return $this->health_points;
  }

  public function getMalpractices() {
    return $this->malpractices;
  }

  public function getAccess() {
    return $this->access;
  }

  public function getRole() {
    return $this->role;
  }

  public function isUser() : bool {
    return $this->access === self::USER;
  }

  public function isSuper() : bool {
    return $this->access === self::SUPER;
  }

  public function isAdmin() : bool {
    return $this->access === self::ADMIN;
  }

  public function superExists() : int {
    return self::where('access', self::SUPER)->count();
  }

  public function adminExists() : int {
    return self::where('access', self::ADMIN)->count();
  }

  public function setAccess(int $access) : self {
    $this->access = $access;
    return $this;
  }

  public function setRoll(int $access) : self {
    if ($this->isUser()) {
      $this->role = 'Nurse';
    } elseif ($this->isSuper()) {
      $this->role = 'Doctor';
    } else if ($this->isAdmin()) {
      $this->role = 'Medical Official';
    } else {
      $this->role = 'Patient';
    }
    return $this;
  }

  public function createSuper(User $User) : self {
    $User->setAccess(self::SUPER);
    $User->save();
    return $User;
  }

  public function createAdmin(User $User) : self {
    if ($this->adminExists() < 3) {
      $User->setAccess(self::ADMIN);
    }
    $User->save();
    return $User;
  }

  public function setAvatar($file, bool $edit = false) : self {
    if ($file) {
      $uploader = new ImageUploader([
        'file' => $file,
        'prefix' => 'avatars',
        'edit' => $edit,
        'width' => 100,
        'height' => 100,
        'compress' => true,
        'resize' => true,
        'model' => $this
      ]);
      if ($edit) {
        $uploader->unstoreFeaturedImage();
      }
      $this->avatar = $uploader
        ->upload()
        ->resize()
        ->compress()
        ->getFilename();
    } elseif (!$this->avatar) {
      $this->avatar = 'avatars/default-avatar-1.png';
    }
    return $this;
  }

  public function setBanner($file, bool $edit = false) : self {
    if ($file) {
      $uploader = new ImageUploader([
        'file' => $file,
        'prefix' => 'banners',
        'edit' => $edit,
        'width' => 1200,
        'height' => 400,
        'compress' => true,
        'resize' => true,
        'model' => $this
      ]);
      $this->banner = $uploader
        ->upload()
        ->resize()
        ->compress()
        ->getFilename();
    } elseif (!$this->banner) {
      $this->banner = 'banners/default-banner-1.jpg';
    }
    return $this;
  }

  public static function incrementHealthPoints(string $id, int $inc = 1) : void {
    $User = User::find($id);
    $User->health_points = $User->health_points + $inc;
    $User->save();
  }
}
