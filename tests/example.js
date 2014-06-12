
var Router = require('../router.js');

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

//--

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

//--

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

//--

        var r = new Router();

        r.add("foo", function(r) { console.log("it's foo"); });
        r.add("bar", function(r) { console.log("it's bar"); });

        // Since this passes all tests and is the last handler added
        r.add(function() { return true; }, function() { return true; });

        if (r.route("blarg")) {
          console.log("blarg not handled");
        }

