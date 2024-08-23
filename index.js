const accounts = [
    { emailAddress: "phamngoctue556@gmail.com", password: "dsvf wekv kkbw dvmj" },
    { emailAddress: "vuthaonguyen262@gmail.com", password: "njsd ylvt xtsu lurb" },
    { emailAddress: "phamthanhquang420@gmail.com", password: "ncgk wkpl lovr tctv" },
    { emailAddress: "maithucloan314@gmail.com", password: "bnlc vers kfrm nekt" },
    { emailAddress: "nguyenbaduong462@gmail.com", password: "kvin imec vozw ket" },
    { emailAddress: "lehuuthien557@gmail.com", password: "jotl fevn pbuq whow" },
    { emailAddress: "phanthaoyen641@gmail.com", password: "qtil lcha ztgr ixfw" },
    { emailAddress: "nguyencaodai217@gmail.com", password: "ahco sxdx kijr ivkp" },
    { emailAddress: "nguyencaocuong577@gmail.com", password: "bpzz zfwh zygl uecz" },
    { emailAddress: "votrucanh273@gmail.com", password: "catg aigg shuq nzdr" },
    { emailAddress: "leconghung813@gmail.com", password: "gzjp qzip ewbc ibwn" },
    { emailAddress: "vunhatminh534@gmail.com", password: "esfr csan pqcp wrzn" },
    { emailAddress: "vovanthuan751@gmail.com", password: "hcqz xmfu skov xish" },
    { emailAddress: "lethuylam444@gmail.com", password: "dowd hzxi udwx buns" },
    { emailAddress: "phamngocthao548@gmail.com", password: "wing imyn dxjv gugv" },
    { emailAddress: "phamthuytram264@gmail.com", password: "psfw soxl dkfy ijmz" },
    { emailAddress: "nguyendiemphuc558@gmail.com", password: "hobg hjdb jefh jfha" },
    { emailAddress: "tranhoangvu948@gmail.com", password: "yfdi gldf qmvj airx" },
    { emailAddress: "tangthehien541@gmail.com", password: "aksb utdr saov uzwt" }
];


const axios = require('axios');


accounts.forEach(account => {
    let data = JSON.stringify({
        "id": 0,
        "emailAddress": account.emailAddress,
        "password": account.password,
        "isLive": true
      });
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://server-mail.tunaapi.click/api/Email',
        headers: { 
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,vi;q=0.7', 
          'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0dW5hIiwiZW1haWwiOiJhZG1pbjMxIiwianRpIjoiMTY5M2RjNDMtNjk2ZC00N2VkLTkzMTEtZTdmMjhkMzkxNTA2IiwiZXhwIjoxNzI0MzI0OTAwLCJpc3MiOiJuZ3V5ZW5kaW5odHVhbiIsImF1ZCI6Im5ndXllbmRpbmh0dWFuIn0.1SVQN9lQNmvi59p0YMkO5lnKEXQfX-qVaOI_ZoYdgQo', 
          'Connection': 'keep-alive', 
          'Content-Type': 'application/json', 
          'Origin': 'http://server-mail.tunaapi.click', 
          'Referer': 'http://server-mail.tunaapi.click/swagger/index.html', 
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', 
          'accept': '*/*'
        },
        data : data
      };
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
});


// const xoa = [
//     39,
//     40,
//     41,
//     42,
//     43,
//     44,
//     45,
//     46,
//     47,
//     48,
//     49,
//     50,
//     51,
//     52,
//     53,
//     54,
//     55
//   ]


    
//   xoa.forEach(id => {
//     let config = {
//         method: 'delete',
//         maxBodyLength: Infinity,
//         url: `http://server-mail.tunaapi.click/api/Email/${id}`,
//         headers: { 
//           'accept': '*/*', 
//           'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0dW5hIiwiZW1haWwiOiJhZG1pbjMxIiwianRpIjoiMTY5M2RjNDMtNjk2ZC00N2VkLTkzMTEtZTdmMjhkMzkxNTA2IiwiZXhwIjoxNzI0MzI0OTAwLCJpc3MiOiJuZ3V5ZW5kaW5odHVhbiIsImF1ZCI6Im5ndXllbmRpbmh0dWFuIn0.1SVQN9lQNmvi59p0YMkO5lnKEXQfX-qVaOI_ZoYdgQo'
//         }
//       };
      
//       axios.request(config)
//       .then((response) => {
//         console.log(JSON.stringify(response.data));
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   });