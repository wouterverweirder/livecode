console.log = function(){
	args = [];
	[].forEach.call(arguments, function(argument){
		args.push(argument.toString());
	});
	parent.postMessage({type: 'console.log', arguments: args}, '*');
}

console.error = function(){
	args = [];
	[].forEach.call(arguments, function(argument){
		args.push(argument.toString());
	});
	parent.postMessage({type: 'console.error', arguments: args}, '*');
}