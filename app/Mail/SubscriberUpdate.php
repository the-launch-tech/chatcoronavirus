<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SubscriberUpdate extends Mailable {

  use Queueable, SerializesModels;

  public $data;

  public function __construct(array $data) {
    $this->subscriber = $data['subscriber'];
    $this->subscription = $data['subscription'];
  }

  public function build() {
    return $this->view('emails.subscriber_update')
      ->from(config('mail.from.address'), config('mail.from.name'))
      ->cc(config('mail.from.address'), config('mail.from.name'))
      ->bcc(config('mail.from.address'), config('mail.from.name'))
      ->replyTo(config('mail.from.address'), config('mail.from.name'))
      ->subject(config('mail.subject.subscriber_update'))
      ->with(['subscriber' => $this->subscriber, 'subscription' => $this->subscription]);
  }

}
