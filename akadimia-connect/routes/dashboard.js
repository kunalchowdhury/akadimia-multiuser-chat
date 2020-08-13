const express = require("express");
const cache = require('memory-cache');
const nodeRedis = require("redis");
const nodeClient = nodeRedis.createClient();


const router = express.Router();
const map = new Map();
// Display the dashboard page

router.get("/", (req, res) => {

  console.log(cache.get('currentUser'));
  let email = cache.get('currentUser');
  if(map.size === 0) {
    nodeClient.get('email_id', function (err, reply) {
      let ids = reply.split(";");
      let curId;
      ids.forEach(el => {
        let idEmail = el.split("=");
        map.set(idEmail[0], idEmail[1]);
        if(idEmail[0] === cache.get('currentUser')){
          curId = idEmail[1];
        }
      });
      if(curId){
        cache.del('currentUser');
        res.writeHead(301,
            {Location: 'https://192.168.1.3:3000/?user='+map.get(email)}
        );
        res.end();
      }
    });
  }else {
    cache.del('currentUser');
    if(map.has(email)) {
      res.writeHead(301,
          {Location: 'https://192.168.1.3:3000/?user='+map.get(email)}
      );
      res.end();

    }

  }
});


module.exports = router;
