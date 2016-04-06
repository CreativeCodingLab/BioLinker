
var mWidth = 800;

// vertex is the input node which contains neighbors information
var compareList = {};
var array2D;
var cellSize = 10;
var cellSpacing = 2;
var cellMarginX = 20;
var cellMarginY = 50;
var numCards = 0;

function drawMatrix(){
  // remove the cells before
  for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      g3.selectAll(".cells"+i+"__"+j).remove();
    }
  }

  array2D = []; 
  numCards = tlinks.length;
  console.log("numCards="+numCards);
  cellSize = Math.min(20,(width/3-cellMarginX-40)/numCards-cellSpacing);

  for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      var cell = {};
      cell.row = tlinks[i];
      cell.rowId = i;
      cell.column = tlinks[j];
      cell.columnId = j;
      array2D.push(cell);
    }
  }  

  
  // Draw the matrix
  g3.selectAll(".cells").data(array2D).enter().append("rect")
    .attr("class", function(d){
      return "cells"+d.rowId+"__"+d.columnId;
    }) 
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) {
        return cellMarginX+d.columnId*(cellSpacing + cellSize);
    })
    .attr("y", function(d) {
      return cellMarginY+d.rowId*(cellSpacing + cellSize);
    })
    .style("fill-opacity", 0)
    .style("stroke", "#aaa")
    .style("stroke-width", 0.5);
      

  // Download potential conflicts data  
  for (var i=0;i<numCards;i++){
    for (var j=0;j<i;j++){
      var cardI = tlinks[i].ref.ref;
      var cardJ = tlinks[j].ref.ref;
      cardI.rowId = i;
      cardJ.columnId = j;
      if (compareList[cardI._id+"__"+cardJ._id]==undefined){
        var postData = {
          cardA: cardI,
          cardB: cardJ
        }

        var aaa = d3.json('http://ccrg-data.evl.uic.edu/index-cards/api/IndexCards/compare')
          .header('Content-Type', 'application/json')
          .post(JSON.stringify(postData))
          .on('load', function(d) { 
            //console.log("potentialConflict:"+d.response.comparsion.potentialConflict
            //  +" A="+d.response.cardA.rowId+" B="+d.response.cardB.columnId+" score="+d.response.comparsion.score);
            g3.selectAll(".cells"+d.response.cardA.rowId+"__"+d.response.cardB.columnId)
              .style("stroke", function(d2){
                if (d.response.comparsion.potentialConflict)
                  return "#a04";
                else 
                  return "#fff";
              });
              //.style("stroke-width", function(d2){
              //  return d.response.comparsion.score;
              //});
            return d; 
          });
      }  
    }  
  }
}      
