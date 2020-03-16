<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;
use Debugbar;
use App\User;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class JwtSelf extends BaseMiddleware {
  public function handle($request, Closure $next) {
    Debugbar::info($request, $request->route(), $request->route()->parameter('user_id'), $request->route()->parameter('id'));
    $requestedUserId = $request->route()->parameter('user_id');
    Debugbar::info(User::find($requestedUserId));
    Debugbar::info($requestedUserId);
    $token = JWTAuth::parseToken();
    Debugbar::info($token);
    $u = JWTAuth::toUser($token);
    Debugbar::info($u);

    try {
      $user = JWTAuth::parseToken()->authenticate();
      Debugbar::info('$user', $user, $user->getId());
    } catch (Exception $e) {
      Debugbar::info('$e', $e->getMessage());
      if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
        return response()->json(['status' => 'Token is Invalid'], 403);
      } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
        return response()->json(['status' => 'Token is Expired'], 403);
      } else {
        return response()->json(['status' => 'Authorization Token not found'], 403);
      }
    }

    if ($requestedUserId && $user->getId() === $requestedUserId) {
      return $next($request);
    } else {
      return response()->json(['error' => 'Unauthorized'], 403);
    }
  }
}
