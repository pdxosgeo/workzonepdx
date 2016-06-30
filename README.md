# [Vision Zero Work Zones](http://vzwz.oregonwalks.org/)

> Shining a light on pedestrian safety in work zones across Portland.

## Background

Experimenting with a workflow for aggregating images/video/commentary from social media and curating compelling stories and maps.

The idea is that we can work with people passionate about an issue to quickly capture its breadth and depth in a very real and tangible way, then funnel it to decision makers to support specific policy changes.

This first project focuses on the issue of poorly designed sidewalk and street closures for construction, and the accessibility and safety issues that they often pose for pedestrians and bikers.  If it works out we can generalize for quick deployment.

The whole point is to piece together existing services at little to no cost. Tech stack so far includes Twitter/Instagram APIs, Zapier, Google Sheets, Google App Script, Tabletop.js, Jekyll/Github Pages, and probably Leaflet.  Others welcome if you want to spearhead.

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before getting started.

## Developing

If you'd like to help with the development of the site, here are some handy steps to get you started.

### Prerequesites

This website is a [jekyll](https://jekyllrb.com/) project. To get started, you'll need:

* [ruby](https://www.ruby-lang.org/en/documentation/installation/)
* [jekyll](https://jekyllrb.com/)

You'll also need to be somewhat comfortable working with terminal. Ruby is already installed on a lot of systems. You can check if it's there on the command line by running `ruby -v`. If it show a version number that's 2.0.0 or greater, you should be fine.

Once you have ruby installed, you can get jekyll by typing `gem install jekyll` in the terminal.

### Clone the project

You'll need to clone this project repository using [git](https://git-scm.com/).

```
git clone git@github.com:pdxosgeo/workzonepdx.git
```

### Start the jekyll server

Once you have a local copy, go into that folder in the terminal.

```
cd workzonepdx
```

Now you should be able to start a jekyll server like so:

```
jekyll serve
```

If all goes well, you'll be able to preview the site at http://127.0.0.1:4000/workzonepdx/. From here you can add, edit, and delete files to help improve the site.

## License

[MIT](LICENSE.md)
