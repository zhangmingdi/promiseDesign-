const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'

function resolveReturnValue(promise2, value, resolve, reject) {

  if (value === promise2) return reject('不能返回自己')

  if (typeof value === 'object' && typeof value !== null || typeof value == 'function') {
    try {
      const _then = value.then
      if (typeof _then === 'function') {
        value.then(res => {
          resolveReturnValue(promise2, res, resolve, reject)
        }, err => {
          reject(err)
        })

      } else {
        resolve(value)
      }

    } catch (error) {
      reject(error)
    }

  } else {
    resolve(value)
  }
}

class MyPromise {

  constructor(executor) {

    this._state = PENDING
    this._value = null

    this._resolvequeue = []
    this._rejectqueue = []

    let resolve = (res) => {
      if (this._state == PENDING) {
        this._state = RESOLVED
        this._value = res
        this._resolvequeue.forEach(fn => {
          fn && fn(res)
        })
      }
    }

    let reject = (res) => {
      if (this._state == PENDING) {
        this._state = REJECTED
        this._value = res
        this._rejectqueue.forEach(fn => {
          fn && fn(res)
        })
      }
    }
    try {
      executor(resolve, reject)

    } catch (err) {
      reject(err)
    }
  }


  then(resolveFn, rejectFn) {
    resolveFn = typeof resolveFn == 'function' ? resolveFn : (val) => val
    rejectFn = typeof rejectFn == 'function' ? rejectFn : (res) => { throw res }
    const promise2 = new MyPromise((resolve, reject) => {
      if (this._state == RESOLVED) {
        setTimeout(() => {
          const value = resolveFn(this._value)
          resolveReturnValue(promise2, value, resolve, reject)
        }, 0)

      }
      if (this._state == REJECTED) {
        setTimeout(() => {
          const value = rejectFn(this._value)
          resolveReturnValue(promise2, value, resolve, reject)
        }, 0)
      }

      if (this._state == PENDING) {

        this._resolvequeue.push(res => {
          try {
            const value = resolveFn(res)
            resolveReturnValue(promise2, value, resolve, reject)
          } catch (err) {
            reject(err)
          }

        })
        this._rejectqueue.push((res) => {
          try {
            const value = rejectFn(res)
            resolveReturnValue(promise2, value, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }

    })

    return promise2
  }
}

MyPromise.defer = () => {
  let dfd = {}

  dfd.promise = new MyPromise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })

  return dfd
}

module.exports = MyPromise

