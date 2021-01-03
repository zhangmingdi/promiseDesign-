const obj = {
  0: 1,
  1: 2,
  length: 2,

  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this[i]
    }
  }

}


console.log([...obj])


