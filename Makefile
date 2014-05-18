install:
	npm install
	bower --allow-root install
	gulp springbokjs-shim

update:
	npm update
	bower --allow-root update
	gulp springbokjs-shim

clean:
	rm -Rf public/dist/*
	rm -Rf public/images/*
	gulp springbokjs-shim

build:
	gulp

watch:
	gulp watch
