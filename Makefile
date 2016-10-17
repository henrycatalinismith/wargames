jekyll: webpack-build jekyll-server
webpack: jekyll-build webpack-server

jekyll-build:
	bundle exec jekyll build

jekyll-server:
	bundle exec jekyll serve --watch

webpack-build:
	./node_modules/.bin/webpack --content-base _site

webpack-server:
	./node_modules/.bin/webpack-dev-server \
		--content-base _site \
		--inline

.PHONY: \
	jekyll \
	jekyll-build \
	jekyll-server \
	webpack \
	webpack-build \
	webpack-server
