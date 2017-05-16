# pagination
---
A simple ES6-class-based Pagination plugin without third-party dependence

## Installation
For now, just include `pagination.js` into your code :)

## Usage
Basic:
```javascript
var opts = {
    el: '#root',
    btnGpEl: '#pg-control',
    renderFn: f,
}

// init
var p = new Pagination(opts);

// change page
p.prev();
p.next();

// update list
p.setState({
  list: [ ... ]
})

// render function
function f (val, index, arr) {
  const d = document.createElement('p');
  d.innerText = val;
  return d;
}
```

## Options
Example: 
```javascript
{
  el: '#pg-root', // required
  renderFn: f, // required
  sortFn: s,
  btnGpEl: '#pg-ctrl',
  interval: 5,
  limit: 5,
  prevBtnHtml: '<',
  nextBtnHtml: '>'
}
```

key | type | description |required
--------- | --------- | ------------- | ----
`el` | string | container of the list | true
`renderFn` | function | `renderFn(value: any, index: number, array: any[]): Node` <br/> Function to render each item | true
`sortFn` | function | `sortFn(prev: any, next: any): number` <br/> Function to sort whole list | false
`btnGpEl` | string | container of button group | false
`interval` | number | count of items on each page | false
`limit` | number | not used yet | false
`prevBtnHtml` | HTML string | default to '<' | false
`nextBtnHtml` | HTML string | default to '>' | false

## TODO
* subscribe
* async render
* page number buttons
...
