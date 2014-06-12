/*
 * Copyright 2014, Gregg Tavares.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Gregg Tavares. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF2 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

"use strict";

var Router = require('../router.js');

exports.testStrings = function(test) {
  var r = new Router();

  r.add('walk', handleWalk);
  r.add('run', handleRun);

  function handleWalk(r, player) {
      test.equal(r.id, "walk", "id = walk");
      test.equal(player.name, "Joe Blow", "name is Joe Blow");
  };

  function handleRun(r, player) {
    test.equal(r.id, "run", "id = run");
    test.equal(player.name, "Joe Blow", "name is Joe Blow");
  };

  var player = {name: "Joe Blow"};
  r.route("walk", player);
  r.route("run", player);

  test.done();
};


//--

exports.testRegExp = function(test) {
  var r = new Router();

  r.add(/^cat_(.*?)$/, handleCat);
  r.add(/^dog_(.*?)$/, handleDog);

  function handleCat(r, cage) {
    test.equal(r.result[1], "siamese");
    test.equal(cage.type, "steel");
  };

  function handleDog(r, cage) {
    test.equal(r.result[1], "shepard");
    test.equal(cage.type, "steel");
  };

  var cage = {type: "steel"};
  r.route("cat_siamese", cage);
  r.route("dog_shepard", cage);

  test.done();
};

//--

exports.testFunction = function(test) {
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
    test.equal(r.id, 495);
    test.equal(r.result, 5);
  }

  function handleOver500(r) {
    test.equal(r.id, 506);
    test.equal(r.result, 6);
  }

  r.route(495);
  r.route(506);

  test.done();
};


exports.testNoRoute = function(test) {

  var r = new Router();

  r.add("foo", function(r) { test.ok(r.result); test.equal(r.id, "foo"); });
  r.add("bar", function(r) { test.ok(r.result); test.equal(r.id, "bar"); });
  r.add(function() { return true; }, function(r) { test.equal(r.result, true); test.equal(r.id, "blarg"); return true; });

  test.ok(!r.route("foo"));
  test.ok(!r.route("bar"));
  test.ok(r.route("blarg"));

  test.done();

};

