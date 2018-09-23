# JS Async queue

This is a helper class that resolves a queue with a concurrency limit ( I.e. limit the amount of concurrent processes ) and provides an array of responses once it has completed the queue.

# Installation

``` npm install js-async-queue ```

# Usage

The class requires 3 parameters:
-Tasks array
-Concurrency limit
-Function to be computed ( Promise )

```

import queue from 'js-async-queue'
//const queue = require('js-async-queue').default

//This function will be ran with each element in the queue

let mockFunction = (task) =>{

  return new Promise(async (resolve, reject) => {
    try{
      let response = await fetch('http://5ba71c7868c16e0014c4eea2.mockapi.io/test/' + task);
      response = await response.json()
      res(response)
    } catch(e) {
      console.log(e)
      reject(e)
    }
  });

}

//Create a new instanaceof the queue
//First Param is an array
//Second param is the max amount of concurrent processes
//Third Param is the function that will run with each task in the queue

let enqueue = new queue(['Ingredients', 'tasks', 'things', 'persons', 'art'], 2, mockFunction);

enqueue.start().then((res)=> console.log(res));

```

# Why the fuck did I even build this?

Well, I wanted to practice JS classes.

# Where to use it?

Mostly this class will be used by puppeteer users to make sure their computers don't run out of ram while crawling a site and they can keep an efficient queue with concurrent tasks.
