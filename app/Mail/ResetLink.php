<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class ResetLink extends Mailable {
  use Queueable, SerializesModels;

  public $data;

  public function __construct($data) {
    $this->data = $data;
  }

  public function build() {
    return $this->view('emails.reset')
      ->from(config('mail.from.address'), config('mail.from.name'))
      ->cc(config('mail.from.address'), config('mail.from.name'))
      ->bcc(config('mail.from.address'), config('mail.from.name'))
      ->replyTo(config('mail.from.address'), config('mail.from.name'))
      ->subject(config('mail.subject.reset_link'))
      ->with(['reset_link' => $this->data['reset_link']]);
  }
}
