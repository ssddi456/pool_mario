define([
  './util',
  './particals'
],function(
  util,
  particals
){
  function partical () {
    particals.push(this);
    this.life = 30;
  }
  var fn = partical.prototype;
  fn.grow    = util.nf;
  fn.die     = util.nf;
  fn.destroy = util.nf;

  return partical;
});