<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<h4>Hello, {{$target->username}}!</h4>
    <p>
      <i>{{$target->username}}</i>, you received a malpractice complaint at {{\Carbon\Carbon::now()->format('Y-m-d h:m:s')}}.
    </p>
    <p>The Complaint was registered on one of your {{ $item_table }}.</p>
    @if ($item_table === 'posts') :
      <p>
        The item in question was a post titled: <a href="https://chatcoronavirus.com/{{ \App\Post::find($item_id)->format()->slug }}s/{{ \App\Post::find($item_id)->getSlug() }}">{{ \App\Post::find($item_id)->getTitle() }}</a>
      </p>
    @else :
      <p>
        The item in question was a comment starting with: <a href="https://chatcoronavirus.com/{{ \App\Comment::find($item_id)->post()->format()->slug }}s/{{ \App\Comment::find($item_id)->post()->getSlug() }}">{{ strlen(\App\Comment::find($item_id)->getContent()) > 100 ? substr(\App\Comment::find($item_id)->getContent(), 0, 100) . "..." : \App\Comment::find($item_id)->getContent() }}</a>
      </p>
    @endif
    <p>If this was spam, or an a suspected error, please use the contact below.</p>
    <br>
    <span>Best Wishes,</span><br><span>Daniel Griffiths</span><br><span>daniel@thelaunch.tech</span><br><span>©2020 <a href="https://chatcoronavirus.com">ChatCoronavirus</a></span>
	</body>
</html>
