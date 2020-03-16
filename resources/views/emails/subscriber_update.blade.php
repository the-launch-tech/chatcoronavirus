<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="utf-8">
	</head>
	<body>
		<h4>Hello, {{$subscription->username}}!</h4>
    <p>
      <i>{{$subscriber->username}}</i> subscribed to your profile at {{\Carbon\Carbon::now()->format('Y-m-d h:m:s')}}!
    </p>
    <br>
    <span>Best Wishes,</span><br><span>Daniel Griffiths</span><br><span>daniel@thelaunch.tech</span><br><span>©2020 <a href="https://chatcoronavirus.com">ChatCoronavirus</a></span>
	</body>
</html>
