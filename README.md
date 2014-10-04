# livecode

Plugin for reveal.js to do livecode demos with html / css / javascript with a preview window and console messages inside your presentation.
It uses [CodeMirror](https://github.com/codemirror/CodeMirror) for the code editors.

![Screenshot](../../blob/master/screenshot.png?raw=true)

## Usage

1. Extract this repository to a folder called "livecode" inside your reveal.js plugin folder (reveal.js/plugin/livecode)
2. Wrap your code block(s) inside a div with the class livecode:

	```
	<div class="livecode stretch">
		<pre><code class="javascript">(function(){

	function init() {
		console.log("hello world");
	}

	init();

	})();</code></pre>
		<pre><code class="html">&lt;html&gt;
	&lt;head&gt;
	&lt;title&gt;Demo&lt;/title&gt;
	&lt;/head&gt;
	&lt;body&gt;
	&lt;h1&gt;Hello&lt;/h1&gt;
	&lt;/body&gt;
	&lt;/html&gt;</code></pre>
		<pre><code class="css">body {
		font-family: Comic Sans MS;
	}</code></pre>
	</div>
	```

3. Include the livecode.js in your reveal.js dependencies. Make sure it is included before highlight.js:

	```
	dependencies: [
		{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
		{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
		{ src: 'plugin/livecode/livecode.js', async: true },
		{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
		{ src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
		{ src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
	]
	```

4. You're done. You should be able to code inside the editors. Press run to update the preview.

## Options

### Panel Title

You can specify a title for a panel, which is shown in the tab in the toolbar.

```
<div class="livecode"><pre><code class="javascript" title="script.js">(function(){

function init() {
	console.log("hello world");
}

init();

})();</code></pre></div>
```

### Multiple JS/CSS Files

You can have multiple files for the same language. Make sure to give each panel a unique title and you're set.

```
<div class="livecode"><pre><code class="javascript" title="script.js">(function(){

function init() {
	console.log("hello world");
}

init();

})();</code></pre><pre><code class="javascript" title="other.js">(function(){

function init() {
	console.log("something else");
}

init();

})();</code></pre></div>
```

### Panel Layout

You can change the stacking of the editors vs the console & preview panels, by specifying a horizontal or vertical class on the wrapping div:

```
<div class="livecode stretch horizontal">
	<!-- will display the console and preview on the right from the editor -->
</div>
```

```
<div class="livecode stretch vertical">
	<!-- (default) will display the console and preview underneath the editor -->
</div>
```

### Hide Panels

You can hide the preview and / or console by specifying the class(es) no-preview and / or no-console on the wrapping div

```
<div class="livecode stretch no-preview">
	<!-- hides the preview panel -->
</div>
```

```
<div class="livecode stretch no-console">
	<!-- hides the console panel -->
</div>
```

```
<div class="livecode stretch no-preview no-console">
	<!-- hides the preview and console panel -->
</div>
```