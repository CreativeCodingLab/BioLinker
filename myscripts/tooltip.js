var tipWidth = 300;
var tipSVGheight = 200;
var tip_svg;
var y_svg;

var colorHighlight = "#fc8";
var buttonColor = "#ddd";
var cellHeight = 14;


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-(tipSVGheight),-tipWidth/2])
  .style('border', '0.5px solid #bbb');

function checkMouseOut(d, tipItem){
  var isOut=false;
   var coordinate = d3.mouse(tipItem);
  //console.log ("  mouseout"+d3.mouse(this));
  if (coordinate[0]<0 || coordinate[0]>=tipWidth+20 || coordinate[1]<=0 || coordinate[1]>=tipSVGheight+11){
    isOut = true;
  }
  return isOut;
}

function showTip(d) {
  
  y_svg = -5; // inital y position     

  if (d.source==undefined && d.target==undefined){ // this is a vertex
    tip.html(function(d) {
      var str ="";
      return str; 
    });
    tip.offset([-(tipSVGheight+10),-tipWidth/2])

    tip.show(d);
     
    tip_svg = d3.select('.d3-tip').append('svg')
      .attr("width", tipWidth)
      .attr("height", tipSVGheight);

    addText(d);
    addDotplots(d,"type", "Interaction types");
    //addDotplots(d,"Context_Species", "Context-Species", speciesMap);
    //addDotplots(d,"Context_Organ", "Context-Organ", organMap);
    //addDotplots(d,"Context_CellType", "Context-CellType",celltypeMap);
  }
  else if (d.source && d.target){
    tip.offset([-20,-0])
    .html(function(d) {
      var str ="";
      for (key in d) {
        if (key== "source" || key== "target")
          str+=  key+": <span style='color:darkblue'>" + d[key].ref.fields.entity_text + "</span><br>";
        else if (key== "list"){
          var list = "";
          for (var i=0; i< d[key].length; i++){
            var l = d[key][i];
            if (i==d[key].length-1)
              list+="PMC"+l.ref.pmc_id;
            else
              list+="PMC"+l.ref.pmc_id+", ";
          }  
          str+=  key+": <span style='color:darkblue'>" + list + "</span><br>"; 
        }
        else   
          str+=  key+": <span style='color:darkblue'>" + d[key] + "</span><br>";
      } 
      return str; 
    });
    tip.show(d);
  }  
  d3.select('.d3-tip')
  .on("mouseout", function(){
    if (checkMouseOut(d, this)){
      tip.hide(d);
    }    
  }) 
}     

function addText(d){
   var curNode = d;
  if (curNode.ref!=undefined){
      curNode = curNode.ref;
  }

  var list =[];
  for (key in curNode.fields) {
    var e = new Object;
    e.key = key;
    e.value = curNode.fields[key];
    list.push(e);
  }  

    tip_svg.selectAll(".tipText").data(list)
      .enter().append('text')
      .attr("class", "tipText")
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("x", 0)
      .attr("y", function(d2){ 
        return y_svg+=cellHeight;
      })
      .style("text-anchor", "start")
      .text(function(d2){
        return d2.key+": "+d2.value;
      })
      .style("fill", "#222");
  //}
}

function addDotplots(d,fieldName,label, map){
  y_svg += 20; // inital y position     
  var curNode = d;
  if (curNode.ref!=undefined){
      curNode = curNode.ref;
  }
  
  curNode.directLinks.sort(function (a, b) {
      if (a.type > b.type) {
          return 1;
      }
      if (a.type < b.type) {
          return -1;
      }
      return 0;
  }); 

     // Compute statistics for neighbors ***************************************
    var types = new Object();
    for (var i=0; i<curNode.directLinks.length;i++){
      var l = curNode.directLinks[i];
      if (types[l[fieldName]]==undefined){
          types[l[fieldName]] = new Object();
          types[l[fieldName]].count = 1;
      }
      else{
          types[l[fieldName]].count++;   
      }
      if (types[l[fieldName]].list==undefined)
        types[l[fieldName]].list = [];
      types[l[fieldName]].list.push(l); 
    }
    if (d["tip_"+fieldName]==undefined){
      d["tip_"+fieldName] = [];
      d["ylabel_"+fieldName] = y_svg-4;
      for (key in types) {
        var e= new Object;
        e[fieldName] = key;
        e.count= types[key].count;
        e.list= types[key].list;        
        e.isEnable = true;
        e.backgroundColor = "#fff";
        e.stroke= "#000";
        e.y = y_svg;  
        y_svg+=cellHeight;  // the next y position
        d["tip_"+fieldName].push(e);
        d["tip_"+fieldName][e[fieldName]] =e; // hash from type to the actual element
      }
    }
    // Label ********************************************************
  tip_svg.append('text')
    .attr("class", "tiplabel_"+fieldName)
    .attr("x", 0)
    .attr("y", d["ylabel_"+fieldName])
    .style("font-family", "sans-serif")
    .style("font-size", "12px")
    .style("font-weight", "bold")
    .style("text-anchor", "start")
    .text(label)
    .style("fill", "#000");
  
    

    // background rows ********************************************************
    tip_svg.selectAll(".tipTypeRect_"+fieldName).data(d["tip_"+fieldName])
      .enter().append('rect')
      .attr("class", "tipTypeRect_"+fieldName)
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("x", 10)
      .attr("y", function(d2, index){
        return d2.y;
      })
      .attr("width", tipWidth-10)
      .attr("height", cellHeight)
      .style("text-anchor", "end")
      .style("fill", function(d2,index){
        return d2.backgroundColor;
      })
      .style("stroke-width", 0.1)
      .style("stroke", function(d2){
        return d2.stroke;
      })
      .on('mouseover', mouseoverType)
      .on('mouseout', mouseoutType)
      .on('click', clickType);
     


    tip_svg.selectAll(".tipTypeText_"+fieldName).data(d["tip_"+fieldName])
      .enter().append('text')
      .attr("class", "tipTypeText_"+fieldName)
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("x", 125)
      .attr("y", function(d2){return d2.y;})
      .attr("dy", "0.90em")
      .style("text-anchor", "end")
      .text(function(d2){
        return getContextFromID(d2[fieldName],map);
        
      })
      .style("fill", function(d2){
         return getColor(d2[fieldName]);
      })
      .on('mouseover', mouseoverType)
      .on('mouseout', mouseoutType)
      .on('click', clickType);

    function mouseoverType(d){
      tip_svg.selectAll(".tipTypeRect_"+fieldName)
          .style("fill" , function(d2){
            if (d[fieldName]==d2[fieldName]){
              return "#fca";
            }
            else
              return d2.backgroundColor;
      });  
    } 

    function mouseoutType(d2){
      setTypeColor(d2);
    } 
    function clickType(d2){
      d2.isEnable = !d2.isEnable;
      for (var i=0; i<curNode.directLinks.length;i++){
        var l = curNode.directLinks[i];
        item.isEnable = d2.isEnable;
      }
      setTypeColor(d2);
    } 

    function setTypeColor(d2){
      tip_svg.selectAll(".tipTypeRect_"+fieldName)
        .style("fill" , function(d4){
            return d4.backgroundColor;
        })
        .style("stroke" , function(d4){
         if (d4.isEnable==true)
            return d4.stroke;
            
        });   
      tip_svg.selectAll(".tipTypeText_"+fieldName)
        .style("fill-opacity" , function(d4){
          if (d4.isEnable==true)
            return 1;
          else 
            return 0.15;
        }); 

      tip_svg.selectAll(".tipTypeArc_"+fieldName)
        .style("fill-opacity" , function(d4){
          var tipdata;
          for (var i=0;i<d["tip_"+fieldName].length;i++){
             if (d["tip_"+fieldName][i][fieldName]==d4[fieldName]) 
                tipdata = d["tip_"+fieldName][i];
          }
          if (tipdata.isEnable==true)
            return 1;
          else 
            return 0.1;
        })   
    }

  tip_svg.selectAll(".tipTypeArc_"+fieldName).data(curNode.directLinks)
    .enter().append('path')
    .attr("class", "tipTypeArc__"+fieldName)
    .style("fill-opacity", 0)
    .style("stroke", function (l) {
        return getColor(l.type);
    })
    .style("stroke-width", 1.5)
    .attr("d", function(l){
      if (types[l[fieldName]].currentIndex==undefined){
          types[l[fieldName]].currentIndex=0;
      }
      else{
        types[l[fieldName]].currentIndex++;
      }
      var xx = 130+types[l[fieldName]].currentIndex*3;
      var yy = d["tip_"+fieldName][l[fieldName]].y+2;
      var rr = 5;
      return "M" + xx + "," + yy + "A" + rr + "," + rr*1.2 + " 0 0,1 " + xx + "," + (yy+rr*2);
    });  
  
  /*
      .attr('r',dotRadius)
      .attr('cx',function(l, index){
        if (types[l[fieldName]].currentIndex==undefined){
          types[l[fieldName]].currentIndex=0;
        }
        else{
          types[l[fieldName]].currentIndex++;
        }
        return 135+types[l[fieldName]].currentIndex*2*dotRadius;
      })
      .attr('cy',function(l){
        return  d["tip_"+fieldName][l[fieldName]].y+7;  // Get the y position of a type
      })
      .style("fill", function(d2){
         return getColor(d2.type);
      });*/


  d["tip_"+fieldName].forEach(function(d2){   // make sure disable types are greyout on the second mouse over
    mouseoutType(d2);
  });   
}




