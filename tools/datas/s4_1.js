define([

],function(

){
   
  return {
    gcolliders : [
      "64-200",
      "64-216",
      ["400-72","coiner"],
      "1648-152",
      "336-152",
      "352-152",
      "336-168",
      "352-168",
      ["2384-136","destroyable"],
      ["3520-136","multi_coiner"],
      "4032-168",
      "4048-168",
      "4032-184",
      "4048-184",
      "4064-184",
      "4064-168",
      "4064-24",
      "3824-200",
      "3824-216",
      ["3824-24","destroyable"],
      ["400-136","spawner"],
      "48-200",
      "16-200",
      "0-200",
      "0-216",
      ["2368-136","spawner"],
      "16-216"
    ],
    ncolliders : [
      ["1472-72","bspawner"],
      ["656-136","coinb"],
      ["3872-120","coin"],
      ["4032-136","spawner"]
    ],
    init : function() {
      this.ccolliders = [];
    }
  };

});