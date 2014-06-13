simple-router
=============

A extremely simple router

Router is basically an array id to function.
You add ids and functions and it calls the
functions based on the id.

In the simplest example you do this

    var r = new Router();
    r.add("foo", handleFoo);
    r.add("bar", handleBar);

then later

    r.route(id, arg);

If id is `"foo"` then `handleFoo` will be called. Etc.

Routes passed to Router.add can be strings,
regular expressions, or functions.

For regular expressions `exec` is called.
If it succeeds the match object is passed to
the handler.

For functions the function is called with
the id. The function returns something truthy if it's a
match and that is passed to the handler.

handlers are passed a `RouterResult` which has 2 properties,
`result` which is the match object if the route used a
regular expression or whatever the function returned if
the route used a function. `id` is the id that
was passed in to `route`. After that the arguments
that were passed to `route`. Whatever the handler returns
is returned from `route`.

Examples:

1.  using strings

        var Router = require('simple-router');
        var r = new Router();

        r.add('walk', handleWalk);
        r.add('run', handleRun);

        function handleWalk(r, player) {
            console.log("walk: " + player.name);
        };

        function handleRun(r, player) {
            console.log("run: " + player.name);
        };

        var player = {name: "Joe Blow"};
        var state = 'walk';
        r.route(state, player);

    prints

        walk: Joe Blow

2.  using RegExp

        var Router = require('simple-router');
        var r = new Router();

        r.add(/^cat_(.*?)$/, handleCat);
        r.add(/^dog_(.*?)$/, handleDog);

        function handleCat(r, cage) {
            console.log("cat type: " + r.result[1] + " in " + cage.type + " cage");
        };

        function handleDog(r, cage) {
            console.log("dog type: " + r.result[1] + " in " + cage.type + " cage");
        };

        var cage = {type: "steel"};
        r.route("cat_siamese", cage);

    prints

        cat type: siamese in steel cage

3.  using functions

        var Router = require('simple-router');
        var r = new Router();

        r.add(under500, handleUnder500);
        r.add(over500, handleOver500);

        function under500(id) {
            var v = id; // could use parseInt if id was a string
            return (v < 500) ? 500 - v : false;
        }

        function over500(id) {
            var v = parseInt(id);   // not needed if id is a number.
            return (v > 500) ? v - 500 : false;
        }

        function handleUnder500(r) {
          console.log(r.id + " was under 500 by " + r.result);
        }

        function handleOver500(r) {
          console.log(r.id + " was over 500 by " + r.result);
        }

        r.route(495);
        r.route(506);

    prints

        495 was under 500 by 5
        506 was over 500 by 6

4.  Checking if any route was taken, add a catch all route that returns something unique.

        var r = new Router();

        r.add("foo", function(r) { console.log("it's foo"); });
        r.add("bar", function(r) { console.log("it's bar"); });

        // Since this passes all tests and is the last handler added
        r.add(function() { return true; }, function() { return true; });

        if (r.route("blarg")) {
          console.log("blarg not handled");
        }

    prints

        blarg not handled.

5.  Using for http routing

        var routerRouter = new Router();
        var getRouter = new Router();
        var postRouter = new Router();

        getRouter.add("/", function(r, res, req) {
            res.send("hello world");
            res.end();
        });

        routerRouter.add("GET", function(r, req, res) {
          getRouter.route(req.url, req, res);
        });

        routerRouter.add("POST", function(r, req, res) {
          postRouter.route(req.url, req, res);
        });

        var server = http.createServer(function(req, res) {
          routerRouter(req.method, req, res);
        };

    If you wanted to turn that into a similar signature as express it might
    be something along the lines of

        var App = function() {
            this.methodRouter = new Router();
            this.methodRouters = { };
        };

        App.prototype.addRoute(method, route, handle) = function() {
            var router = this.methodRouters[method];
            if (!router) {
                router = new Router();
                this.methodRouters[method] = router;
                this.methodRouter.add(method, function(r, req, res) {
                    router.route(req.url, req, res);
                });
            }

            router.add(route, function(r, req, res) {
                req.params = r.result.slice(1);
                handler(req, res);
            });
        };

        App.prototype.get = function(route, handler) {
            this.addRoute("GET", route, handler);
        };

        App.prototype.post = function(route, handler) {
            this.addRoute("POST", route, handler);
        };

        App.prototype.route = function(req, res) {
            this.methodRouter(req.method, req, res);
        };

        function createApplication() {
            var app = new App();
            return App.prototype.route.bind(app);
        }

        exports = module.exports = createApplication;

Why?
----

I'm sure this exists but when I looked all the routers I found were specifically targeted at URLs.
I needed something more generic. This router doesn't care what the route is. You could pass in a function
as the `id` to `route` and have every route have a function that calls the id it's passed, gets the result
and returns `true` if it's the right thing.

Bascially this router routes anything, not just strings, not just URLs. Pass in objects, have each
function check something about the object, whatever.




