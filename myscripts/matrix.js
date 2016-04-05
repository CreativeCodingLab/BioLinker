
var mWidth = 800;

// vertex is the input node which contains neighbors information
var compareList = {};
var array2D;
var cellSize = 10;
var cellSpacing = 1;
function drawMatrix(){

  array2D = []; 
  var numCards = 
  for (var i=0;i<tlinks.length;i++){
    for (var j=0;j<tlinks.length;j++){
      var cell = {};
      var cell.row = tlinks[i];
      var cell.rowId = i;
      var cell.column = tlinks[j];
      var cell.columnId = j;
      array2D.push(cell);
    }
  }  

  // Draw the matrix
  svg3.selectAll(".cell").data(array2D).enter().append("rect")
    .attr("class", "cells") 
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d,i) {
        var x0 = Math.floor(i / 100) % 10, x1 = Math.floor(i % 10);
        return groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10);
    })
    .attr("y", function(i) {
      var y0 = Math.floor(i / 1000), y1 = Math.floor(i % 100 / 10);
      return groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10);
    })

  // Download potential conflicts data  
  for (var i=0;i<tlinks.length;i++){
    for (var j=i+1;j<tlinks.length;j++){
      var cardI = tlinks[i].ref.ref;
      var cardJ = tlinks[j].ref.ref;
      if (compareList[cardI._id+"__"+cardJ._id]==undefined){
        var postData = {
          cardA: cardI,
          cardB: cardJ
        }
        d3.json('http://ccrg-data.evl.uic.edu/index-cards/api/IndexCards/compare')
          .header('Content-Type', 'application/json')
          .post(JSON.stringify(postData))
          .on('load', function(d) { 
            console.log("potentialConflict:"+d.response.comparsion.potentialConflict); 
       //     debugger;
          });
      }  
    }  
  }
}      
