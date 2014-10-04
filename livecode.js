(function(){
	function init() {
		//get the livecode divs
		[].forEach.call(document.querySelectorAll('.livecode'), function(el){
			new LiveCode(el);
  	});
	}

	function LiveCode(el) {
		var innerHTML = el.innerHTML;
		//move this content inside an iframe...
		var mainframe = document.createElement('iframe');
		mainframe.onload = function(){
			var msg = { type: 'init' };
			msg.innerHTML = innerHTML;
			msg.layout = (mainframe.classList.contains('horizontal')) ? 'horizontal' : 'vertical';
			msg.preview = {
				visible: !mainframe.classList.contains('no-preview')
			};
			msg.console = {
				visible: !mainframe.classList.contains('no-console')
			};
			this.contentWindow.postMessage(msg, '*');
		};
		mainframe.setAttribute('src', 'plugin/livecode/mainframe.html');
		for(var i = 0; i < el.classList.length; i++) {
			if(el.classList[i] !== 'livecode') {
				mainframe.classList.add(el.classList[i]);
			}
		}
		if(el.getAttribute('width')) mainframe.setAttribute('width', el.getAttribute('width'));
		if(el.getAttribute('height')) mainframe.setAttribute('height', el.getAttribute('height'));
		el.parentNode.replaceChild(mainframe, el);
	}

	init();
})();