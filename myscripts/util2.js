/* 2016 
 * Tuan Dang (on the BioLinker project, as Postdoc for EVL, UIC)
 *
 * THIS SOFTWARE IS BEING PROVIDED "AS IS", WITHOUT ANY EXPRESS OR IMPLIED
 * WARRANTY.  IN PARTICULAR, THE AUTHORS MAKE NO REPRESENTATION OR WARRANTY OF ANY KIND CONCERNING THE MERCHANTABILITY
 * OF THIS SOFTWARE OR ITS FITNESS FOR ANY PARTICULAR PURPOSE.
 */

// Construct conflicting examples ********************
function conflitExamples(){
  svg2.append('text')
    .attr("class", "buttonTitle")
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("x", width-80)
    .attr("y", 14)
    .text("Conflicting examples:")
    .style("text-anchor", "middle")
    .style("fill", "#000");
   
    var list = {};
    links.forEach(function(l){
      if (list[l.name]==undefined)
        list[l.name] =[];
      list[l.name].push(l) 
    });

    var a = [];
    for (var key in list) {
      if (list[key].length>1){
        var isIncrease = false;
        var isDecrease = false;
        for (var i=0; i<list[key].length;i++){
          if (list[key][i].type=="increases_activity")
            isIncrease = true;
          if (list[key][i].type=="decreases_activity")
            isDecrease = true;
        }
        if (isIncrease && isDecrease){
          a.push(key);
        }
      }
    }
    var buttonWidth =130;
    var buttonheight =15;
    var roundConner = 4;
    var colorHighlight = "#f80";
    var buttonColor = "#ddd";

    svg2.selectAll(".buttonText").data(a).enter()
      .append('text')
      .attr("class", "buttonText")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("x", width-buttonWidth/2-2)
      .attr("y", function(d,i){
        return 31+i*buttonheight;
      })
      .text(function(d){
        return d;
      })
      .style("text-anchor", "middle")
      .style("fill", "#000");
    svg2.selectAll(".buttonRect").data(a).enter()
      .append('rect')
      .attr("class", "buttonRect")
      .attr("x", width-buttonWidth-2)
      .attr("y", function(d,i){
        return 20+i*buttonheight;
      })
      .attr("rx", roundConner)
      .attr("ry", roundConner)
      .attr("width", buttonWidth)
      .attr("height", buttonheight)
      .style("stroke", "#000")
      .style("stroke-width", 0.1)
      .style("fill", function(d){
        if (d=="TGF-beta__IL-17" || d=="EGCG__MMP-13")
          return "#f88";
        else if (list[d].length>2)
          return "#888";
        else 
          return buttonColor;
      })
      .style("fill-opacity", 0.3)
      .on('mouseover', function(d2){
        svg2.selectAll(".buttonRect")
            .style("fill", function(d4){
              if (d4==d2)
                return colorHighlight;
              else if (list[d4].length>2)
                return "#888";
              else  
                return buttonColor;
            });
      })
      .on('mouseout', function(d2){
        svg2.selectAll(".buttonRect")
            .style("fill", function(d4){
                if (d4=="TGF-beta__IL-17" || d4=="EGCG__MMP-13")
                  return "#f88";
                else if (list[d4].length>2)
                  return "#888";
                else 
                  return buttonColor;
            });
      })
      .on('click', function(d2){
         svg2.selectAll(".buttonRect")
          .style("stroke-width", function(d4){
            if (d4==d2)
              return 1;
            else  
              return 0.1;
         });

        secondLayout(list[d2][0].source.id);

      });         
 }