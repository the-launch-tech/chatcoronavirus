<?php

return [

  /*
  |--------------------------------------------------------------------------
  | Laravel CORS
  |--------------------------------------------------------------------------
  |
  | allowedOrigins, allowedHeaders and allowedMethods can be set to array('*')
  | to accept any value.
  |
  */

  'supportsCredentials' => false,
  'allowedOrigins' => ['*'],
  'allowedOriginsPatterns' => ["*"],
  'allowedHeaders' => ['Access-Control-Allow-Origin'],
  'allowedMethods' => ["GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
  'exposedHeaders' => [],
  'maxAge' => 1000,

];
