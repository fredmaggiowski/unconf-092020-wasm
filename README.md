# Surfacing WebAssembly

**Mia-Platfom Unconference 09/2020**

## Useful bash commands

```bash
# link wasm support file in website
$ cd web; ln -s $(go env GOROOT)/misc/wasm/wasm_exec.js ./wasm_exec.js

# compile go package
$ cd go; GOOS=js GOARCH=wasm go build -o main.wasm

# run minimal HTTP server, checkout localhost:8080/web
$ goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`.`)))'
```