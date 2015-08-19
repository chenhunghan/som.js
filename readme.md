# som.js

The Self-Organizing Map(SOM) in Pure Javascript 

We plan to translate the core methods of SOM algorithm, which is elaborated in "[MATLAB Implementations and Applications of the Self-Organizing Map](http://docs.unigrafia.fi/publications/kohonen_teuvo/MATLAB_implementations_and_applications_of_the_self_organizing_map.pdf)", from MATLAB into javascript.

The implementation will be written in javascript/typescript and could be used in modern browsers and node.js env. It is depended on these libs for matrix and array operations:



###How-to-dev

* install [node.js](https://nodejs.org) environment
* clone or download the repository
* go to directory and type ``npm install`` to install all the dependencies
* There is an example on how to comsume the API which som.js offered. Please find it in ``./example/64nodeSOM.js`` which is also written in ES6, run it by install babel-node (``npm install node-babel -g``) and run by ``node-babel example/64nodeSOM.js.``
* ``./src`` is the source code written in ECMAScript 6, we use gulp + bable to compile it inot ECMAScript 5. Type ``npm compile`` to start compiling.
* working with Git: Getting Start!
  <https://github.com/chenhunghan/som.js/wiki/Getting-Start!>
* working with Git: Make a new Branch
  <https://github.com/chenhunghan/som.js/wiki/Make-a-New-Branch>