<?php

namespace App\Http\Middleware;

use Closure;
use JWTAuth;
use Exception;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

class JwtSuper extends BaseMiddleware {
  public function handle($request, Closure $next) {
    try {
      $user = JWTAuth::parseToken()->authenticate();
    } catch (Exception $e) {
      if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenInvalidException) {
        return response()->json(['status' => 'Token is Invalid'], 403);
      } else if ($e instanceof \Tymon\JWTAuth\Exceptions\TokenExpiredException) {
        return response()->json(['status' => 'Token is Expired'], 403);
      } else {
        return response()->json(['status' => 'Authorization Token not found'], 403);
      }
    }

    if ($user->isSuper() || $user->isAdmin()) {
      return $next($request);
    } else {
      return response()->json(['error' => 'Unauthorized'], 403);
    }
  }
}
