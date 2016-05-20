var request = require('request');
var http = require('http');
var server = http.createServer(function (req, resp) {
  resp.setHeader('Access-Control-Allow-Origin', '*');

//  request.get('http://www.pathwaycommons.org/' + req.url).pipe(resp);//
//  request.get('http://localhost:8080/' + req.url).pipe(resp);//
  var str = "http://www.cbioportal.org/webservice.do?"+ req.url.substring(1, req.url.length);	
  console.log("str= "+str);  
  request.get(str).pipe(resp);
  //request.get("http://www.cbioportal.org/webservice.do?cmd=getProfileData&case_set_id=blca_tcga_pub_rna_seq_v2_mrna&genetic_profile_id=blca_tcga_pub_mutations&gene_list=TP53").pipe(resp);
  
  console.log("Server is waiting on 7777");
});
server.listen('7777');
