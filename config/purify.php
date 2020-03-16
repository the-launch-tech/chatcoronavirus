<?php

return [

    'settings' => [

        'Core.Encoding' => 'utf-8',

        'Cache.SerializerPath' => storage_path('purify'),

        'HTML.Doctype' => 'XHTML 1.1',

        'HTML.AllowedElements' => 'h1,h2,h3,h4,h5,h6,b,strong,i,em,a,ul,ol,li,p,br,span,img,iframe,table,tbody,thead,th,tr,td',

        'HTML.AllowedAttributes' => 'img.src,img.width,img.height,img.title,img.alt,p.style,a.href,table.summary,iframe.src,iframe.width,iframe.height,iframe.frameborder',

        'HTML.SafeEmbed' => true,

        'HTML.TargetBlank' => true,

        'URI.DisableExternalResources' => false,

        'HTML.SafeIframe' => true,

        'URI.SafeIframeRegexp' => '%^(https?:)?//(www\.youtube(?:-nocookie)?\.com/embed/|player\.vimeo\.com/video/)%',

        'HTML.ForbiddenElements' => 'script',

        'CSS.AllowedProperties' => 'font,font-size,font-weight,font-style,font-family,text-decoration,padding-left,color,background-color,text-align',

        'AutoFormat.AutoParagraph' => false,

        'AutoFormat.RemoveEmpty' => false,

    ],

];
