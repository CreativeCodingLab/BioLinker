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
    if (d.dataTip==undefined){
      d.dataTip = [];
      for (key in types) {
        var e= new Object;
        e.type = key;
        e.count= types[key].count;
        e.isEnable = true;
        e.backgroundColor = "#000";
        d.dataTip.push(e);
        d.dataTip[e.type] =e; // hash from type to the actual element
      }
    }

    var tip_svg = d3.select('.d3-tip').append('svg')
      .attr("width", tipWidth)
      .attr("height", 60);

    // background rows  
    tip_svg.selectAll(".tipTypeRect").data(d.dataTip)
      .enter().append('rect')
      .attr("class", "tipTypeRect")
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("x", 0)
      .attr("y", function(d2, index){
        types[d2.type].y = 10+index*15;  
        return types[d2.type].y;
      })
      .attr("width", tipWidth)
      .attr("height", 15)
      .style("text-anchor", "end")
      .style("fill", function(d2,index){
        return d2.backgroundColor;
      })
      .style("stroke", function(d2){
        d2.stroke= "#888";
        return d2.stroke;
      })
      .on('mouseover', mouseoverType)
      .on('mouseout', mouseoutType)
      .on('click', clickType);
     


    tip_svg.selectAll(".tipTypeText").data(d.dataTip)
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
      })
      .on('mouseover', mouseoverType)
      .on('mouseout', mouseoutType)
      .on('click', clickType);

    function mouseoverType(d){
      tip_svg.selectAll(".tipTypeRect")
          .style("fill" , function(d2){
            if (d.type==d2.type){
              return "#ffc";
            }
      });  
    } 

    function mouseoutType(d2){
      setTypeColor(d2);
    } 
    function clickType(d2){
      d2.isEnable = !d2.isEnable;
      setTypeColor(d2);
    } 

    function setTypeColor(d2){
      tip_svg.selectAll(".tipTypeRect")
        .style("fill" , function(d4){
            return d4.backgroundColor;
        })
        .style("stroke" , function(d4){
         if (d4.isEnable==true)
            return d4.stroke;
            
        });   
      tip_svg.selectAll(".tipTypeText")
        .style("fill" , function(d4){
          if (d4.isEnable==true)
            return getColor(d4.type);
          else 
            return "#555";
        }); 

      tip_svg.selectAll(".tipTypeDot")
        .style("fill" , function(d4){
          var tipdata;
          for (var i=0;i<d.dataTip.length;i++){
             if (d.dataTip[i].type==d4.type) 
                tipdata = d.dataTip[i];
          }
         // debugger;
          if (tipdata.isEnable==true)
            return getColor(d4.type);
          else 
            return "#555";
        })   
    }

    var dotRadius =5;    
    tip_svg.selectAll(".tipTypeDot").data(curNode.directLinks)
      .enter().append('circle')
      .attr("class", "tipTypeDot")
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

    d.dataTip.forEach(function(d2){   // make sure disable types are greyout on the second mouse over
      mouseoutType(d2);
    });   

    // Add control buttons
  if (d.dataTip==undefined){
      d.dataTip = [];
      for (key in types) {
        var e= new Object;
        e.type = key;
        e.count= types[key].count;
        e.isEnable = true;
        e.backgroundColor = "#000";
        d.dataTip.push(e);
        d.dataTip[e.type] =e; // hash from type to the actual element
      }
  }

}