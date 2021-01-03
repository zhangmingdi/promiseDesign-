const fs = require('fs')

Promise.defer = () => {
  let dfd = {}

  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })

  return dfd
}

const fsPromise = file => {

  const dfd = Promise.defer()

  fs.readFile(file, 'utf8', function (error, data) {
    if (error) return dfd.reject(error)
    dfd.resolve(data.toString())
  })
  return dfd.promise
}

function* asyncFunction() {
  try {
    const res = yield fsPromise('hello.txt')
    const val = yield fsPromise(res)
    return val
  } catch (error) {
    console.log('asyncerr', error)
  }

}

function co(fn) {

  return new Promise((resolve, reject) => {
    const iterater = fn()

    function doNext(preData) {
      const { value, done } = iterater.next(preData)

      if (!done) {
        Promise.resolve(value).then(data => {
          doNext(data)
        }).catch(err => {
          iterater.throw(err)
        })
      } else {
        resolve(value)
      }
    }
    doNext()
  })

}

co(asyncFunction).then(data => {

  console.log('finallyVal', data)

})

