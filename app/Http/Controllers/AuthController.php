<?php

namespace App\Http\Controllers;

use Str;
use URL;
use Hash;
use Mail;
use Crypt;
use JWTAuth;
use Carbon\Carbon;
use Exception;
use App\User;
use App\Mail\ResetLink;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller {
  public function authenticate(Request $request) {
    $credentials = $request->only('email', 'password');

    try {
      if (!$token = JWTAuth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
      }
    } catch (JWTException $e) {
      return response()->json(['message' => 'Could not create token!'], 500);
    }

    return response()->json(compact('token'));
  }

  public function register(Request $request) {
    $validator = Validator::make($request->only('username', 'email', 'password', 'password_confirmation'), [
      'username' => 'required|string|min:4|max:70|unique:users',
      'email' => 'required|string|email|max:70|unique:users',
      'password' => 'required|string|min:4|max:70|confirmed',
    ]);

    if ($validator->fails()) {
      $errors = [];
      foreach (json_decode($validator->errors()->toJson(), true) as $value) {
        if (is_array($value)) {
          $errors[] = $value[0];
        }
      }
      return response()->json(['message' => implode(', ', $errors)], 400);
    }

    function getAccess($email) {
      if (User::where('access', 2)->count() < 1000) {
        return [2, 'Doctor'];
      } else if (in_array($email, config('app.vip_users'))) {
        return [3, 'Medical Official'];
      } else {
        return [1, 'Nurse'];
      }
    }

    $email = $request->get('email');

    $access = getAccess($email);

    $user = User::create([
      'username' => $request->get('username'),
      'email' => $request->get('email'),
      'password' => Hash::make($request->get('password')),
      'access' => $access[0],
      'avatar' => 'avatars/default-avatar-1.png',
      'banner' => 'banners/default-banner-1.jpg',
      'role' => $access[1]
    ]);

    return response()->json(['status' => 'Success creating user!'], 201);
  }

  public function getAuthenticatedUser() {
  	try {
  		if (!$auth = JWTAuth::parseToken()->authenticate()) {
  			return response()->json(['message' => 'User not found!'], 404);
  		}
  	} catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
  		return response()->json(['message' => 'Token expired!'], $e->getStatusCode());
  	} catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
  		return response()->json(['message' => 'Token invalid!'], $e->getStatusCode());
  	} catch (Tymon\JWTAuth\Exceptions\JWTException $e) {
  		return response()->json(['message' => 'Token absent!'], $e->getStatusCode());
  	}
    $auth = User::where('id', $auth->getId())
      ->with('subscriptions')
      ->with('subscribers')
      ->with('pins')
      ->with('postCures')
      ->with('commentCures')
      ->with('reports')
      ->with('malpractices')
      ->first();

    $auth->health_points = $auth->health_points + 1;
    $auth->save();

  	return response()->json(compact('auth'), 200);
  }

  public function resetLink(Request $request) {
    $credentials = $request->only('email');

    $User = User::where('email', $credentials['email'])->first();

    Mail::to($credentials['email'])->send(new ResetLink([
      'reset_link' => URL::to('/reset-password?token=' . Crypt::encryptString($User->getId()) . '&email=' . $credentials['email'])
    ]));

  	return response()->json(['message' => 'Success sending email'], 200);
  }

  public function resetPassword(Request $request) {
    $credentials = $request->only('email', 'password', 'token');

    $User = User::where('email', $credentials['email'])->first();

    if (Crypt::decryptString($credentials['token']) === $User->getId()) {
      $User->password = Hash::make($credentials['password']);
      $saved = $User->save();
      if ($saved) {
        return response()->json(['message' => 'Password reset!'], 200);
      } else {
        return response()->json(['message' => 'Unable to update password!'], 500);
      }
    } else {
      return response()->json(['message' => 'Invalid token!'], 403);
    }
  }

  public function updateProfile(Request $request) {
    $credentials = $request->only(
      'email',
      'password',
      'country',
      'state',
      'subscriber_updates',
      'malpractice_updates',
      'pin_updates',
      'post_cure_updates',
      'comment_cure_updates',
      'chat_updates',
      'at_updates'
    );
    $avatarFile = $request->file('avatar');
    $bannerFile = $request->file('banner');
    try {
      $auth = User::where('email', $credentials['email'])->first();
      $auth->setAvatar($avatarFile, true);
      $auth->setBanner($bannerFile, true);
      if ($credentials['email'] !== $auth->getEmail()) {
        $auth->email = $credentials['email'];
      }
      if ($credentials['password']) {
        $auth->password = $credentials['password'];
      }
      if ($credentials['country'] && $credentials['country'] !== $auth->getCountry()) {
        $auth->country = Str::title($credentials['country']);
      }
      if ($credentials['state'] && Str::title($credentials['state']) !== 'Null' && $credentials['state'] !== $auth->getState()) {
        $auth->state = Str::title($credentials['state']);
      }
      if ($credentials['subscriber_updates'] !== $auth->subscriber_updates) {
        $auth->subscriber_updates = $credentials['subscriber_updates'] === "true" || $credentials['subscriber_updates'] === "1" ? 1 : 0;
      }
      if ($credentials['malpractice_updates'] !== $auth->malpractice_updates) {
        $auth->malpractice_updates = $credentials['malpractice_updates'] === "true" || $credentials['malpractice_updates'] === "1" ? 1 : 0;
      }
      if ($credentials['pin_updates'] !== $auth->pin_updates) {
        $auth->pin_updates = $credentials['pin_updates'] === "true" || $credentials['pin_updates'] === "1" ? 1 : 0;
      }
      if ($credentials['post_cure_updates'] !== $auth->post_cure_updates) {
        $auth->post_cure_updates = $credentials['post_cure_updates'] === "true" || $credentials['post_cure_updates'] === "1" ? 1 : 0;
      }
      if ($credentials['comment_cure_updates'] !== $auth->comment_cure_updates) {
        $auth->comment_cure_updates = $credentials['comment_cure_updates'] === "true" || $credentials['comment_cure_updates'] === "1" ? 1 : 0;
      }
      if ($credentials['chat_updates'] !== $auth->chat_updates) {
        $auth->chat_updates = $credentials['chat_updates'] === "true" || $credentials['chat_updates'] === "1" ? 1 : 0;
      }
      if ($credentials['at_updates'] !== $auth->at_updates) {
        $auth->at_updates = $credentials['at_updates'] === "true" || $credentials['at_updates'] === "1" ? 1 : 0;
      }
      $auth->health_points = $auth->health_points + 1;
      $saved = $auth->save();
      if ($saved) {
        return response()->json(compact('auth'), 200);
      } else {
        return response()->json(['message' => 'Could not update profile!'], 500);
      }
    } catch (Exception $e) {
      return response()->json(['message' => 'Could not update profile!'], 500);
    }
  }

  public function logout(Request $request) {
    try {
      $token = JWTAuth::getToken();
      if ($token) {
        JWTAuth::invalidate($token);
      }
    } catch (Exception $e) {
      return response()->json(['message' => $e->getMessage()], 500);
    }
  }
}
