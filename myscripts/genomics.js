var cBioPortalData = {};

function getGenomics(){
	var str ="";
    nodes2.forEach(function(d,i){
    	var text = d.ref.fields.entity_text;
    	if (cBioPortalData[text]==undefined){
    		cBioPortalData[text] = {};
    		cBioPortalData[text].altered=0;
	    	if (str=="")
	      		str+=text;
	      	else 
	      		str+=","+text;
      	}
    });
    console.log("cBioPortal names= "+str);
  
    //var cBioPortalData = {"HGF":{"altered":0.015267175572519083},"STAT3":{"altered":0.015267175572519083},"PTK6":{"altered":0.007633587786259542},"IGF1":{"altered":0.007633587786259542},"EGFR":{"altered":0.0916030534351145},"CX3CL1":{"altered":0.05343511450381679},"MMP12":{"altered":0.04580152671755725},"BCR":{"altered":0.05343511450381679},"AR":{"altered":0.007633587786259542},"IL6":{"altered":0.061068702290076333},"CXCL12":{"altered":0.04580152671755725},"PIK3CA":{"altered":0.24427480916030533},"IL8":{"altered":0.05343511450381679},"TRAF6":{"altered":0.030534351145038167}};
    var request = '/pcviz/cancer/context/blca_tcga_pub/mutation,cna,exp/'+str;   //PIK3CA,Akt,p70,TRAF6,Src,ERK,Ras,NFkappaB,IL6,IL1R,IGF1,pioglitazone,PTK6,Acrp30,p110alpha,Insulin,Myostatin,PKC,PI3K,hUCBSC,dasatinib,EGFR,HGF,result,Met,Abl,CskKD,Cox,PI3kinase,CagA,CX3CL1,IRAK,IL8,damage,MMP12,tobacco,SL327,cocaine,sorafenib,FGF,p16INK4A,Rb,TheMEK,p65,NOS,actin,TGFbeta1,pERK,CXCL12,cisplatin,PKCdelta,TNFalpha,bFGF,STAT5,GTP,CD45+,HRas,cRaf,genistein,AID,IKKDN,BCR,IKK,RANKL,prdm1,BCG,MOL294,PMX464,CDK,Tax,curcumin,LPS,SAA3,DR5,undefined,PDTC,SN50,sodium,salicylate,syntenin,Nnat,ANGII,OVA,CyP,IL1beta,EDN,AR,PGN,PAF,GSK3,STAT3,HPs,gp120,Tat,Th1,EGCG,DNFB'
	d3.json('http://localhost:8777' + request)
	 .get()
	 .on('load', function(d) { 
	 	console.log(d); 

	 	for (key in d) {
	 		cBioPortalData[key] = d[key];
	 	}	
	    
	 	var arr = [];
	    for (key in cBioPortalData) {
	      var e= new Object;
	      e.text = key;
	      e.altered= Math.sqrt(cBioPortalData[key].altered);
	      arr.push(e);
	    }

	    if (arr.length>0){  // If there are some data from cBioPortal
		    arr.sort(function (a, b) {
		      if (a.altered > b.altered) {
		        return -1;
		      }
		      if (a.altered < b.altered) {
		        return 1;
		      }
		      return 0;
		    });  

		    var sc = d3.scale.linear()
		      .domain([0, arr[0].altered])
		      .range([222, 0]);

		    svg2.selectAll(".node")
		      .style("fill" , function(d){
		        if (cBioPortalData[d.ref.fields.entity_text]){
		          var altered = Math.sqrt(cBioPortalData[d.ref.fields.entity_text].altered);
		          var sat = Math.floor(sc(altered));
		          console.log("sat="+sat);
		          return "rgb("+222+", "+sat+", "+222+")" ;
		        }  
		        else
		          return "rgb("+222+", "+222+", "+222+")" ;
		    });  
	    }   	
	});    
}