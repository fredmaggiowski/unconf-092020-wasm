# Surfacing WebAssembly

**Mia-Platfom Unconference 09/2020**

## Useful bash commands

```bash
# link wasm support file in website
$ cd web; ln -s $(tinygo env TINYGOROOT)/targets/wasm_exec.js ./wasm_exec.js

# compile go package
$ cs go; tinygo build -o main.wasm  -heap-size 16076496 -target wasm ./main.go

# run minimal HTTP server, checkout localhost:8080/web
$ goexec 'http.ListenAndServe(`:8080`, http.FileServer(http.Dir(`.`)))'
```

## Notes

Go support is still limited: to expose functions with a custom interface it's far better using tinygo compiler; otherwise functions must be defined with a specific interface defined in `syscall/js` package and must be injected into js window global variable.
