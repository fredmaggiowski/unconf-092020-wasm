// Code starting reference:
// https://wasmbyexample.dev/examples/reading-and-writing-graphics/reading-and-writing-graphics.go.en-us.html

Number.prototype.toFixedDown = function(digits) {
  var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
      m = this.toString().match(re);
  return m ? parseFloat(m[1]) : this.valueOf();
};

const CheckerBoardSize = 2000
const CheckerBoardMemorySize = CheckerBoardSize*CheckerBoardSize*4

const setupCanvas = (id) => {
  const canvasElement = document.querySelector(id)

  const canvasContext = canvasElement.getContext("2d")
  const canvasImageData = canvasContext.createImageData(
    canvasElement.width,
    canvasElement.height
  )

  canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height)
  return { canvasElement, canvasImageData, canvasContext, draw: (imageBuffer) => {
    canvasImageData.data.set(imageBuffer)
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height)
    canvasContext.putImageData(canvasImageData, 0, 0)
  } }
}

const getDarkValue = () => Math.floor(Math.random() * 100)
const getLightValue = () => Math.floor(Math.random() * 127) + 127

const go = new Go()
async function exec () {
  const wasmModule = await WebAssembly.instantiateStreaming(
    fetch("../go/main.wasm"), 
    go.importObject
  )
  const {instance} = wasmModule

  go.run(instance)
  const {
    exports: {
      memory,
      getGraphicsBufferPointer,
      getGraphicsBufferSize,
      generateCheckerBoard,
    }
  } = instance
  
  // Get access to WASM memory buffer.
  const wasmByteMemoryArray = new Uint8Array(memory.buffer)
  
  // Get Go buffer memory reference in WASM memory buffer and its size.
  const graphicsBufferPointer = getGraphicsBufferPointer()
  const graphicsBufferSize = getGraphicsBufferSize()

  const goCanvas = setupCanvas('#canvas-go')  
  const drawCheckerBoard = (colors) => {
    generateCheckerBoard(...colors)
    const imageDataArray = wasmByteMemoryArray.slice(
      graphicsBufferPointer,
      graphicsBufferPointer + graphicsBufferSize
    )
    goCanvas.draw(imageDataArray)
  }

  const jsCanvas = setupCanvas('#canvas-js')
  const drawCheckerBoardJs = (colors) => {
    const buffer = jsGenerateCheckerBoard(...colors)
    jsCanvas.draw(buffer)
  }

  setInterval(() => {
    const colors = [
      getDarkValue(),
      getDarkValue(),
      getDarkValue(),
      getLightValue(),
      getLightValue(),
      getLightValue()
    ]
    drawCheckerBoard(colors);
    drawCheckerBoardJs(colors)
  }, 500);
}
exec()

function jsGenerateCheckerBoard (
  darkValueRed,
	darkValueGreen,
	darkValueBlue,
	lightValueRed,
	lightValueGreen,
	lightValueBlue,
) {
  const graphicsBuffer = new Uint8Array(CheckerBoardMemorySize)
  
  const startTime = performance.now()
  for (let y = 0; y < CheckerBoardSize; y++) {
		for (let x = 0; x < CheckerBoardSize; x++) {
      let isDarkSquare = true
			if (y%2 == 0) {
				isDarkSquare = false
			}
			if (x%2 == 0) {
				isDarkSquare = !isDarkSquare
			}

			let squareValueRed = darkValueRed
			let squareValueGreen = darkValueGreen
			let squareValueBlue = darkValueBlue
			if (!isDarkSquare) {
				squareValueRed = lightValueRed
				squareValueGreen = lightValueGreen
				squareValueBlue = lightValueBlue
			}

			// Let's calculate our index, using our 2d -> 1d mapping.
			// And then multiple by 4, for each pixel property (r,g,b,a).
			let squareNumber = (y * CheckerBoardSize) + x
      let squareRgbaIndex = squareNumber * 4
      

			graphicsBuffer[squareRgbaIndex+0] = squareValueRed   // Red
			graphicsBuffer[squareRgbaIndex+1] = squareValueGreen // Green
			graphicsBuffer[squareRgbaIndex+2] = squareValueBlue  // Blue
			graphicsBuffer[squareRgbaIndex+3] = 255     
    }
  }
  const endTime = performance.now()
  console.log("JS generation took " + (endTime - startTime).toFixedDown(3) + "ms")
  return graphicsBuffer
}