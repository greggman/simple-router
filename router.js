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

/**
 * Router is basically an array id to function.
 * You add ids and functions and it calls the
 * functions based on the id.
 *
 * In the simplest example you do this
 *
 *     var r = new Router();
 *     r.add("foo", handleFoo);
 *     r.add("bar", handleBar);
 *
 * then later
 *
 *     r.route(id, arg1, arg2, ...);
 *
 * routes passed to Router.add can be strings,
 * regular expressions, or functions.
 *
 * For regular expressions `match` is called.
 * If it succeeds the match object is passed to
 * the handler
 *
 * For functions the function is called with
 * the id. The function returns something truthy if it's a
 * match and that is passed to the handler.
 *
 * handlers are passed a RouterResult which has 2 properties,
 * `result` which is the match object if the route used a
 * regular expression or whatever the function returned if
 * the route used a function. `id` is the id that
 * was passed in. After that the arguments that were passed
 * to Rotuer.route
 *
 * @constructor
 */
var Router = function() {
  var routes = [];

  /**
   * Adds a route and a handler for that route
   * @param {string|RegExp|function} pattern Pattern for route.
   * @param {function} function to call for things that match this
   *        route.
   */
  this.add = function(pattern, handler) {
    var testFn;
    if (pattern instanceof RegExp) {
      testFn = function(id) {
        return pattern.exec(id);
      };
    } if (pattern instanceof Function) {
      testFn = pattern;
    } if (typeof(pattern) == "string") {
      testFn = function(id) {
        return id === pattern;
      };
    }
    routes.push({test: testFn, handler: handler});

  }.bind(this);

  /**
   * Given the id calls the appropriate route.
   * Routes are checked in the order added. The first route that
   * matches the id handles the route.
   *
   * @param {string} id id to check
   * @param {boolean} true if a route matched, false if no route
   *        matched.
   * @returns {??} Whatever the handler for the route returns.
   */
  this.route = function(id) {
    for (var ii = 0; ii < routes.length; ++ii) {
      var route = routes[ii];
      var result = route.test(id);
      if (result) {
        return route.handler.apply(null, [{result:result,id:id}].concat([].slice.call(arguments, 1)));
      }
    }
  };
};

module.exports = Router;


