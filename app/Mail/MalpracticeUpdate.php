<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class MalpracticeUpdate extends Mailable {
  use Queueable, SerializesModels;

  public $data;

  public function __construct(array $data) {
    $this->target = $data['target'];
    $this->item_id = $data['item_id'];
    $this->item_table = $data['item_table'];
  }

  public function build() {
    return $this->view('emails.malpractice_update')
      ->from(config('mail.from.address'), config('mail.from.name'))
      ->cc(config('mail.from.address'), config('mail.from.name'))
      ->bcc(config('mail.from.address'), config('mail.from.name'))
      ->replyTo(config('mail.from.address'), config('mail.from.name'))
      ->subject(config('mail.subject.malpractice_update'))
      ->with(['target' => $this->target, 'item_id' => $this->item_id, 'item_table' => $this->item_table]);
  }
}
