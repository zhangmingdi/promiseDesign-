const MyPromise = require('./basicpromise')
const fs = require('fs')
const { resolve } = require('path')
const { rejects } = require('assert')
// const p = new MyPromise((resolve, reject) => {
//   setTimeout(() => {
//     console.log('sss')
//     resolve(1)
//   }, 1)
// })
// p.then(res => {
//   return new MyPromise((resolve, reject) => {
//     resolve(new MyPromise((resolve, reject) => {
//       resolve('ssjdsjdkjskdjlsj')
//     }))
//   })
// },
//   err => {
//     console.log('000n', err)
//   }
// ).then(data => {
//   console.log('111y', data)
//   throw Error('ssssssscuocu');

// }, err => {
//   console.log('111no', err)

// }).then(res => {
//   console.log('222y', res)
// }, err => {
//   console.log('2222n', err)
// })


const fsPromise = file => {

  const dfd = MyPromise.defer()

  fs.readFile(file, function (error, data) {
    if (error) return dfd.reject(error)
    dfd.resolve(data.toString())
  })
  return dfd.promise
}

const p = fsPromise('hello.txt')

p.then(res => {
  console.log('resolve', res)

}, err => {
  console.log('err', err)
})
