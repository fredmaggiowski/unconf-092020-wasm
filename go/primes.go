package main

import (
	"fmt"
	"time"
)

var primesBuffer [200]int

//export getPrimesBufferPointer
func getPrimesBufferPointer() *[200]int {
	return &primesBuffer
}

//export primeFactors
func primeFactors(integer int) {
	fmt.Printf("START PRIME FACTORS %d\n", integer)
	startTime := time.Now()

	position := 0

	var i int = 2
	var j int = 2

	for ; i <= integer; i++ {
		isPrime := true

		if integer%i == 0 {
			for ; j <= i/2; j++ {
				if i%j == 0 {
					isPrime = false
				}
			}

			fmt.Printf("IS PRIME SO FAR %v %v %d %v\n", i, integer, position, isPrime)
			if isPrime {
				integer /= i
				// primes = append(primes, i)
				primesBuffer[position] = i
				position++
			}
		}
	}

	endTime := time.Now()
	fmt.Printf("Go prime factorization took %v - %v\n", endTime.Sub(startTime), primesBuffer)
	return
}
