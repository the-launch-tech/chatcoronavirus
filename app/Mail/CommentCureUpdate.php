<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class CommentCureUpdate extends Mailable {

  use Queueable, SerializesModels;

  public $data;

  public function __construct(array $data) {
    $this->cured_comment = $data['cured_comment'];
    $this->comment_author = $data['comment_author'];
    $this->comment_curer = $data['comment_curer'];
  }

  public function build() {
    return $this->view('emails.comment_cure_update')
      ->from(config('mail.from.address'), config('mail.from.name'))
      ->cc(config('mail.from.address'), config('mail.from.name'))
      ->bcc(config('mail.from.address'), config('mail.from.name'))
      ->replyTo(config('mail.from.address'), config('mail.from.name'))
      ->subject(config('mail.subject.comment_cure_update'))
      ->with(['cured_comment' => $this->cured_comment, 'comment_author' => $this->comment_author, 'comment_curer' => $this->comment_curer]);
  }

}
