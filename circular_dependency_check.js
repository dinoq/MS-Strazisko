const madge = require('madge');

madge('src/store/reducers/DBObjectSlice.ts').then((res) => {
	console.log(res.circularGraph());
});