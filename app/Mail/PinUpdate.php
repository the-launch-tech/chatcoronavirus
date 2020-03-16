<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class PinUpdate extends Mailable {
  use Queueable, SerializesModels;

  public $data;

  public function __construct(array $data) {
    $this->pinned_post = $data['pinned_post'];
    $this->post_author = $data['post_author'];
    $this->post_pinner = $data['post_pinner'];
  }

  public function build() {
    return $this->view('emails.pin_update')
      ->from(config('mail.from.address'), config('mail.from.name'))
      ->cc(config('mail.from.address'), config('mail.from.name'))
      ->bcc(config('mail.from.address'), config('mail.from.name'))
      ->replyTo(config('mail.from.address'), config('mail.from.name'))
      ->subject(config('mail.subject.pin_update'))
      ->with(['pinned_post' => $this->pinned_post, 'post_author' => $this->post_author, 'post_pinner' => $this->post_pinner]);
  }
}
