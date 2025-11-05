---
title: "Scholarly Markdown for Scientific Writing "
layout: post
tags: [science, writing, markdown]
author: Tamas Nagy
date: 2014-01-11 12:00:00
redirect_from: /blog/scientific-writing-pandoc/
---
Scientific writing has come a long way since typewriters and stacks of handwritten reference cards. Robust reference managers, automatically generated bibliographies, and editable files are significant improvements. 
However, we're saddled with a myriad of incompatible file formats that are ill-suited for scientific articles. If you're unlucky then your journal of choice only takes binary blobs with a .docx extension, but otherwise you essentially have two choices: MS Word and LaTeX. Both of which have their respective advantages. The former is better for collaboration, has a lower initial learning curve, and is widely adopted. The latter has superior typography, superior math support, a better file format, and it plays nicely with version control[^1]. 

That said, both are dreadful for scientific writing. I could spill a novel-worth of ink on the fallibilities of MS Word, but I'll be brief. Binary files have a limited shelf-life, science does not. Try to open an article written in Word (or an Excel file full of critical data) from the 90s. It's probably a garbled mess. Word also suffers from its [lackadaisical support for semantic markup](http://fluff.info/terrible/), its WYSIWYG nature, its [printed-page focused design](http://stevenpoole.net/blog/goodbye-cruel-word/), its inconsistency, its [primitive outlining and tagging features](http://www.antipope.org/charlie/blog-static/2013/10/why-microsoft-word-must-die.html), its lack of interoperability. The other option, LaTeX, isn't much better:

1. It's saddled with an exceedingly obtuse syntax[^3]
2.  It uses hundreds of slightly different, inconsistently documented packages[^4]
3. It's impossible to read raw tex (see 1)
4. It will completely break from one misplaced character
5. It generates somewhere between 5 to 10,000 different files during the compilation process
6. Much of its documentation is out of date due to its age. 

Lest I forget, debugging LaTeX is impossible. Even its advocates concede that it produces

> . . . error messages that are mystical, opaque, and vaguely frightening. Experience soon teaches you that the best thing is to ignore the messages . . .  
> 
> \- TeX Unbound (Alan Hoenig, p. 447)

This is the sad state of scientific writing in which we find ourselves. Typesetting is hard, but it shouldn't be *this* hard.

Enter [Pandoc](http://johnmacfarlane.net/pandoc/), a universal markup converter and extension of the Markdown language, which intends to ameliorate this problem. In direct contrast to LaTeX,  [Markdown](http://daringfireball.net/projects/markdown/)'s philosophy is to be "publishable as-is, as plain text, without looking like it’s been marked up with tags or formatting instructions." The original Markdown language is fairly limited, intending only to produce basic HTML, but [Pandoc's Markdown](http://johnmacfarlane.net/pandoc/README.html#pandocs-markdown) goes a step further by allowing tables, footnotes, equations, and internal references that are necessary for scientific writing. Its citation abilities are particularly simple and robust, just add ```[@Smith2012]``` to cite the document with the ID Smith2012 in your BibTex library. It's nice to have another format to markup our articles, but the nice thing with Pandoc is that you can later convert it to a more "accepted" format. Pandoc's command line tool has the ability to take your Markdown text and convert it to LaTeX or Word or HTML or any other of the dozens of available formats. It works remarkably well, even with complex LaTeX equations embedded in the document. 

Now, should you start using Pandoc for your writing? My answer is yes, but with several caveats. Pandoc is a very young project so it is still missing certain features[^5] and I've run into several bugs. Another issue with Pandoc is loss of fine-grained control over the final output, but this is a mainly a problem for short documents because you can invest the time to write a specific template for longer ones. Nevertheless, it is under [heavy development](https://github.com/jgm/pandoc/commits/master) and I expect it to rapidly improve.

I believe that scholarly markdown, e.g. Pandoc and Multimarkdown, as a whole has a bright future, especially if combined with a solid GUI editor[^6]. A good GUI would help promote markdown with non-programmers and would help us focus on our writing instead of the specifics of Markdown syntax. Ideally, such an editor would have two views---one for the source and one for the output---but you could write in either one. Such a dual interface would allow for the benefits of GUI's, e.g. easy table creation, and the precision editing of a plain-text editor. It would be especially nice if scientific journals accepted markdown as a viable submission format, using Pandoc with custom templates behind-the-scenes to generate a beautiful end-result. 

In conclusion, if scholarly markdown can be standardized to a suitable degree, combined with a solid GUI editor, and accepted by journals then it could provide a simple, but powerful alternative to Word and LaTeX for scientific writing. 


[^1]: You'll find out here shortly that the situation is not as one-sided as I make it seem, despite my opinion that MS Word needs to remain in the enterprise world of disposable documents. 
[^3]: ```\textbf{}``` for bold? ```\begin{enumerate} \item \end{enumerate}``` for lists? *Sigh*. 
[^4]: In this day and age, why do I have to manually import ```graphicx```? Or use ```hyperref``` so that a single URL doesn't break everything. 
[^5]: For example, I am unaware of a way to reference figures that works in both Word and LaTeX. Apparently, there's a [method](http://stackoverflow.com/questions/9434536/how-do-i-make-a-reference-to-a-figure-in-markdown-using-pandoc) that works if you're exporting to PDF via LaTeX. 
[^6]: [Texts.io](http://texts.io) is good start. 