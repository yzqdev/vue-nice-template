const path=require('path');
console.log(__dirname)
console.log(path.resolve(__dirname,'../src'))
console.log( path.resolve(__dirname, "../node_modules"))
console.log( path.join(__dirname, "../build"))
