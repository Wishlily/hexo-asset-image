'use strict';
var cheerio = require('cheerio');
var mkdirp = require('mkdirp');
var path = require('path');

// http://stackoverflow.com/questions/14480345/how-to-get-the-nth-occurrence-in-a-string
function getPosition(str, m, i) {
	return str.split(m, i).join(m).length;
}

hexo.extend.filter.register('after_post_render', function(data){
	var config = hexo.config;
	if (config.post_asset_folder) {
		var link = data.permalink;

		if (config.image.mode == "bucket") {
			var beginPos = getPosition(link, '/', 3) + 1;
			// In hexo 3.1.1, the permalink of "about" page is like ".../about/index.html".
			var endPos = link.lastIndexOf('/') + 1;
			link = config.image.bucket.urlPrefix + '/' + link.substring(beginPos, endPos);
			if(config.image.bucket.mkdir)
				// mkdir this pic folder
				mkdirp(config.image.bucket.folder + '/' + link, function(err) {
					if (err) console.error(err)
				});
			link = config.image.bucket.url + '/'+ link
		}

		var toprocess = ['excerpt', 'more', 'content'];
		for(var i = 0; i < toprocess.length; i++){
			var key = toprocess[i];

			var $ = cheerio.load(data[key], {
				ignoreWhitespace: false,
				xmlMode: false,
				lowerCaseTags: false,
				decodeEntities: false
			});

			$('img').each(function(){
				// For windows style path, we replace '\' to '/'.
				var src = $(this).attr('src').replace('\\', '/');
				if(!/http[s]*.*|\/\/.*/.test(src)){
					// For "about" page, the first part of "src" can't be removed.
					// In addition, to support multi-level local directory.
					var linkArray = link.split('/').filter(function(elem){
						return elem != '';
					});
					var srcArray = src.split('/').filter(function(elem){
						return elem != '';
					});
					if(linkArray[linkArray.length - 1] == srcArray[0])
						srcArray.shift();
					src = srcArray.join('/');
					if (config.image.mode == "bucket") {
						if (config.image.bucket.extend != null) {
							src = src + "-" + config.image.bucket.extend
						}
					} else if (config.image.mode == "url") {
						var secPath = path.normalize(path.resolve('', config.image.url.file));
						var images = require(secPath);
						if (images[src] != null) {
							src = images[src];
							link = ""
						}
					}
					$(this).attr('src', link + src);
				}
			});
			data[key] = $.html();
		}
	}
});
