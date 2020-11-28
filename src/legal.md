---
pagination:
  data: collections.github
  size: 1
  alias: post
  addAllPagesToCollections: true
permalink: '{{ post.url }}/index.html'
---

{{#meta "title"}}
	{{post.title}}
{{/meta}}

<section class="general section is-revealing">
	<div class="general-inner section-inner">
		<div class="container-sm">

{{{post.markdown}}}

</div></div></section>
