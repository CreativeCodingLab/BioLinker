var request = require('request');
var http = require('http');
var server = http.createServer(function (req, resp) {
  console.log(req.url);
  resp.setHeader('Access-Control-Allow-Origin', '*');

//  request.get('http://www.pathwaycommons.org/' + req.url).pipe(resp);//
//  request.get('http://localhost:8080/' + req.url).pipe(resp);//
  request.get("http://www.cbioportal.org/webservice.do?cmd=getProfileData&case_set_id=blca_tcga_pub_rna_seq_v2_mrna&genetic_profile_id=blca_tcga_pub_mutations&gene_list=TP53").pipe(resp);
  console.log("Done server");
});
server.listen('7777');
