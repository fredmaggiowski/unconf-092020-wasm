
Number.prototype.toFixedDown = function(digits) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
      m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
};

const go = new Go()

async function exec() {
  const wasmModule = await WebAssembly.instantiateStreaming(
    fetch("../go/main.wasm"), 
    go.importObject
  )
  const {instance} = wasmModule

  go.run(instance)
  const {exports: {primeFactors}} = instance

  const number = 30000// 98765456578907

  primeFactors(number)

  const startTime = performance.now()  
  const numbers = jsPrimeFactors(number)
  const endTime = performance.now()
  console.log("JS prime factorization took " + (endTime - startTime).toFixedDown(3) + "ms -", JSON.stringify(numbers))
}
exec()

function jsPrimeFactors (integer) {
  const primes = []
  for (let i = 2; i <= integer; i++){
    let isPrime = true

    if (integer % i === 0) {
      for (let j = 2; j <= i/2; j++) {
        if (i % j === 0) {
          isPrime = false
        }
        console.log('AAASDASD',i, j , i %j, isPrime)
      }


      if (isPrime) {
        integer /= i
        console.log('AAAAA', i)
        primes.push(i);
      }
    }
  }

  return primes
}
