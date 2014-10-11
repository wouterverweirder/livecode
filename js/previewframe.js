console.log = function(){
	args = [];
	[].forEach.call(arguments, function(argument){
		args.push(htmlEscape(argument));
	});
	parent.postMessage({type: 'console.log', arguments: args}, '*');
}

console.error = function(){
	args = [];
	[].forEach.call(arguments, function(argument){
		args.push(htmlEscape(argument));
	});
	parent.postMessage({type: 'console.error', arguments: args}, '*');
}

//http://stackoverflow.com/questions/1219860/html-encoding-in-javascript-jquery
function htmlEscape(str) {
  return String(str)
          .replace(/&/g, '&amp;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#39;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
}