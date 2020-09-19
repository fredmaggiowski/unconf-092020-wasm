// Code starting reference:
// https://wasmbyexample.dev/examples/reading-and-writing-graphics/reading-and-writing-graphics.go.en-us.html

package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Println("Hi there from your console!")
}

// CheckerBoardSize defines the checker board size
const CheckerBoardSize int = 2000

// BufferSize is the buffer we use to save checker colors
// size * size * 4 to save space for 4 colors channels (r,g,b,a) of the square.
const BufferSize int = CheckerBoardSize * CheckerBoardSize * 4

var graphicsBuffer [BufferSize]uint8

//export getGraphicsBufferPointer
func getGraphicsBufferPointer() *[BufferSize]uint8 {
	return &graphicsBuffer
}

//export getGraphicsBufferSize
func getGraphicsBufferSize() int {
	return BufferSize
}

//export generateCheckerBoard
func generateCheckerBoard(
	darkValueRed uint8,
	darkValueGreen uint8,
	darkValueBlue uint8,
	lightValueRed uint8,
	lightValueGreen uint8,
	lightValueBlue uint8,
) {
	startTime := time.Now()
	for y := 0; y < CheckerBoardSize; y++ {
		for x := 0; x < CheckerBoardSize; x++ {
			isDarkSquare := true
			if y%2 == 0 {
				isDarkSquare = false
			}
			if x%2 == 0 {
				isDarkSquare = !isDarkSquare
			}

			squareValueRed := darkValueRed
			squareValueGreen := darkValueGreen
			squareValueBlue := darkValueBlue
			if !isDarkSquare {
				squareValueRed = lightValueRed
				squareValueGreen = lightValueGreen
				squareValueBlue = lightValueBlue
			}

			squareNumber := (y * CheckerBoardSize) + x
			squareRgbaIndex := squareNumber * 4

			graphicsBuffer[squareRgbaIndex+0] = squareValueRed   // Red
			graphicsBuffer[squareRgbaIndex+1] = squareValueGreen // Green
			graphicsBuffer[squareRgbaIndex+2] = squareValueBlue  // Blue
			graphicsBuffer[squareRgbaIndex+3] = 255              // Alpha (Always Opaque)
		}
	}
	endTime := time.Now()
	fmt.Printf("Go generation took %v\n", endTime.Sub(startTime))
}
