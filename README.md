# Mayocat.js

_Mayocat.js_ is an optional script that can help building Mayocat themes.

## Installation

To use _Mayocat.js_ on your theme you can install it with [Bower](http://bower.io/):

```
bower install mayocat.js
```

And add the minified file to your HTML:

```html
<script src="/bower_components/mayocat.js/dist/mayocat.min.js"></script>
```

Or you can do install it manually, downloading the file and putting it somewhere in your theme folder.

## Contributing

### Setup

Clone the project, then install all the dependencies:

```
git clone https://github.com/mayocat/mayocat.js.git
cd mayocat.js
npm install
```

### Compilation

To build the project:

```
npm run build
```

The above command runs `bower update -d` before each build to make sure all your dependencies are up-to-date, if you want to get rid of this step, just run:

```
gulp build
```

### Releases

The releases are automated through a simple command. Say you want to create a __1.2.3__ release, just run:

```
gulp release --ver 1.2.3
```

This will run a final build, edit the configuration files, commit them, add a new tag, and push the __master__ branch to the __origin__ remote.
