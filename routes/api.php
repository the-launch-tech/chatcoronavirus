<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' => ['throttle:100000']], function () {

  Route::group(['prefix' => 'threads'], function () {
    Route::get('/', 'PostsController@threads');
  });

  Route::group(['prefix' => 'articles'], function () {
    Route::get('/', 'PostsController@articles');
  });

  Route::group(['prefix' => 'resources'], function () {
    Route::get('/', 'PostsController@resources');
  });

  Route::group(['prefix' => 'formats'], function () {
    Route::get('/', 'FormatsController@formats');
  });

  Route::group(['prefix' => 'realms'], function () {
    Route::get('/', 'RealmsController@realms');
  });

  Route::group(['prefix' => 'users'], function () {
    Route::get('/', 'UsersController@users');
  });

  Route::group(['prefix' => 'posts'], function () {
    Route::get('/', 'PostsController@posts');
    Route::get('/trending', 'PostsController@trending');
    Route::get('/timeline', 'PostsController@timeline');
    Route::get('/pages', 'PostsController@maxPages');
    Route::get('/archive', 'PostsController@archive');
    Route::get('/search', 'PostsController@search');
    Route::get('/{format}/{slug}', 'PostsController@post');
    Route::put('/view/{post_id}', 'PostsController@view');
  });

  Route::group(['prefix' => 'topics'], function () {
    Route::get('/', 'TopicsController@topics');
    Route::get('/archive', 'TopicsController@archive');
    Route::get('/pages', 'TopicsController@maxPages');
  });

  Route::group(['prefix' => 'comments'], function () {
    Route::get('/', 'CommentsController@comments');
    Route::get('/{post_id}', 'CommentsController@postComments');
  });

  Route::group(['prefix' => 'socials'], function () {
    Route::put('/cures/{user_id}/{type}/{item_id}', 'UsersController@toggleCure');
    Route::put('/pins/{user_id}/{type}/{post_id}', 'UsersController@togglePin');
    Route::put('/subscriptions/{subscription_id}/{type}/{subscriber_id}', 'UsersController@toggleSubscription');
    Route::put('/reports/{user_id}/{type}/{item_id}', 'UsersController@toggleMalpractice');
  });

  Route::group(['prefix' => 'aux'], function () {
    Route::post('/{source}', 'AuxController@save');
    Route::get('/{source}', 'AuxController@get');
  });

  Route::group(['prefix' => 'auth'], function () {

    Route::post('register', 'AuthController@register');
    Route::post('login', 'AuthController@authenticate');
    Route::post('logout', 'AuthController@logout');

    Route::group(['prefix' => 'password'], function () {

      Route::post('email', 'AuthController@resetLink');
      Route::post('reset', 'AuthController@resetPassword');

    });

    Route::group(['middleware' => ['jwt.user']], function() {

      Route::get('refresh', 'AuthController@refresh');
      Route::get('user', 'AuthController@getAuthenticatedUser');
      Route::post('update', 'AuthController@updateProfile');

    });

  });

  Route::group(['middleware' => ['jwt.user']], function () {

    Route::group(['prefix' => 'topics'], function () {
      Route::post('/{user_id}', 'TopicsController@saveTopic');
      Route::get('/{user_id}', 'TopicsController@getUserTopics');
      Route::put('/{user_id}/{id}', 'TopicsController@editTopic');
      Route::delete('/{user_id}/{id}', 'TopicsController@deleteTopic');
      Route::get('/{user_id}/{slug}', 'PostsController@getUserTopic');
    });

    Route::group(['prefix' => 'comments'], function () {
      Route::post('/{post_id}/{user_id}', 'CommentsController@save');
      Route::put('/{post_id}/{user_id}/{id}', 'CommentsController@edit');
      Route::delete('/{post_id}/{user_id}/{id}', 'CommentsController@delete');
    });

    Route::post('/{format}/{user_id}', 'PostsController@savePost');
    Route::get('/{format}/{user_id}', 'PostsController@getUserPosts');
    Route::delete('/{format}/{user_id}/{id}', 'PostsController@deletePost');
    Route::get('/{format}/{user_id}/{slug}', 'PostsController@getUserPost');
    Route::post('/update/{format}/{user_id}/{id}', 'PostsController@editPost');

  });

});
