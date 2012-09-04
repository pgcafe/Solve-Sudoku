/*
 * solve_sudoku.js - Solving Sudoku Puzzles
 *
 * Copyright (c) 2011, Yoshinori Kohyama (http://algobit.jp/)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or
 * without modification, are permitted provided that the following
 * conditions are met:
 *
 * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided
 * with the distribution.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
 * CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
 * INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 *  
 * Input: array of 81 elements of (integer or null).
 *   1-9 for determined cells.
 *   null for non-determined cells.
 *
 * Output: same format as input, except that it has no null
 *   if this program can solve the given input.
 *
 * example:
 *   solve([ ,6, ,5, , ,2, , ,
 *           ,9,8, , ,2, , ,6,
 *           , ,7, , , ,4, ,3,
 *           , ,1, , ,7, ,2, ,
 *          8, , ,1, ,9, , ,5,
 *           ,7, ,3, , ,9, , ,
 *          4, ,6, , , ,8, , ,
 *          5, , ,7, , ,6,1, ,
 *           , ,2, , ,6, ,9, ])
 *   returns
 *         [1,6,4,5,8,3,2,7,9,
 *          3,9,8,4,7,2,1,5,6,
 *          2,5,7,9,6,1,4,8,3,
 *          9,4,1,6,5,7,3,2,8,
 *          8,2,3,1,4,9,7,6,5,
 *          6,7,5,3,2,8,9,4,1,
 *          4,1,6,2,9,5,8,3,7,
 *          5,8,9,7,3,4,6,1,2,
 *          7,3,2,8,1,6,5,9,4]
 *
 * level0: At any steps in solving, there's at least one deterministic cell.
 * level1: At one or more steps in solving, there's no deterministic cell,
 *   but assuming one of canditates about one cell at one step,
 *   there's no non-deterministic cells at later steps.
 * level2 or higher: At two or more steps, assuming one of candidates is
 *   needed.
 *
 * This program can solve upto level1.
 *
 * level0 example
 *     [ ,6, ,5, , ,2, , ,
 *       ,9,8, , ,2, , ,6,
 *       , ,7, , , ,4, ,3,
 *       , ,1, , ,7, ,2, ,
 *      8, , ,1, ,9, , ,5,
 *       ,7, ,3, , ,9, , ,
 *      4, ,6, , , ,8, , ,
 *      5, , ,7, , ,6,1, ,
 *       , ,2, , ,6, ,9, ])
 * 
 * level1 example
 *     [4, ,5, ,6,1,7,8, ,
 *       , ,8,4, , , , ,9,
 *       , ,9, , ,3, ,4, ,
 *      8, , , , ,5, , ,4,
 *       ,5,7, ,8,4,3,9, ,
 *      9, , , ,3, , , ,6,
 *       ,8, ,7, , ,4, , ,
 *      5, , , , ,6,9, , ,
 *       ,9,3,5,4, ,1, ,7]
 *   
 * level8 example (can't be solved with this program)
 *     [ , ,5,3, , , , , ,
 *      8, , , , , , ,2, ,
 *       ,7, , ,1, ,5, , ,
 *      4, , , , ,5,3, , ,
 *       ,1, , ,7, , , ,6,
 *       , ,3,2, , , ,8, ,
 *       ,6, ,5, , , , ,9,
 *       , ,4, , , , ,3, ,
 *       , , , , ,9,7, , ]
 */

function solve (e) {
  function set (d) {
    var r = d;
    this.first = function () { return r[0]; }
    this.conj = function (e) { if (r.indexOf(e) < 0) r.push(e); }
    this.disj = function (e) {
      var i;
      if (0 <= (i = r.indexOf(e)))
        r = r.slice(0, i).concat(r.slice(i + 1, r.length));
    }
    this.get = function () { return r; }
    this.length = function () { return r.length; }
    this.clone = function () {
      var i, q = [];
      for (i = 0; i < r.length; i++)
        q.push(r[i]);
      return new set(q);
    }
    this.equals = function (d) {
      var i, dr = d.get();
      for (i = 0; i < dr.length; i++)
        if (r.indexOf(dr[i]) < 0)
          return false;
      for (i = 0; i < r.length; i++)
        if (dr.indexOf(r[i]) < 0)
          return false;
      return true;
    }
  }
  
  function make_cells(e) {
    var cells = [], i, j;
    for (i = 0; i < 81; i++) {
      if (e[i] == null)
        cells.push(new set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
      else
        cells.push(new set([e[i]]));
    }
    return cells;
  }

  function cells_clone(c) {
    var d = [], i;
    for (i = 0; i < 81; i++)
      d.push(c[i].clone());
    return d;
  }

  function cells_equals(a, b) {
    var i;
    for (i = 0; i < 9; i++)
      if (!a[i].equals(b[i]))
        return false;
    return true;
  }

  function cells_values(c) {
    var i, v = [];
    for (i = 0; i < 81; i++) {
      if (c[i].length() == 1)
        v.push(c[i].first());
      else
        v.push(0);
    }
    return v;
  }

  function cells_print(c) {
    var i, s;
    for (i = 0; i < 9; i++) {
      s = "";
      for (j = 0; j < 9; j++) {
        s += "[" + c[9*i + j].get() + "],";
      }
      console.log(s);
    }
    console.log("");
  }

  function make_blocks(c) {
    var i, rows = [], cols = [], sqrs = [];
    for (i = 0; i < 9; i++) {
      var row = [], col = [], sqr = [];
      for (j = 0; j < 9; j++) {
        row.push(c[9*i + j]);
        col.push(c[9*j + i]);
        sqr.push(c[27*Math.floor(i/3) + 9*Math.floor(j/3) + 3*(i%3) + j%3]);
      }
      rows.push(row);
      cols.push(col);
      sqrs.push(sqr);
    }
    return rows.concat(cols, sqrs);
  }

  function disj_determined (b) {
    var i, j, k;
    for (i = 0; i < 27; i++)
      for (j = 0; j < 9; j++)
        if (b[i][j].length() == 1)
          for (k = 0; k < 9; k++)
            if (k != j)
              b[i][k].disj(b[i][j].first());
  }

  function solved (c) {
    var i;
    for (i = 0; i < 81; i++)
      if (c[i].length() != 1)
        return false;
    return true;
  }

  function level0 (c) { // mutates c
    var b, c, d;
    b = make_blocks(c); // list of pointers to elements in c
    do {
      d = cells_clone(c); // back up
      disj_determined(b); // mutates c
    } while (!cells_equals(c, d))
  }

  function level1 (c) { // doesn't mutate c
    var d, i, j, k;
    for (i = 0; i < 81; i++) {
      if (1 < c[i].length()) {
        for (j = 0; j < c[i].length(); j++) {
          d = [];
          for (k = 0; k < 81; k++) {
            if (k == i)
              d.push(new set([c[i].get()[j]]));
            else
              d.push(c[k].clone());
          }
          level0(d);
          if (solved(d))
            return d;
        }
      }
    }
    return c;
  }

  var cells = make_cells(e), d;

  level0(cells); // mutates c
  if (solved(cells)) {
    console.log("solved with level0 algorithm");
    return cells_values(cells);
  }

  d = level1(cells); // return new cells
  if (solved(d)) {
    console.log("solved with level1 algorithm");
    return cells_values(d);
  }

  console.log("can't be solved with level1 algorithm");
  return cells_values(d);
}
