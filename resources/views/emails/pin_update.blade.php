<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<h4>Hello, {{$post_author->username}}!</h4>
    <p>
      A post of yours posted on {{\Carbon\Carbon::parse($pinned_post->created_at)->format('Y-m-d h:m:s')}}, <i>{{$pinned_post->title}}</i>, was pinned at {{\Carbon\Carbon::now()->format('Y-m-d h:m:s')}}!
    </p>
    <br>
    <span>Best Wishes,</span><br><span>Daniel Griffiths</span><br><span>daniel@thelaunch.tech</span><br><span>©2020 <a href="https://chatcoronavirus.com">ChatCoronavirus</a></span>
	</body>
</html>
