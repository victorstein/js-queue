import EventEmitter from 'events'

class DoneEmitter extends EventEmitter {}
const DoneEventEmitter = new DoneEmitter();

export default class queue {

  constructor(tasks, concurrency, compute){
    this.tasks = (tasks.length) ? tasks : [''];
    this.concurrency = (concurrency > this.tasks.length) ? this.tasks.length : concurrency;
    this.workers = [];
    this.result = [];
    this.compute = compute;
  }

  concurrencyLimit() {
    return (this.workers.length < this.concurrency) ? true : false
  }

  success(res) {
    this.workers.shift();
    this.result.push(res)
    this.enqueue()
  }

  failure(error) {
    this.workers.shift()
    this.result.push(error)
    this.enqueue()
  }

  compute(task){
	  return new Promise(async (res, rej) =>{
      console.log('ran compute')
      try {
        let res = await this.compute(task);
        res(res)
      } catch(e){
        rej(e)
      }
    })
  }

  async work(task){
    console.log('asigned to queue: ' + task)
    try{
      this.workers.push('working');
      let res = await this.compute(task);
      this.success(res)
    } catch(e){
      console.log(e)
      this.failure({ task, error: e })
    }
  }

  enqueue() {
    console.log(
      'the tasks length is: ' + this.tasks.length,
      'the amount of workers is: ' + this.workers.length
    )
  	if(this.tasks.length > 0){
  	  if(this.concurrencyLimit()){
    		this.work(this.tasks[0]);
    		this.tasks.shift()
    		this.enqueue()
  	  }
  	} else if(this.tasks.length < 1 && this.workers.length === 0) {
  	  DoneEventEmitter.emit('done');
  	}
  }

  start(){
    this.enqueue();
    return new Promise((res, rej)=>{
      DoneEventEmitter.on('done', async () => {
        DoneEventEmitter.removeAllListeners();
        res(this.result)
      });
    })
  }

}
