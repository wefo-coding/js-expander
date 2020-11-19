# js-expander
JavaScript Expander - Easy to use and very flexible.

## Install
Download the latest version and include `expander.css` and `expander.js` in the `<head>`.
```html
<link rel="stylesheet" type="text/css" href="[path]/expander.css">
<script src="[path]/expander.js"></script>
```

## Usage
To use js-expander you only need to add some classes and data-attributes within your html.

### Classes
The most important classes are:
* `wefo-expander`: Container for expandable content and its toggle buttons.
* `wefo-expandable`: Area with expandable content. There can be more than one area in each expander.
* `wefo-expander-toggle`: Toggle button for the expander. There can be more than one toggle button in each expander.

Classes for extended functionality:
* `wefo-expander-wrapper`: Wrapper for a group of related expanders.
* `wefo-expander-single`: Inside a wrapper with this class only one expander can be expanded.
* `wefo-expander-global-toggle`: Toggle button for all expanders within a wrapper (or all expanders of the website, if there is no wrapper) with a specific class.
* `wefo-expander-nested`: If there are nested wrappers, these are taken into account.
* `wefo-expand-on-hover`: Add this class to the toggle buttons if you want to expand the content by hovering the toggle button.
* `wefo-expand-on-left-focus`: [Not implemented yet!] Expanders which contain this class will collapse, if you click outside the expander.
* `wefo-expand-on-[breakpoint]`: [Not implemented yet!] If you use this class on expanders, the content is expanded at the specified breakpoint (Bootstrap breakpoints -> xs|sm|md|lg|xl).
* `wefo-collapse-on-[breakpoint]`: [Not implemented yet!] If you use this class on expanders, the content is collapsed at the specified breakpoint (Bootstrap breakpoints -> xs|sm|md|lg|xl).

Other Classes:
* `wefo-expanded`: Expanders get this class when they are unfolded. Also all global toggle buttons get this class if all relatted expanders are unfolded.

### Data-Attributes
* `data-toggle`: Connects a global toggle button with expanders by a class name within a wrapper.
* `data-global`: Connects a global toggle button with expanders by a class name.

### Style
You can use your own stylesheet. Only the important styles for the functionality are defined.
The `:not()`-selector could be helpful to style expanded and not expanded contents different.
```css
.wefo-expander:not(.wefo-expanded) > selector,
.wefo-expander-global-toggle:not(.wefo-expanded) > selector{
    ...
}
.wefo-expander > selector,
.wefo-expander-global-toggle > selector{
    ...
}
```

## Examples
Here you can find a few examples. More examples can be found in the folder `demo`.

### Simple
This is the easiest way to use the expander.
```html
<div class="wefo-expander">
    <span class="wefo-expander-toggle">Toggle</span>
    <div class="wefo-expandable">Content ...</div>
</div>
```

### Wrapper
In this example only one expander can be unfolded at a time. With `wefo-expanded` you can specify which one is already expanded.
```html
<div class="wefo-expander-wrapper wefo-expander-single">
    <div class="wefo-expander wefo-expanded">
        <span class="wefo-expander-toggle">Toggle</span>
        <div class="wefo-expandable">Content ...</div>
    </div>
    <div class="wefo-expander">
        <span class="wefo-expander-toggle">Toggle</span>
        <div class="wefo-expandable">Content ...</div>
    </div>
</div>
```

### Global toggle buttons
In this example several expanders can be unfolded simultaneously. If you want you can also use a wrapper with the additional class `wefo-expander-single` to display only one category at a time.
```html
<span class="wefo-expander-global-toggle" data-toggle="category-a">Category A</span>
<span class="wefo-expander-global-toggle" data-toggle="category-b">Category B</span>
<div class="wefo-expander category-a">
    <div class="wefo-expandable">Content of category A...</div>
</div>
<div class="wefo-expander category-b">
    <div class="wefo-expandable">Content of category B ...</div>
</div>
<div class="wefo-expander category-a category-b">
    <div class="wefo-expandable">Content of category A and B ...</div>
</div>
```
