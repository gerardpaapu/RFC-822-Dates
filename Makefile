all: date.min.js date.max.js

clean:
	-rm date.min.js date.max.js

date.max.js: date.min.js
	beautifyjs < date.min.js > date.max.js

date.min.js: date.js
	java -jar bin/compiler.jar --js date.js --js_output_file date.min.js  
