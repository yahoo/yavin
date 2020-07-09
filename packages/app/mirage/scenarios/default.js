/**
 * Copyright 2017, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */

export default function(server) {
  //loads all the fixtures
  server.loadFixtures();
  server.createList('async-query', 0);
  const [table0, table1] = server.createList('table', 2);
  server.createList('metric', 2, { table: table0 });
  server.createList('metric', 2, { table: table1 });
  server.create('dimension', { table: table0 });
  server.create('time-dimension', { table: table1 });
  debugger;
}
