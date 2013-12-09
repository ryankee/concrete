# Concrete
Concrete is a minimalistic Continuous Integration server.

![concrete](http://dl.dropbox.com/u/1152970/concrete_screenshot_hi.png)

_Note: I don't have a lot of time to maintain, so I'm looking for folks who'd like to contribute. Post an issue if you'd like to toss some time towards new features, issues, or pull requests._

## Quickstart

> Note: This project requires a MongoDB instance

    npm install -g concrete
    git clone git://github.com/you/yourrepo.git
    cd yourrepo
    git config --add concrete.runner "coffee test/unit.coffee"
    concrete .
    open http://localhost:4567

## Usage
    Usage: concrete [-hpv] path_to_git_repo

    Options:
      -h, --host     The hostname or ip of the host to bind to  [default: "0.0.0.0"]
      -p, --port     The port to listen on                      [default: 4567]
      --help         Show this message
      -v, --version  Show version

## Setting the test runner
    git config --add concrete.runner "coffee test/unit.coffee"

## Setting the branch
    git config --add concrete.branch deploy

## Adding HTTP Basic authentication
    git config --add concrete.user username
    git config --add concrete.pass password

## Post build
After building Concrete will run `.git/hooks/build-failed` or `.git/hooks/build-worked` depending on test outcome. Like all git hooks, they're just shell scripts so put whatever you want in there.


Concrete is **heavily** inspired by [CI Joe](https://github.com/defunkt/cijoe)
