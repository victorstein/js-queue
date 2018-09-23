'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _fetchTimer = require('fetch-timer');

var _fetchTimer2 = _interopRequireDefault(_fetchTimer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DoneEmitter = function (_EventEmitter) {
  _inherits(DoneEmitter, _EventEmitter);

  function DoneEmitter() {
    _classCallCheck(this, DoneEmitter);

    return _possibleConstructorReturn(this, (DoneEmitter.__proto__ || Object.getPrototypeOf(DoneEmitter)).apply(this, arguments));
  }

  return DoneEmitter;
}(_events2.default);

var DoneEventEmitter = new DoneEmitter();

var queue = function () {
  function queue(tasks, concurrency, compute) {
    _classCallCheck(this, queue);

    this.tasks = tasks.length ? tasks : [''];
    this.concurrency = concurrency > this.tasks.length ? this.tasks.length : concurrency;
    this.workers = [];
    this.result = [];
    this.compute = compute;
  }

  _createClass(queue, [{
    key: 'concurrencyLimit',
    value: function concurrencyLimit() {
      return this.workers.length < this.concurrency ? true : false;
    }
  }, {
    key: 'success',
    value: function success(res) {
      this.workers.shift();
      this.result.push(res);
      this.enqueue();
    }
  }, {
    key: 'failure',
    value: function failure(error) {
      this.workers.shift();
      this.result.push(error);
      this.enqueue();
    }
  }, {
    key: 'compute',
    value: function compute(task) {
      var _this2 = this;

      return new Promise(async function (res, rej) {
        console.log('ran compute');
        try {
          var _res = await _this2.compute(task);
          _res(_res);
        } catch (e) {
          rej(e);
        }
      });
    }
  }, {
    key: 'work',
    value: async function work(task) {
      console.log('asigned to queue: ' + task);
      try {
        this.workers.push('working');
        var res = await this.compute(task);
        this.success(res);
      } catch (e) {
        console.log(e);
        this.failure({ task: task, error: e });
      }
    }
  }, {
    key: 'enqueue',
    value: function enqueue() {
      console.log('the tasks length is: ' + this.tasks.length, 'the amount of workers is: ' + this.workers.length);
      if (this.tasks.length > 0) {
        if (this.concurrencyLimit()) {
          this.work(this.tasks[0]);
          this.tasks.shift();
          this.enqueue();
        }
      } else if (this.tasks.length < 1 && this.workers.length === 0) {
        DoneEventEmitter.emit('done');
      }
    }
  }, {
    key: 'start',
    value: function start() {
      var _this3 = this;

      this.enqueue();
      return new Promise(function (res, rej) {
        DoneEventEmitter.on('done', async function () {
          DoneEventEmitter.removeAllListeners();
          res(_this3.result);
        });
      });
    }
  }]);

  return queue;
}();
/*
let mockFunction = (task) =>{
  return new Promise(async res => {
    try{
      let ress = await fetch('http://5ba71c7868c16e0014c4eea2.mockapi.io/test/' + task, { timeout: 10000 });
      ress = await ress.json()
      res(ress)
    } catch(e) {
      console.log(e)
    }
  });
}

let some = new queue(['Ingredients', 'tasks', 'things', 'persons', 'art'], 2, mockFunction);

some.start().then((res)=> console.log(res));
*/


exports.default = queue;
