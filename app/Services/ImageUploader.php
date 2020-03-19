<?php

namespace App\Services;

use Debugbar;
use Image;
use File;
use Carbon\Carbon;

class ImageUploader {
  public function __construct(array $params) {
    Debugbar::info('ImageUploader');
    $this->file = array_key_exists('file', $params) ? $params['file'] : false;
    $this->edit = array_key_exists('edit', $params) ? $params['edit'] : false;
    $this->compress = array_key_exists('compress', $params) ? $params['compress'] : false;
    $this->resize = array_key_exists('resize', $params) ? $params['resize'] : false;
    $this->model = array_key_exists('model', $params) ? $params['model'] : null;
    $this->width = array_key_exists('width', $params) ? $params['width'] : 150;
    $this->height = array_key_exists('height', $params) ? $params['height'] : 150;
    $this->prefix = array_key_exists('prefix', $params) ? $params['prefix'] : 'avatars';
    Debugbar::info($this);
  }

  public function upload() : self {
    Debugbar::info('upload');
    $this->originalname = Carbon::now()->format('YmdHHmmss') . '_' . $this->model->getId() . '.' . $this->file->getClientOriginalExtension();
    $this->thumbnailname = Carbon::now()->format('YmdHHmmss') . '_' . $this->model->getId() . '_thumbnail.' . $this->file->getClientOriginalExtension();
    $this->fullOriginalPath = public_path('storage/' . $this->prefix . '/' . $this->originalname);
    $this->fullThumbnailPath = public_path('storage/' . $this->prefix . '/' . $this->thumbnailname);
    $this->file->storeAs($this->prefix, $this->originalname, ['disk' => 'public']);
    $this->file->storeAs($this->prefix, $this->thumbnailname, ['disk' => 'public']);
    Debugbar::info($this);
    return $this;
  }

  public function compress() : self {
    Debugbar::info('compress');
    $filepath = $this->resize ? $this->fullThumbnailPath : $this->fullOriginalPath;
    $mime = mime_content_type($filepath);
    $output = new \CURLFile($filepath, $mime, $this->resize ? $this->thumbnailname : $this->originalname);
    $data = ["files" => $output];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'http://api.resmush.it/?qlty=60');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    $result = curl_exec($ch);
    if (curl_errno($ch)) {
        $result = curl_error($ch);
    }
    curl_close ($ch);
    $arr_result = json_decode($result);
    $ch = curl_init($arr_result->dest);
    $fp = fopen($filepath, 'wb');
    curl_setopt($ch, CURLOPT_FILE, $fp);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_exec($ch);
    curl_close($ch);
    fclose($fp);
    return $this;
  }

  public function resize() : self {
    Debugbar::info('resize');
    $this->resizedImage = Image::make($this->fullThumbnailPath)
      ->resize($this->width, $this->height, function ($constraints) {
        $constraints->aspectRatio();
      })
      ->save($this->fullThumbnailPath);
    Debugbar::info('$this->resizedImage', $this->resizedImage);
    return $this;
  }

  public function getFilename() : string {
    Debugbar::info('getFilename');
    return $this->resize ? "{$this->prefix}/{$this->thumbnailname}" : "{$this->prefix}/{$this->originalname}";
  }

  public function unstoreFeaturedImage() : self {
    Debugbar::info('unstoreFeaturedImage');
    $path = $this->model->getImageForUploader();
    if ($path && File::exists($path)) {
      File::delete($path);
    }
    return $this;
  }
}
