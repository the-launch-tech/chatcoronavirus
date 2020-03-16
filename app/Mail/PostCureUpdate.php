<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class PostCureUpdate extends Mailable {
  use Queueable, SerializesModels;

  public $data;

  public function __construct(array $data) {
    $this->cured_post = $data['cured_post'];
    $this->post_author = $data['post_author'];
    $this->post_curer = $data['post_curer'];
  }

  public function build() {
    return $this->view('emails.post_cure_update')
      ->from(config('mail.from.address'), config('mail.from.name'))
      ->cc(config('mail.from.address'), config('mail.from.name'))
      ->bcc(config('mail.from.address'), config('mail.from.name'))
      ->replyTo(config('mail.from.address'), config('mail.from.name'))
      ->subject(config('mail.subject.post_cure_update'))
      ->with(['cured_post' => $this->cured_post, 'post_author' => $this->post_author, 'post_curer' => $this->post_curer]);
  }
}
