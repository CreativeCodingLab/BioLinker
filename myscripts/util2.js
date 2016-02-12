var tipWidth = 300;

function showTip(d) {
  tip.show(d);
  addDotplots(d);
}     

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-170,0])
  .html(function(d) {
    var curNode = d;
    if (curNode.ref!=undefined){
        curNode = curNode.ref;
    }
    var str = "";
    for (key in curNode.fields) {
        str+= key+": <span style='color:#7ef'>" + curNode.fields[key] + "</span> <br>"
    }
    
    //str+= "<br>Number of directLinks: <span style='color:#ff8'>" + curNode.directLinks.length + "</span> <br>"
    //for (key in types) {
    //    str+= "-"+key+": <span style='color:"+getColor(key)+ "'>" + types[key] + "</span> <br>"
    //}
    str+= "<br>Meta data, includes TimeArcs  for "+ curNode.fields.entity_text+"<br>"
    str+= "<br>Context data (graph)<br>"
    str+= "<br>Potential conflicts (statistics)<br>"
    return str;
})


function addDotplots(d){
  var curNode = d;
  if (curNode.ref!=undefined){
      curNode = curNode.ref;
  }
    /*// Compute direct links
    if (curNode.directLinks==undefined){
        curNode.directLinks = [];
        for (var i=0; i<links.length;i++){
            var l = links[i];
            if (curNode==l.source || curNode==l.target){
                curNode.directLinks.push(l);
            }
        }
    }*/

    // Compute statistics for neighbors
    var types = new Object();
    for (var i=0; i<curNode.directLinks.length;i++){
        var l = curNode.directLinks[i];
        if (types[l.type]==undefined){
            types[l.type] = new Object();
            types[l.type].count = 1;
        }
        else{
            types[l.type].count++;   
        }
    }
    var dataTip = [];
    for (key in types) {
      var e= new Object;
      e.type = key;
      e.count= types[key].count;
      dataTip.push(e);
      //  str+= "-"+key+": <span style='color:"+getColor(key)+ "'>" + types[key] + "</span> <br>"
    }
    
    var tip_svg = d3.select('.d3-tip').append('svg')
      .attr("width", tipWidth)
      .attr("height", 60);

    // background rows  
    tip_svg.selectAll(".tipTypeRect").data(dataTip)
      .enter().append('rect')
      .attr("class", "tipTypeRect")
      .attr("x", 0)
      .attr("y", function(d2, index){
        types[d2.type].y = 10+index*15;  
        return types[d2.type].y;
      })
      .attr("width", tipWidth)
      .attr("height", 15)
      .style("text-anchor", "end")
      .style("fill", function(d,index){
        if (index%2==0)
          return "#333";
        else
          return "#222";
      })
      .on('mouseover', function(d) {
        svg.selectAll(".tipTypeRect")
          .style("stroke" , function(d2){
            if (d==d2){
              return "#000";
            }
          });   
      })
      .on('mouseout', function(){
         svg.selectAll(".tipTypeRect")
          .style("fill" ,"#f00");  
      });
    
     

    tip_svg.selectAll(".tipTypeText").data(dataTip)
      .enter().append('text')
      .attr("class", "tipTypeText")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("x", 105)
      .attr("y", function(d2){return types[d2.type].y;})
      .attr("dy", "0.90em")
      .style("text-anchor", "end")
      .text(function(d2){
        return d2.type;
      })
      .style("fill", function(d2){
         return getColor(d2.type);
      });

    


    var dotRadius =5;    
    tip_svg.selectAll(".tipType").data(curNode.directLinks)
      .enter().append('circle')
      .attr("class", "tipType")
        .attr('r',dotRadius)
        .attr('cx',function(l, index){
          if (types[l.type].currentIndex==undefined){
            types[l.type].currentIndex=0;
          }
          else{
            types[l.type].currentIndex++;
          }
          return 115+types[l.type].currentIndex*2*dotRadius;
        })
        .attr('cy',function(l){
          return types[l.type].y+7;
        })
        .style("fill", function(d2){
           return getColor(d2.type);
        });
}