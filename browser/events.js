
function toggleSelected(data){
  console.log('data', data);
  console.log('this', this);
  var el = d3.select(this);
  if(el.classed('selected')){
    console.log('unselecting');
    el.classed({'selected': false});
  } else {
    console.log('selecting');
    el.classed({'selected': true});
  }
}