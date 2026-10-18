'use strict';
const FactoryModel=(()=>{
  const VERSION='1.2.0';
  const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,Number(v)||0));
  function scale({pods=2,quality=240,outage=false,utilities=true}={}){
    const count=Math.round(clamp(pods,1,6)),active=count-(outage?1:0),cap=clamp(quality,0,600);
    const potential=active*100,output=utilities?Math.min(potential,cap):0;
    const bottleneck=!utilities?'utilities':potential===0?'production':cap<potential?'quality':cap===potential?'balanced':'production';
    return {count,active,potential,quality:cap,output,held:utilities?potential-output:0,bottleneck,utilities:!!utilities,outage:!!outage};
  }
  function curve(input={}){return Array.from({length:6},(_,i)=>scale({...input,pods:i+1}));}
  const WALKTHROUGH=Object.freeze([
    {id:'start',input:{pods:2,quality:240},reference:{pods:2,quality:240}},
    {id:'double',input:{pods:4,quality:240},reference:{pods:2,quality:240}},
    {id:'checks',input:{pods:4,quality:400},reference:{pods:2,quality:240}},
    {id:'local',input:{pods:4,quality:400,outage:true},reference:{pods:4,quality:400}},
    {id:'shared',input:{pods:4,quality:400,utilities:false},reference:{pods:4,quality:400}}
  ].map(s=>Object.freeze({...s,input:Object.freeze(s.input),reference:Object.freeze(s.reference)})));
  function compare(reference,input){const before=scale(reference).output,after=scale(input).output,delta=after-before;return {before,after,delta,percent:before===0?null:delta/before*100};}
  const ZONES=Object.freeze([
    {name:'The room',tag:'THE ROOM',title:'Getting the room ready',copy:'Think of the shell as a controlled room wrapped around the equipment. It can make a setup easier to repeat, but it still needs air handling, cleaning, maintenance and suitable connections wherever it is installed.',outside:'The rest of the operation includes the host site, incoming supplies, waste handling and the quality system that oversees the process.'},
    {name:'Materials & transfer',tag:'01 / MATERIALS',title:'Follow the materials',copy:'Before production starts, a team needs to know what each material is, whether it is in the right condition and where it came from. The same goes for the containers that will hold the medicine.',outside:'That connects the pod to approved suppliers, storage, staff and the records for each batch.'},
    {name:'The process',tag:'02 / PROCESS',title:'A module has a particular job',copy:'This station represents one controlled step in making a particular medicine. Change the product, and the equipment, cleaning procedures or validation work may need to change too.',outside:'Ask which steps happen inside the module, and where the rest of the work is done.'},
    {name:'Robotic filling',tag:'03 / ROBOTICS',title:'What the robot contributes',copy:'Cost Plus describes robotic aseptic filling at its Dallas site. The amber arm here illustrates one contribution: repeating a physical handling task within a controlled process. It isn’t a copy of that factory’s equipment.',outside:'A robot is not automatically an AI system. To judge the AI claim, we’d need to know which task the software performs and how it was tested.'},
    {name:'Checks & release',tag:'04 / QUALITY',title:'Before a batch can be released',copy:'Making a batch is not the last job. Checks, records and the appropriate quality decisions help establish whether it can be released. This desk stands for work that may be shared across sites or done elsewhere.',outside:'Quality controls also run throughout production. The capacity test isolates one shared checking-and-release step so you can see its effect on output.'}
  ].map(Object.freeze));
  return Object.freeze({VERSION,scale,curve,WALKTHROUGH,compare,ZONES});
})();
if(typeof module!=='undefined'&&module.exports)module.exports=FactoryModel;
