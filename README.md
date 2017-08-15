# Using Gulp to Build a Front End Website
## FullStack JavaScript Project 8
### Node.JS, Gulp, Sass


* The gulp scripts command concatenates, minifies, and copies all of the project’s JavaScript files into an all.min.js file and copies it into the dist/scripts folder
* The gulp styles command compiles the project’s SCSS files into CSS, and concatenates and minifies into an all.min.css and copies it into the dist/styles folder
* The gulp scripts command generates JavaScript source maps
* The gulp styles command generates CSS source maps
* The gulp images command copies the optimized images to the dist/content folder
* The gulp clean command deletes all of the files and folders in the dist folder
* The gulp build command properly runs the clean, scripts, styles, and images tasks.
* The clean task fully completes before the scripts, styles, and images tasks are ran
* The gulp command properly runs the build task as a dependency
* The gulp command serves the project using a local webserver.
* The gulp command also listens for changes to any .scss file. When there is a change to any .scss file, the gulp styles command is run, the files are compiled, concatenated and minified to the dist folder, and the browser reloads, displaying the changes

### Installation

```
$ npm install
```
### Use the Following to run the tasks
```
gulp scripts
gulp styles
gulp images
gulp build
gulp
```

#### By Debbie O'Brien
15 August 2017
