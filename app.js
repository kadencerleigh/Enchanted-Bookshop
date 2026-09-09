(function(){
"use strict";
var KEY="enchanted-bookshop-v3", SERIES_KEY="enchanted-bookshop-series-v4", SYNC_KEY="enchanted-bookshop-sync", META_CACHE_KEY="enchanted-bookshop-metadata-cache-v4-7-7", WORK_INTEL_KEY="enchanted-bookshop-work-intelligence-v4-7-8", deferredInstall=null;
var META_CACHE_TTL=7*24*60*60*1000;
var ATMOSPHERE_KEY="enchanted-bookshop-atmosphere-v4-23";
var ATMOSPHERES=[
 {id:"original",icon:"🌲",name:"Enchanted Bookshop — Original",short:"Original",desc:"Forest green, antique gold, warm cream, candlelight, and quiet celestial magic.",swatches:["#16221c","#d6b676","#51303e"]},
 {id:"cottagecore",icon:"🌼",name:"Cottagecore",short:"Cottagecore",desc:"Soft sage, warm cream, honeyed wood, pressed flowers, and a sunlit cottage-library glow.",swatches:["#71866b","#ead9b8","#b78362"]},
 {id:"rainy",icon:"🌧️",name:"Rainy Bookstore",short:"Rainy Bookstore",desc:"Moody blue-gray, deep green, rainy-window shadows, and warm lamps while the weather stays outside.",swatches:["#253640","#8096a2","#c69b65"]},
 {id:"autumn",icon:"🍂",name:"Autumn Bookshop",short:"Autumn Bookshop",desc:"Burnt orange, rust, burgundy, deep brown, fallen leaves, and golden sweater-weather candlelight.",swatches:["#44261d","#b56f3c","#7b3f3f"]},
 {id:"gothic",icon:"🖤",name:"Gothic Library",short:"Gothic Library",desc:"Near-black stacks, blood-red velvet, oxblood shadows, antique gold, dark roses, and candlelit gothic drama.",swatches:["#080607","#7b1325","#b9975f"]},
 {id:"mushroom",icon:"🍄",name:"Mushroom Forest",short:"Mushroom Forest",desc:"Moss, earthy bark, mushroom red, amber glow, ferns, fungi, and woodland magic tucked between shelves.",swatches:["#263a28","#8a4735","#d2a85e"]}
];
function currentAtmosphere(){var id="original";try{id=localStorage.getItem(ATMOSPHERE_KEY)||"original"}catch(e){}return ATMOSPHERES.some(function(a){return a.id===id})?id:"original"}
function atmosphereInfo(id){return ATMOSPHERES.find(function(a){return a.id===id})||ATMOSPHERES[0]}
function applyAtmosphere(id){var a=atmosphereInfo(id);document.documentElement.setAttribute("data-atmosphere",a.id);try{localStorage.setItem(ATMOSPHERE_KEY,a.id)}catch(e){}var meta=document.getElementById("themeColor"),map={original:"#16221c",cottagecore:"#536451",rainy:"#1c2b33",autumn:"#3a211a",gothic:"#090708",mushroom:"#203023"};if(meta)meta.setAttribute("content",map[a.id]||map.original)}
applyAtmosphere(currentAtmosphere());
function atmospherePage(){var active=currentAtmosphere();var cards=ATMOSPHERES.map(function(a){return '<button class="atmosphere-card '+(a.id===active?'selected':'')+'" data-atmosphere-pick="'+a.id+'" aria-pressed="'+(a.id===active?'true':'false')+'"><div class="atmosphere-preview atmosphere-preview-'+a.id+'"><span class="atmosphere-preview-icon">'+a.icon+'</span><span class="mini-window"></span><span class="mini-shelf"></span><span class="mini-lamp">✦</span></div><div class="atmosphere-card-copy"><div class="atmosphere-name">'+esc(a.name)+'</div><p>'+esc(a.desc)+'</p><div class="atmosphere-swatches">'+a.swatches.map(function(s){return '<i style="background:'+s+'"></i>'}).join('')+'</div><span class="atmosphere-state">'+(a.id===active?'✓ Currently inside':'Enter this atmosphere')+'</span></div></button>'}).join('');var a=atmosphereInfo(active);return '<section class="atmosphere-hero"><div><div class="eyebrow">🎨 V4.23 • BOOKSHOP ATMOSPHERES</div><h1 class="title">Choose the room your books live in.</h1><p class="sub">Same Bookshop. Same data. Same controls. A completely different world whenever you decide to change it.</p><div class="current-atmosphere">'+a.icon+' Current atmosphere: <b>'+esc(a.short)+'</b></div></div><div class="atmosphere-orb">☾✦</div></section><section class="atmosphere-note"><span>🪄</span><div><b>Manual only — exactly as requested.</b><div class="muted">Your choice stays on this device until you change it. No automatic seasons, no time-of-day switching, and no changes to your library data.</div></div></section><section class="atmosphere-grid">'+cards+'</section><div class="insight-note">✨ Atmospheres change the palette, page backdrop, card surfaces, borders, glow, navigation, and decorative details. They do not edit, sync, or reorganize your books.</div>'}

function getMetaCache(){var x={};try{x=JSON.parse(localStorage.getItem(META_CACHE_KEY))||{}}catch(e){}return x}
function getCachedJSON(url){var c=getMetaCache(),r=c[url];if(!r||!r.savedAt||Date.now()-r.savedAt>META_CACHE_TTL)return null;return r.data}
function setCachedJSON(url,data){try{var c=getMetaCache();c[url]={savedAt:Date.now(),data:data};var keys=Object.keys(c);if(keys.length>120){keys.sort(function(a,b){return(c[a].savedAt||0)-(c[b].savedAt||0)});keys.slice(0,keys.length-120).forEach(function(k){delete c[k]})}localStorage.setItem(META_CACHE_KEY,JSON.stringify(c))}catch(e){}}
async function cachedFetchJSON(url){var hit=getCachedJSON(url);if(hit!==null)return{ok:true,status:200,data:hit,fromCache:true};var c=new AbortController(),t=setTimeout(function(){c.abort()},8000);try{var r=await fetch(url,{signal:c.signal});clearTimeout(t);if(!r.ok)return{ok:false,status:r.status,data:null,fromCache:false};var j=await r.json();setCachedJSON(url,j);return{ok:true,status:r.status,data:j,fromCache:false}}catch(e){clearTimeout(t);return{ok:false,status:0,data:null,fromCache:false}}}
var seriesCatalog=[];try{seriesCatalog=JSON.parse(localStorage.getItem(SERIES_KEY))||[]}catch(e){}
function saveSeries(){localStorage.setItem(SERIES_KEY,JSON.stringify(seriesCatalog))}
function seriesId(name){return "s_"+norm(name).replace(/\s+/g,"_")}
function getSeries(name){return seriesCatalog.find(function(s){return norm(s.name)===norm(name)})}
function isOwnedSeriesEntry(entry,books){return books.some(function(b){return norm(b.title)===norm(entry.title)||(b.seriesNo&&entry.number&&String(b.seriesNo)===String(entry.number))})}
function uid(){return "b_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,8)}
function now(){return new Date().toISOString()}
function el(s){return document.querySelector(s)}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]})}
function cleanISBN(v){return String(v||"").replace(/[^0-9Xx]/g,"").toUpperCase()}
function norm(v){return String(v||"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim()}
function spice(n){if(!n)return"🌱";var s="";for(var i=0;i<n;i++)s+="🌶️";return s}
function stars(n){var s="";for(var i=0;i<5;i++)s+=i<n?"★":"☆";return s}

var sample=[
{id:uid(),workId:uid(),title:"The Selection",author:"Kiera Cass",genres:["Romantasy"],series:"The Selection",seriesNo:"1",status:"want-to-read",owned:true,wantOwn:false,rating:0,favorite:false,spice:2,edition:{isbn:"9780062059932",format:"Paperback",publisher:"HarperTeen",publicationDate:"2012",pages:"336",printing:"",special:[]},notes:"",updatedAt:now(),deleted:false},
{id:uid(),workId:uid(),title:"The Elite",author:"Kiera Cass",genres:["Romantasy"],series:"The Selection",seriesNo:"2",status:"want-to-read",owned:true,wantOwn:false,rating:0,favorite:false,spice:2,edition:{isbn:"9780062059949",format:"Paperback",publisher:"HarperTeen",publicationDate:"2013",pages:"336",printing:"",special:[]},notes:"",updatedAt:now(),deleted:false},
{id:uid(),workId:uid(),title:"The One",author:"Kiera Cass",genres:["Romantasy"],series:"The Selection",seriesNo:"3",status:"want-to-read",owned:true,wantOwn:false,rating:0,favorite:false,spice:2,edition:{isbn:"9780062059963",format:"Paperback",publisher:"HarperTeen",publicationDate:"2014",pages:"336",printing:"",special:[]},notes:"",updatedAt:now(),deleted:false}
];
var state=null;
try{state=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!state||!Array.isArray(state.books))state={books:sample,view:"home",filter:"all"};
state.books=state.books.map(function(b){b.updatedAt=b.updatedAt||now();b.deleted=!!b.deleted;b.workId=b.workId||uid();return b});
function save(){localStorage.setItem(KEY,JSON.stringify(state));}
function visible(){return state.books.filter(function(b){return !b.deleted})}
function owned(){return visible().filter(function(b){return b.owned})}
function card(b){
 var tags=(b.genres||[]).slice(0,2);if(b.favorite)tags.push("Favorite");if(b.status==="read")tags.push("Read");
 var actions=b.status==="want-to-read"?'<div class="shelf-card-actions"><button class="primary" data-shelf-view="'+esc(b.id)+'">📕 View Book</button><button class="pill" data-shelf-edit="'+esc(b.id)+'">✏️ Edit</button></div>':'';
 return '<article class="card '+(b.status==="want-to-read"?'shelf-card':'')+'" data-id="'+esc(b.id)+'"><div class="cover">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="">':esc(b.title))+'</div><div class="info"><div class="bt">'+esc(b.title)+'</div><div class="muted">'+esc(b.author)+'</div>'+(b.series?'<div class="muted">'+esc(b.series)+(b.seriesNo?' • #'+esc(b.seriesNo):'')+'</div>':'')+'<div>'+tags.map(function(t){return'<span class="tag">'+esc(t)+'</span>'}).join("")+'</div>'+(b.rating?'<div class="muted">'+stars(b.rating)+'</div>':'')+'<div class="muted">'+detailSpice(b.spice,b.spiceConfidence)+' · '+esc((b.edition&&b.edition.format)||(b.workMetadata&&b.workMetadata.format)||"Edition")+'</div>'+actions+'</div></article>'
}
function shelfCard(b){return card(b)}

function filtered(){
 var q=(el("#search").value||"").toLowerCase().trim();
 return owned().filter(function(b){
  var hay=[b.title,b.author,b.series].concat(b.genres||[],[(b.edition&&b.edition.isbn)||"",(b.edition&&b.edition.publisher)||""]).join(" ").toLowerCase();
  if(q&&hay.indexOf(q)<0)return false;
  if(state.filter==="favorites"&&!b.favorite)return false;
  if(state.filter==="tbr"&&b.status!=="want-to-read")return false;
  if(state.filter==="read"&&b.status!=="read")return false;
  if(state.filter==="spicy"&&(b.spice||0)<3)return false;
  return true;
 })
}

var CHALLENGE_KEY="enchanted-bookshop-reading-challenge-v4-3";
function getChallenges(){var x={};try{x=JSON.parse(localStorage.getItem(CHALLENGE_KEY))||{}}catch(e){}return x}
function saveChallenges(x){localStorage.setItem(CHALLENGE_KEY,JSON.stringify(x))}
function challengeRecords(){
 var x=getChallenges(),out=[];
 Object.keys(x||{}).forEach(function(y){var c=x[y]||{};out.push({id:"challenge-"+y,year:String(y),goal:+c.goal||0,updatedAt:c.updatedAt||"1970-01-01T00:00:00.000Z",deleted:!!c.deleted})});
 return out
}
function recordsToChallenges(records){
 var out={};(records||[]).forEach(function(r){if(r&&r.year&&!r.deleted)out[String(r.year)]={goal:+r.goal||0,updatedAt:r.updatedAt||now()}});
 return out
}
var workIntelligence={};try{workIntelligence=JSON.parse(localStorage.getItem(WORK_INTEL_KEY))||{}}catch(e){}
function saveWorkIntelligence(){localStorage.setItem(WORK_INTEL_KEY,JSON.stringify(workIntelligence))}
function workIntelKey(title,author){return norm(title)+"|"+norm(author)}
function getWorkIntelligence(title,author){var exact=workIntelligence[workIntelKey(title,author)];if(exact)return exact;var t=norm(title);var ks=Object.keys(workIntelligence);for(var i=0;i<ks.length;i++){var r=workIntelligence[ks[i]]||{};if(norm(r.title)===t&&(!author||!r.author||norm(r.author)===norm(author)))return r}return null}
function learnWorkIntelligence(b){if(!b||!b.title)return;var key=workIntelKey(b.title,b.author||""),old=workIntelligence[key]||{},rec={title:b.title,author:b.author||"",genres:uniqText(b.genres||[]),tags:uniqText(b.tags||[]),series:String(b.series||"").trim(),seriesNo:String(b.seriesNo||"").trim(),spice:(+b.spice>0?+b.spice:null),confirmedAt:now(),source:"Confirmed in your Bookshop Brain"};if(!rec.genres.length&&old.genres)rec.genres=old.genres;if(!rec.tags.length&&old.tags)rec.tags=old.tags;if(!rec.series&&old.series){rec.series=old.series;rec.seriesNo=old.seriesNo||""}if(rec.spice===null&&old.spice!=null)rec.spice=old.spice;if(old.knownISBNs)rec.knownISBNs=old.knownISBNs;if(old.updatedAt)rec.updatedAt=old.updatedAt;workIntelligence[key]=rec;saveWorkIntelligence()}
function learnedISBNEntry(isbn){
 isbn=cleanISBN(isbn);if(!isbn)return null;
 var keys=Object.keys(workIntelligence||{});
 for(var i=0;i<keys.length;i++){var rec=workIntelligence[keys[i]]||{},arr=[].concat(rec.knownISBNs||[]);for(var j=0;j<arr.length;j++){var ent=typeof arr[j]==="string"?{isbn:arr[j]}:(arr[j]||{});if(cleanISBN(ent.isbn)===isbn)return{key:keys[i],record:rec,entry:ent}}}
 return null
}
function rememberISBNForWork(isbn,b){
 isbn=cleanISBN(isbn);if(!isbn||!b||!b.title)return null;
 var key=workIntelKey(b.title,b.author||""),rec=workIntelligence[key];
 if(!rec){learnWorkIntelligence(b);rec=workIntelligence[key]||{title:b.title,author:b.author||""}}
 var arr=[].concat(rec.knownISBNs||[]),exists=false;
 arr=arr.map(function(x){var ent=typeof x==="string"?{isbn:x}:(x||{});if(cleanISBN(ent.isbn)===isbn){exists=true;ent.isbn=isbn;ent.learnedAt=ent.learnedAt||now();ent.source=ent.source||"Confirmed by you in Unknown ISBN Rescue"}return ent});
 if(!exists)arr.push({isbn:isbn,learnedAt:now(),source:"Confirmed by you in Unknown ISBN Rescue"});
 rec.knownISBNs=arr;rec.updatedAt=now();rec.source=rec.source||"Confirmed in your Bookshop Brain";workIntelligence[key]=rec;saveWorkIntelligence();autoSyncMaybe();return rec
}
function learnedFoundForISBN(hit,isbn){
 var rec=hit&&hit.record||{};return{title:rec.title||"",author:rec.author||"",genres:(rec.genres||[]).slice(),tags:(rec.tags||[]).slice(),series:rec.series||"",seriesNo:rec.seriesNo||"",cover:"",edition:{isbn:cleanISBN(isbn),name:"",format:"",publisher:"",publicationDate:"",pages:"",printing:"",special:[]}}
}
function yearNow(){return new Date().getFullYear()}
function dateOnly(){var d=new Date(),y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return y+"-"+m+"-"+day}
function readYear(b){return String(b.finishedDate||"").slice(0,4)}
function challengeData(){var y=String(yearNow()),a=getChallenges();if(!a[y])a[y]={goal:0};saveChallenges(a);return{year:y,goal:+a[y].goal||0,done:owned().filter(function(b){return b.status==="read"&&readYear(b)===y}).length,all:a}}
function setChallengeGoal(g){var c=challengeData();c.all[c.year].goal=Math.max(0,+g||0);c.all[c.year].updatedAt=now();saveChallenges(c.all);render();autoSyncMaybe()}
function uniqText(a){var out=[];([].concat(a||[])).forEach(function(x){x=String(x||"").trim();if(x&&out.indexOf(x)<0)out.push(x)});return out}
function firstNonEmpty(){for(var i=0;i<arguments.length;i++){var x=arguments[i];if(x!==undefined&&x!==null&&String(x).trim()!=="")return x}return ""}
function mergeFound(a,b){a=a||{};b=b||{};var ae=a.edition||{},be=b.edition||{};return {title:firstNonEmpty(a.title,b.title),author:firstNonEmpty(a.author,b.author),genres:uniqText([].concat(a.genres||[],b.genres||[])),description:firstNonEmpty(a.description,b.description),cover:firstNonEmpty(a.cover,b.cover),series:firstNonEmpty(a.series,b.series),seriesNo:firstNonEmpty(a.seriesNo,b.seriesNo),workKeys:uniqText([].concat(a.workKeys||[],b.workKeys||[])),edition:{isbn:firstNonEmpty(ae.isbn,be.isbn),name:firstNonEmpty(ae.name,be.name),format:firstNonEmpty(ae.format,be.format),publisher:firstNonEmpty(ae.publisher,be.publisher),publicationDate:firstNonEmpty(ae.publicationDate,be.publicationDate),pages:firstNonEmpty(ae.pages,be.pages),printing:firstNonEmpty(ae.printing,be.printing),special:uniqText([].concat(ae.special||[],be.special||[]))}}}
function mergeWorkSignals(base,extra){base=base||{};extra=extra||{};base.genres=uniqText([].concat(base.genres||[],extra.genres||[]));base.workKeys=uniqText([].concat(base.workKeys||[],extra.workKeys||[]));if(extra.description&&String(extra.description).length>String(base.description||"").length)base.description=extra.description;if(!base.author&&extra.author)base.author=extra.author;if(!base.cover&&extra.cover)base.cover=extra.cover;if(!base.series&&extra.series){base.series=extra.series;base.seriesSuggested=!!extra.seriesSuggested;base.seriesConfidence=extra.seriesConfidence||"";base.seriesSource=extra.seriesSource||""}if(!base.seriesNo&&extra.seriesNo)base.seriesNo=extra.seriesNo;return base}
function knowledgeKey(title,author){return norm(title)+"|"+norm(author)}
var BOOK_KNOWLEDGE={
 "brutal prince|sophie lark":{genres:["Dark Romance","Romance"],tags:["Mafia Romance","Enemies to Lovers","Arranged Marriage"],series:"Brutal Birthright",seriesNo:"1",spice:4,spiceConfidence:"community-informed",source:"Enchanted Bookshop knowledge"}
};
function knownBook(title,author){var learned=getWorkIntelligence(title,author);if(learned)return learned;return BOOK_KNOWLEDGE[knowledgeKey(title,author)]||BOOK_KNOWLEDGE[knowledgeKey(title,"")]||null}
function mapGenres(raw,title,desc,author){var k=knownBook(title,author);if(k&&k.genres)return k.genres.slice();var rawText=[].concat(raw||[]).join(" ").toLowerCase(),descText=((title||"")+" "+(desc||"")).toLowerCase(),a=[];function add(x){if(a.indexOf(x)<0)a.push(x)}
 /* Conservative mapping: categories/subjects carry more weight than stray description words. */
 if(/dark romance|mafia romance/.test(rawText)){add("Dark Romance");add("Romance")}
 else if(/romantasy|fantasy romance|romantic fantasy/.test(rawText)){add("Romantasy");add("Fantasy");add("Romance")}
 else if(/\bromance\b|love stories/.test(rawText))add("Romance");
 if(/\bfantasy\b/.test(rawText)&&a.indexOf("Dark Romance")<0)add("Fantasy");
 if(/mystery|detective/.test(rawText))add("Mystery");if(/thriller|suspense/.test(rawText))add("Thriller");if(/horror/.test(rawText))add("Horror");
 if(/historical fiction/.test(rawText))add("Historical Fiction");if(/science fiction|sci-fi/.test(rawText))add("Science Fiction");if(/dystop/.test(rawText))add("Dystopian");if(/paranormal/.test(rawText))add("Paranormal");
 if(/young adult fiction|juvenile fiction.*young adult/.test(rawText))add("Young Adult");if(/new adult/.test(rawText))add("New Adult");if(/middle grade/.test(rawText))add("Middle Grade");
 if(/nonfiction|non-fiction/.test(rawText))add("Nonfiction");if(/memoir|biograph/.test(rawText))add("Memoir/Biography");if(/true crime/.test(rawText))add("True Crime");if(/psycholog|mental health/.test(rawText))add("Psychology/Mental Health");if(/poetry/.test(rawText))add("Poetry");if(/graphic novel|manga|comics/.test(rawText))add("Graphic Novel/Manga");
 /* Strong description phrases can refine an existing broad category. */
 if(/dark (?:contemporary )?romance|dark romance|mafia romance|dark romantic/.test(descText)){add("Dark Romance");add("Romance")}
 else if(/romantasy|fantasy romance|romantic fantasy/.test(descText)){add("Romantasy");add("Fantasy");add("Romance")}
 else if(!a.length&&/\bromance\b|romantic/.test(descText))add("Romance");
 return a.slice(0,3)}
function inferTags(raw,title,desc,author){var k=knownBook(title,author);if(k&&k.tags)return k.tags.slice();var t=([].concat(raw||[]).join(" ")+" "+(desc||"")).toLowerCase(),a=[];function add(x){if(a.indexOf(x)<0)a.push(x)}if(/mafia|organized crime/.test(t))add("Mafia Romance");if(/enemies[- ]to[- ]lovers|enemies to lovers/.test(t))add("Enemies to Lovers");if(/arranged marriage|forced (?:her|him|their|his) hand in marriage|forcing .* marriage/.test(t))add("Arranged / Forced Marriage");if(/forced proximity|steal(?:s|ing)? .* away|alone with/.test(t))add("Forced Proximity");if(/hades.{0,40}persephone|persephone.{0,40}hades/.test(t))add("Hades & Persephone");if(/age gap|twenty-year-old.{0,80}thirty-two|thirty-two.{0,80}twenty-year-old/.test(t))add("Age Gap");if(/fake dating/.test(t))add("Fake Dating");if(/friends[- ]to[- ]lovers|friends to lovers/.test(t))add("Friends to Lovers");if(/second chance/.test(t))add("Second Chance");return a.slice(0,6)}
function cleanSeriesName(x){return String(x||"").trim().replace(/^[\s,:-]+|[\s,:-]+$/g,"").replace(/\s+(?:book|novel)$/i,"").replace(/\s+series$/i,"").trim()}
function inferSeries(title,desc){var t=((title||"")+" "+(desc||"")).replace(/<[^>]+>/g," ").replace(/\s+/g," "),m;
 m=t.match(/(?:book|volume)\s*(?:#|no\.?\s*)?(\d+(?:\.\d+)?)\s+(?:of|in)\s+(?:the\s+)?([^.;:()]{3,70}?)(?:\s+series)?(?:[.;:()]|$)/i);if(m)return{series:cleanSeriesName(m[2]),seriesNo:m[1]};
 m=t.match(/(?:the\s+)?([^.;:()]{3,70}?)\s+series[,;:]?\s*(?:book|volume)\s*(?:#|no\.?\s*)?(\d+(?:\.\d+)?)/i);if(m)return{series:cleanSeriesName(m[1]),seriesNo:m[2]};
 m=t.match(/(?:first|1st)\s+(?:full[- ]length\s+)?(?:book|novel|installment|story)\s+(?:of|in|from)\s+(?:the\s+)?([^.;:()]{3,70}?)(?:\s+series)?(?:[.;:()]|$)/i);if(m)return{series:cleanSeriesName(m[1]),seriesNo:"1"};
 m=t.match(/(?:begins|launches|starts|kicks off|opens)\s+(?:the\s+)?([^.;:()]{3,70}?)\s+series/i);if(m)return{series:cleanSeriesName(m[1]),seriesNo:"1"};
 m=t.match(/(?:from|in)\s+(?:the\s+)?([A-Z][A-Za-z0-9'’& -]{2,60})\s+series/i);if(m)return{series:cleanSeriesName(m[1]),seriesNo:""};
 m=t.match(/([A-Z][A-Za-z0-9'’& -]{2,60})\s+(?:series|saga)\s*(?:#|no\.?\s*)?(\d+(?:\.\d+)?)/i);if(m)return{series:cleanSeriesName(m[1]),seriesNo:m[2]};
 return{series:"",seriesNo:""}}
function seriesFromCatalog(title){for(var i=0;i<seriesCatalog.length;i++){var s=seriesCatalog[i];if(s.deleted)continue;for(var j=0;j<(s.books||[]).length;j++){if(norm(s.books[j].title)===norm(title))return{series:s.name,seriesNo:s.books[j].number||""}}}return{series:"",seriesNo:""}}
function suggestSpice(gs,d,title,author){var k=knownBook(title,author);if(k&&k.spice!==undefined)return k.spice;var t=((gs||[]).join(" ")+" "+(d||"")+" "+(title||"")).toLowerCase();if(/erotic|erotica|explicit sex|sexually explicit|high heat|open door|very spicy/.test(t))return 5;if(/dark romance|mafia romance|steamy|spicy/.test(t))return 4;return 0}
function spiceConfidence(gs,d,score,title,author){var k=knownBook(title,author);if(k&&k.spiceConfidence)return k.spiceConfidence;if(!score)return"unknown";var t=((gs||[]).join(" ")+" "+(d||"")).toLowerCase();if(/erotic|erotica|explicit sex|sexually explicit|high heat|open door|very spicy|dark romance|mafia romance|steamy|spicy/.test(t))return"metadata signal";return"unknown"}

function normalizedWorkKey(title,author){
 return norm((title||"")+"|"+(author||""))
}
function findCatalogedWorkMatch(title,author){
 var nt=norm(title||""),na=norm(author||"");
 if(!nt)return null;
 var exact=state.books.find(function(b){
  return norm(b.title||"")===nt && (!na || norm(b.author||"")===na)
 });
 if(exact)return exact;
 return state.books.find(function(b){
  var bt=norm(b.title||""),ba=norm(b.author||"");
  return bt===nt && (!na || !ba || ba===na)
 })||null
}
function learnWorkFromCatalogedCopy(book){
 if(!book||!book.title)return null;
 var payload={
  title:book.title||"",
  author:book.author||"",
  genres:Array.isArray(book.genres)?uniqText(book.genres):[],
  tags:Array.isArray(book.tags)?uniqText(book.tags):[],
  series:String(book.series||"").trim(),
  seriesNo:String(book.seriesNo||"").trim(),
  spice:(+book.spice>0?+book.spice:null),
  confirmedAt:now(),
  source:"Confirmed in your cataloged copy"
 };
 if(!(payload.genres.length||payload.tags.length||payload.series||payload.seriesNo||payload.spice!=null))return null;
 workIntelligence[workIntelKey(payload.title,payload.author)]=payload;
 saveWorkIntelligence();
 return payload
}
function getOrBootstrapWorkIntelligence(title,author){
 var learned=getWorkIntelligence(title||"",author||"");
 if(learned)return learned;
 var existing=findCatalogedWorkMatch(title,author);
 if(!existing)return null;
 return learnWorkFromCatalogedCopy(existing)
}

function intelligenceFor(f){var k=knownBook(f.title||"",f.author||""),learned=getOrBootstrapWorkIntelligence(f.title||"",f.author||""),cat=seriesFromCatalog(f.title||""),ser=(k&&k.series)?{series:k.series,seriesNo:k.seriesNo||""}:cat.series?cat:inferSeries(f.title||"",f.description||"");var gs=(learned&&learned.genres&&learned.genres.length)?learned.genres.slice():mapGenres(f.genres||[],f.title||"",f.description||"",f.author||""),tags=(learned&&learned.tags&&learned.tags.length)?learned.tags.slice():inferTags(f.genres||[],f.title||"",f.description||"",f.author||""),ss=suggestSpice(gs,f.description||"",f.title||"",f.author||""),conf=spiceConfidence(gs,f.description||"",ss,f.title||"",f.author||"");if(learned&&learned.spice!=null){ss=+learned.spice;conf="confirmed by you"}var learnedSeries=(learned&&learned.series)?learned.series:"",learnedNo=(learned&&learned.seriesNo)?learned.seriesNo:"";return{genres:gs,tags:tags,series:learnedSeries||ser.series||f.series||"",seriesNo:learnedNo||ser.seriesNo||f.seriesNo||"",spice:ss,spiceConfidence:conf,source:learned?"Confirmed in your Bookshop Brain":(k?(k.source||"Enchanted Bookshop knowledge"):"Public book metadata"),workBrain:!!learned}}
function currentReadingBooks(){return owned().filter(function(b){return b.status==="currently-reading"||b.status==="rereading"})}

var HOME_DASH_KEY="enchanted-bookshop-home-dashboard-v4-16";
var HOME_WIDGET_DEFAULT=["reading","challenge","journal","grail","seriesgap","stats","recent"];
function homeDashSettings(){var x=null;try{x=JSON.parse(localStorage.getItem(HOME_DASH_KEY))}catch(e){};if(!x||!Array.isArray(x.order))x={order:HOME_WIDGET_DEFAULT.slice(),hidden:[]};HOME_WIDGET_DEFAULT.forEach(function(k){if(x.order.indexOf(k)<0)x.order.push(k)});x.hidden=Array.isArray(x.hidden)?x.hidden:[];return x}
function saveHomeDash(x){localStorage.setItem(HOME_DASH_KEY,JSON.stringify(x))}
function latestJournalMemory(){var all=[];owned().forEach(function(b){(b.readingJournal||[]).forEach(function(e){all.push({book:b,entry:e})})});all.sort(function(a,b){return String(b.entry.updatedAt||b.entry.createdAt||b.entry.date||"").localeCompare(String(a.entry.updatedAt||a.entry.createdAt||a.entry.date||""))});return all[0]||null}
function firstSeriesGap(){var found=null;seriesCatalog.filter(function(x){return !x.deleted&&x.confirmed}).some(function(cat){var own=owned().filter(function(b){return norm(b.series)===norm(cat.name)});return (cat.books||[]).some(function(x){if(seriesState(x,own)==="missing"){found={series:cat.name,title:x.title,number:x.number||""};return true}return false})});return found}
function homeWidget(k){
 var o=owned(),read=o.filter(function(b){return b.status==="read"}),fav=o.filter(function(b){return b.favorite}),cur=currentReadingBooks(),ch=challengeData(),pct=ch.goal?Math.min(100,Math.round(ch.done/ch.goal*100)):0;
 if(k==="reading")return '<section class="dashboard-card home-widget"><div class="eyebrow">📖 CURRENTLY READING</div><h2>On the nightstand</h2>'+(cur.length?'<div class="current-grid">'+cur.map(card).join("")+'</div>':'<div class="empty mini">Nothing marked Currently Reading yet.</div>')+'</section>';
 if(k==="challenge")return '<section class="dashboard-card home-widget"><div class="eyebrow">✨ '+ch.year+' READING CHALLENGE</div><div class="challenge-big">'+ch.done+' / '+(ch.goal||"—")+'</div><div class="progress"><i style="width:'+pct+'%"></i></div><div class="muted">'+(ch.goal?(ch.done>=ch.goal?'Goal complete! ✨':Math.max(0,ch.goal-ch.done)+' books to your goal'):'Choose your reading goal for this year.')+'</div><div class="challenge-set"><input id="challengeGoal" type="number" min="0" value="'+(ch.goal||"")+'" placeholder="Goal"><button class="pill" id="saveChallenge">Set goal</button></div></section>';
 if(k==="journal"){var m=latestJournalMemory();return '<section class="dashboard-card home-widget"><div class="eyebrow">🕯️ LATEST READING MEMORY</div>'+(m?'<h2>'+esc(m.book.title)+'</h2><div class="home-memory-meta">'+esc(m.entry.date||'')+(m.entry.page?' • page '+esc(m.entry.page):'')+(m.entry.percent?' • '+esc(m.entry.percent)+'%':'')+(m.entry.mood?' • '+esc(m.entry.mood):'')+'</div>'+(m.entry.reaction?'<blockquote>'+esc(m.entry.reaction)+'</blockquote>':'')+(m.entry.notes?'<p class="muted">'+esc(m.entry.notes)+'</p>':''):'<div class="empty mini">Log a reading session and your newest memory will glow here. ✨</div>')+'</section>'}
 if(k==="grail"){var g=visible().filter(function(b){return b.wantOwn&&wishPriority(b)==="GRAIL"})[0];return '<section class="dashboard-card home-widget"><div class="eyebrow">💎 GRAIL WATCH</div>'+(g?'<div class="home-mini-book">'+(g.cover?'<img src="'+esc(g.cover)+'" alt="">':'<span>📕</span>')+'<div><h2>'+esc(g.title)+'</h2><p>'+esc(g.author||'')+'</p>'+(g.wishTargetPrice?'<small>Target: $'+esc(g.wishTargetPrice)+'</small>':'')+'</div></div>':'<div class="empty mini">No grail marked yet. Your treasure map is behaving suspiciously responsibly. 😂</div>')+'</section>'}
 if(k==="seriesgap"){var gap=firstSeriesGap();return '<section class="dashboard-card home-widget"><div class="eyebrow">🧩 NEXT SERIES GAP</div>'+(gap?'<h2>'+esc(gap.title)+'</h2><p>'+esc(gap.series)+(gap.number?' • #'+esc(gap.number):'')+'</p><button class="pill" data-view-jump="series">Open Series Brain</button>':'<div class="empty mini">No confirmed series gaps right now. ✨</div>')+'</section>'}
 if(k==="stats"){var ser={};o.forEach(function(b){if(b.series)ser[b.series]=1});return '<section class="home-widget home-stat-widget"><div class="stats"><div class="stat"><b>'+o.length+'</b><span>Owned</span></div><div class="stat"><b>'+read.length+'</b><span>Read</span></div><div class="stat"><b>'+fav.length+'</b><span>Favorites</span></div><div class="stat"><b>'+Object.keys(ser).length+'</b><span>Series</span></div><div class="stat"><b>'+visible().filter(function(x){return x.wantOwn}).length+'</b><span>Want to Own</span></div></div></section>'}
 if(k==="recent")return '<section class="home-widget"><div class="eyebrow">📚 FRESH ON THE SHELVES</div><h2>Recently added</h2><div class="grid">'+(o.slice().reverse().slice(0,6).map(card).join("")||'<div class="empty">Your shelves are waiting. ✨</div>')+'</div></section>';
 return ''
}
function homeCustomizer(){var x=homeDashSettings(),names={reading:'📖 Currently Reading',challenge:'✨ Reading Challenge',journal:'🕯️ Latest Reading Memory',grail:'💎 Grail Watch',seriesgap:'🧩 Next Series Gap',stats:'📊 Quick Stats',recent:'📚 Recently Added'};return '<div class="home-customizer hidden" id="homeCustomizer"><div class="eyebrow">🪄 ARRANGE YOUR BOOKSHOP</div><h2>Choose what greets you at home</h2><p class="muted">Show, hide, and rearrange your dashboard. Your layout stays on this device.</p><div class="home-custom-list">'+x.order.map(function(k,i){return '<div class="home-custom-row"><label><input type="checkbox" data-home-toggle="'+k+'" '+(x.hidden.indexOf(k)<0?'checked':'')+'> '+names[k]+'</label><div><button class="tiny" data-home-move="'+k+'" data-dir="-1" '+(i===0?'disabled':'')+'>↑</button><button class="tiny" data-home-move="'+k+'" data-dir="1" '+(i===x.order.length-1?'disabled':'')+'>↓</button></div></div>'}).join('')+'</div><button class="pill" id="resetHomeDashboard">Reset layout</button></div>'}
function home(){var x=homeDashSettings();return '<div class="hero"><div class="eyebrow">🏠 V4.16 • CUSTOMIZABLE HOME</div><h1 class="title">Your enchanted bookshop.</h1><p class="sub">Your reading life, collection, memories, treasure hunts, and series quests — arranged your way.</p><div class="toolbar"><button class="primary" id="homeAddScan">📷 Scan to Add</button><button class="pill" id="homeScan">🛍️ Shopping Scanner</button><button class="pill" id="customizeHome">🪄 Customize Home</button></div></div>'+homeCustomizer()+'<div class="home-dashboard-v416">'+x.order.filter(function(k){return x.hidden.indexOf(k)<0}).map(homeWidget).join('')+'</div>'}

var LIBRARY_VIEW_KEY="enchanted-bookshop-library-view-v4-11";
function libraryView(){var v=localStorage.getItem(LIBRARY_VIEW_KEY)||"covers";return ["covers","cards","list","shelf","stacks"].indexOf(v)>=0?v:"covers"}
function setLibraryView(v){localStorage.setItem(LIBRARY_VIEW_KEY,v)}
function libraryCoverCard(b){return '<article class="library-cover-card" data-library-book="'+esc(b.id)+'"><div class="library-cover-art">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="">':'<span>'+esc(b.title)+'</span>')+'</div><div class="library-cover-title">'+esc(b.title)+'</div><div class="library-cover-author">'+esc(b.author)+'</div></article>'}
function libraryListRow(b){return '<button class="library-list-row" data-library-book="'+esc(b.id)+'"><span class="library-list-thumb">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="">':'📖')+'</span><span class="library-list-main"><b>'+esc(b.title)+'</b><small>'+esc(b.author)+(b.series?' • '+esc(b.series)+(b.seriesNo?' #'+esc(b.seriesNo):''):'')+'</small></span><span class="library-list-state">'+(b.status==="read"?'✓ Read':b.status==="currently-reading"?'Reading':b.status==="rereading"?'Rereading':'TBR')+'</span></button>'}
function libraryShelf(b){return '<div class="witch-shelf"><div class="shelf-books">'+b.map(function(x,i){var h=150+(i%5)*13,w=38+(i%4)*7;return '<button class="shelf-spine shelf-spine-'+(i%6)+'" data-library-book="'+esc(x.id)+'" style="--spine-h:'+h+'px;--spine-w:'+w+'px"><span>'+esc(x.title)+'</span><i>✦</i></button>'}).join("")+'</div><div class="wood-shelf"><span>☾</span><span>✧</span><span>❦</span></div></div>'}
function libraryStacks(b){return '<div class="library-magic-stacks"><div class="magic-stack">'+b.map(function(x,i){var meta=[x.author||"",x.series?(x.series+(x.seriesNo?" • #"+x.seriesNo:"")):""].filter(Boolean).join(" • ");return '<button class="stack-book stack-tone-'+(i%5)+'" data-library-book="'+esc(x.id)+'" style="--stack-shift:'+((i%4)*8)+'px;--stack-tilt:'+(((i%7)-3)*.7)+'deg"><span class="stack-title">'+esc(x.title||"Untitled")+'</span><span class="stack-meta">'+esc(meta)+'</span></button>'}).join("")+'</div></div>'}
function library(){
 var b=filtered(),names={all:"All",favorites:"⭐ Favorites",tbr:"📖 Unread",read:"✅ Read",spicy:"🌶️ Spicy"},v=libraryView();
 var viewNames={covers:"▦ Covers",cards:"▤ Cards",list:"☰ List",shelf:"📚 Shelf",stacks:"🌙 Stacks"};
 var switcher='<div class="library-view-panel"><div><div class="eyebrow">🪄 Shape your shelves</div><h3>View your collection</h3></div><div class="library-view-switcher">'+Object.keys(viewNames).map(function(k){return '<button class="view-chip '+(v===k?'active':'')+'" data-library-view="'+k+'">'+viewNames[k]+'</button>'}).join("")+'</div></div>';
 var body='';if(!b.length)body='<div class="empty">No books match that filter.</div>';else if(v==="covers")body='<div class="library-cover-grid">'+b.map(libraryCoverCard).join("")+'</div>';else if(v==="cards")body='<div class="grid">'+b.map(card).join("")+'</div>';else if(v==="list")body='<div class="library-list">'+b.map(libraryListRow).join("")+'</div>';else if(v==="shelf")body=libraryShelf(b);else body=libraryStacks(b);
 return '<div class="eyebrow">The collection</div><h1 class="title">My Library</h1><p class="sub">One collection, five enchanted ways to wander through it.</p>'+switcher+'<div class="toolbar library-filters">'+Object.keys(names).map(function(k){return'<button class="pill '+(state.filter===k?"active":"")+'" data-filter="'+k+'">'+names[k]+'</button>'}).join("")+'</div><div class="library-view-body" data-current-library-view="'+v+'">'+body+'</div>'
}

function browseGenres(){
 var seen={};
 owned().forEach(function(b){(b.genres||[]).forEach(function(g){if(g)seen[g]=1})});
 return Object.keys(seen).sort(function(a,b){return a.localeCompare(b)})
}
function browseBooks(){
 var genre=state.browseGenre||"All",filter=state.browseFilter||"all";
 return owned().filter(function(b){
  if(genre!=="All"&&(b.genres||[]).indexOf(genre)<0)return false;
  if(filter==="unread")return b.status!=="read";
  if(filter==="read")return b.status==="read";
  if(filter==="favorites")return !!b.favorite;
  if(filter==="spicy")return (+b.spice||0)>=3;
  return true
 })
}
function browse(){
 var genres=["All"].concat(browseGenres());
 if(!state.browseGenre||genres.indexOf(state.browseGenre)<0)state.browseGenre="All";
 state.browseFilter=state.browseFilter||"all";
 var books=browseBooks();
 var genreChips=genres.map(function(g){return'<button class="pill '+(state.browseGenre===g?"active":"")+'" data-browse-genre="'+esc(g)+'">'+esc(g)+'</button>'}).join("");
 var filters=[["all","All"],["unread","📖 Unread"],["read","✅ Read"],["favorites","⭐ Favorites"],["spicy","🌶️ Spicy"]]
  .map(function(x){return'<button class="pill '+(state.browseFilter===x[0]?"active":"")+'" data-browse-filter="'+x[0]+'">'+x[1]+'</button>'}).join("");
 var stack=books.length?'<div class="magic-stack">'+books.map(function(b,i){
   var meta=[b.author||"",b.series?(b.series+(b.seriesNo?" • #"+b.seriesNo:"")):""].filter(Boolean).join(" • ");
   return '<button class="stack-book stack-tone-'+(i%5)+'" data-stack-id="'+esc(b.id)+'" style="--stack-shift:'+((i%4)*8)+'px;--stack-tilt:'+(((i%7)-3)*0.7)+'deg"><span class="stack-title">'+esc(b.title||"Untitled")+'</span><span class="stack-meta">'+esc(meta)+'</span></button>'
  }).join("")+'</div>':'<div class="empty">No books match this magical stack yet. ✨</div>';
 return '<div class="eyebrow">The enchanted shelves</div><h1 class="title">Browse by Genre</h1><p class="sub">Choose a genre, then narrow your shelf into a magical stack.</p>'+
 '<div class="browse-panel"><h3>🌙 Pick a genre</h3><div class="toolbar browse-chips">'+genreChips+'</div></div>'+
 '<div class="browse-panel"><h3>✨ Filter this stack</h3><div class="toolbar browse-chips">'+filters+'</div></div>'+
 '<div class="stack-heading"><div><div class="eyebrow">Current stack</div><h2>'+esc(state.browseGenre)+'</h2></div><div class="stack-count">'+books.length+' book'+(books.length===1?"":"s")+'</div></div>'+
 stack
}

function catalogedSeriesEntry(entry,books){
 return books.some(function(b){return norm(b.title)===norm(entry.title)||(b.seriesNo&&entry.number&&String(b.seriesNo)===String(entry.number))})
}
function ownedSeriesEntry(entry,books){
 return catalogedSeriesEntry(entry,books)||entry.ownedUncataloged===true
}
function seriesState(entry,books){
 if(catalogedSeriesEntry(entry,books))return "cataloged";
 if(entry.ownedUncataloged===true)return "owned";
 return "missing"
}
function seriesSortNumber(x){var n=parseFloat(String(x&&x.number||""));return isNaN(n)?9999:n}
function series(){
 var map={};owned().filter(function(b){return b.series}).forEach(function(b){if(!map[b.series])map[b.series]=[];map[b.series].push(b)});
 seriesCatalog.filter(function(s){return !s.deleted}).forEach(function(s){if(!map[s.name])map[s.name]=[]});
 var names=Object.keys(map).sort(),totalSeries=names.length,completeSeries=0,totalMissing=0,totalNeedCatalog=0;
 names.forEach(function(name){var a=map[name],cat=getSeries(name);if(!cat)return;(cat.books||[]).forEach(function(x){var st=seriesState(x,a);if(st==="missing")totalMissing++;if(st==="owned")totalNeedCatalog++});if(cat.books&&cat.books.length&&cat.books.every(function(x){return ownedSeriesEntry(x,a)}))completeSeries++});
 var hero='<div class="series-brain-hero series-discovery-hero"><div><div class="eyebrow">🔎 V4.27.6 • SERIES DISCOVERY 3.0</div><h1 class="title">Your Series</h1><p class="sub">Discover a series even before you own it, review the proposed reading order, then let the Bookshop track the lineup you confirm.</p><div class="actions"><button class="primary" id="discoverSeriesBtn">🔎 Discover a series</button></div></div><div class="series-brain-stats"><div><b>'+totalSeries+'</b><span>Series</span></div><div><b>'+completeSeries+'</b><span>Complete</span></div><div><b>'+totalMissing+'</b><span>Missing</span></div><div><b>'+totalNeedCatalog+'</b><span>Need cataloging</span></div></div></div>';
 if(!names.length)return hero+'<div class="empty series-discovery-empty"><b>No series saved yet.</b><div class="muted">Search by series name and optional author. Nothing becomes owned, Want to Read, or Want to Own unless you explicitly choose that elsewhere.</div></div>';
 return hero+'<div class="series-brain-grid">'+names.map(function(name){
  var a=map[name].slice().sort(function(x,y){return(+x.seriesNo||0)-(+y.seriesNo||0)}),cat=getSeries(name);
  if(!cat){var covers=a.filter(function(x){return x.cover}).slice(0,3);return '<section class="series-v2-card series-v2-unmapped"><div class="series-v2-top"><div><div class="eyebrow">✨ SERIES DISCOVERED</div><h2>'+esc(name)+'</h2><p>'+a.length+' cataloged book'+(a.length===1?'':'s')+' • lineup not confirmed yet</p></div><div class="series-mini-covers">'+covers.map(function(x){return '<img src="'+esc(x.cover)+'" alt="">'}).join('')+'</div></div><div class="series-v2-callout">🧠 Discover the full lineup to unlock missing-book tracking and collection progress.</div><div class="actions"><button class="primary" data-series-find="'+esc(name)+'">🔎 Discover lineup</button><button class="pill" data-series-edit="'+esc(name)+'">✏️ Enter manually</button></div></section>'}
  var books=(cat.books||[]).slice().sort(function(x,y){return seriesSortNumber(x)-seriesSortNumber(y)}),total=books.length,cataloged=books.filter(function(x){return catalogedSeriesEntry(x,a)}).length,ownedCount=books.filter(function(x){return ownedSeriesEntry(x,a)}).length,missing=total-ownedCount;
  var mainBooks=books.filter(function(x){return !isExtraType(x.type||"Main novel")}),extraBooks=books.filter(function(x){return isExtraType(x.type||"")}),mainOwned=mainBooks.filter(function(x){return ownedSeriesEntry(x,a)}).length,extraOwned=extraBooks.filter(function(x){return ownedSeriesEntry(x,a)}).length;
  var ownPct=Math.round(total?ownedCount/total*100:0),catPct=Math.round(total?cataloged/total*100:0),nextMissing=books.find(function(x){return seriesState(x,a)==="missing"}),needCatalog=books.filter(function(x){return seriesState(x,a)==="owned"}).length,complete=total&&ownedCount===total;
  var ownedCovers=a.filter(function(x){return x.cover}).slice(0,4);
  var next=complete?'<div class="series-next complete-next"><b>✨ Collection complete</b><span>You own every confirmed volume in this lineup.</span></div>':nextMissing?'<div class="series-next"><div><span class="eyebrow">NEXT MISSING BOOK</span><b>'+(nextMissing.number?'#'+esc(nextMissing.number)+' ':'')+esc(nextMissing.title)+'</b><small>'+esc(nextMissing.type||'Main novel')+'</small></div><button class="pill" data-series-toggle="'+esc(name)+'" data-series-title="'+esc(nextMissing.title)+'">📚 I own this</button></div>':'<div class="series-next"><b>📚 '+needCatalog+' owned '+(needCatalog===1?'book needs':'books need')+' cataloging</b></div>';
  var rows=books.map(function(x){var st=seriesState(x,a),icon=st==="cataloged"?'✅':st==="owned"?'📚':'○',label=st==="cataloged"?'Cataloged':st==="owned"?'Owned • needs cataloging':'Missing',action=st==="cataloged"?'':st==="owned"?'<button class="pill" data-series-scan="'+esc(name)+'" data-series-title="'+esc(x.title)+'" data-series-no="'+esc(x.number||'')+'">📷 Catalog</button><button class="tiny danger" data-series-toggle="'+esc(name)+'" data-series-title="'+esc(x.title)+'">Mark missing</button>':'<button class="pill" data-series-toggle="'+esc(name)+'" data-series-title="'+esc(x.title)+'">📚 I own this</button>';return '<div class="series-v2-book '+st+'vol"><div class="series-v2-book-main"><span class="series-state-icon">'+icon+'</span><div><b>'+(x.number?'#'+esc(x.number)+' ':'')+esc(x.title)+'</b><small>'+esc(x.type||'Main novel')+' • '+label+'</small></div></div><div class="seriesactions">'+action+'</div></div>'}).join('');
  var sourceNote=cat.source?'<span class="series-source-note">🔎 '+esc(cat.source)+'</span>':'';
  return '<section class="series-v2-card '+(complete?'series-complete':'')+'"><div class="series-v2-top"><div><div class="eyebrow">'+(complete?'✨ COMPLETE COLLECTION':'🔮 CONFIRMED LINEUP')+'</div><h2>'+esc(name)+'</h2><p>'+ownedCount+' of '+total+' owned • '+cataloged+' cataloged'+(missing?' • '+missing+' missing':'')+'</p>'+sourceNote+'</div><div class="series-mini-covers">'+ownedCovers.map(function(x){return '<img src="'+esc(x.cover)+'" alt="">'}).join('')+'</div></div><div class="series-progress-wrap"><div class="series-ring" style="--series-pct:'+ownPct+'"><strong>'+ownPct+'%</strong><span>owned</span></div><div class="series-progress-info"><div class="series-metric"><span>✨ Main story</span><b>'+mainOwned+'/'+mainBooks.length+'</b></div><div class="series-metric"><span>🌙 Extras</span><b>'+extraOwned+'/'+extraBooks.length+'</b></div><div class="series-metric"><span>🔎 Cataloged</span><b>'+cataloged+'/'+total+'</b></div><label>Collection progress</label><div class="progress"><i style="width:'+ownPct+'%"></i></div><label>Cataloging progress</label><div class="progress catalogprogress"><i style="width:'+catPct+'%"></i></div></div></div>'+next+'<details class="series-lineup"><summary>📚 View full lineup <span>'+total+' volumes</span></summary><div class="series-v2-list">'+rows+'</div></details><div class="series-v2-footer"><button class="pill" data-series-find="'+esc(name)+'" data-series-author="'+esc(cat.authorHint||'')+'">🔎 Refresh discovery</button><button class="pill" data-series-edit="'+esc(name)+'">✏️ Edit lineup</button></div></section>'
 }).join('')+'</div>'
}
function seriesNumberFromText(text,name){
 var t=String(text||""), n=String(name||"").replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),m;
 var pats=[new RegExp(n+"\\s*(?:series)?\\s*(?:book|#|no\\.?|volume|vol\\.?)?\\s*(\\d+(?:\\.\\d+)?)","i"),/(?:book|volume|vol\.?|#)\s*(\d+(?:\.\d+)?)/i];
 for(var i=0;i<pats.length;i++){m=t.match(pats[i]);if(m)return m[1]} return ""
}
function canonicalSeriesTitle(title,seriesName){
 var t=String(title||"").trim(),sn=String(seriesName||"").trim(),e=sn.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
 if(e){
  t=t.replace(new RegExp("\\s*\\(\\s*"+e+"\\s*(?:series)?\\s*(?:#|book|no\\.?|volume|vol\\.?)?\\s*\\d+(?:\\.\\d+)?\\s*\\)\\s*$","i"),"");
  t=t.replace(new RegExp("\\s*[-–—:]\\s*"+e+"\\s*(?:series)?\\s*(?:#|book|no\\.?|volume|vol\\.?)?\\s*\\d+(?:\\.\\d+)?\\s*$","i"),"");
 }
 return t.replace(/\s+/g," ").trim();
}
function guessSeriesType(title,no){var t=norm(title);if(/anthology|collection|collected|stories|omnibus/.test(t))return "Anthology / Collection";if(String(no).indexOf(".")>=0||/novella|prequel|companion|short story|bonus/.test(t))return "Novella / Extra";return "Main novel"}
function seriesCandidateScore(x,name){var raw=String(x.title||""),clean=canonicalSeriesTitle(raw,name),score=0;if(clean===raw.trim())score+=4;if(x.number)score+=3;if(x.source==="Your library")score+=5;if(!looksLikeEditionBundle(raw))score+=2;score-=Math.max(0,raw.length-clean.length)/20;return score}
function uniqueSeriesCandidates(items,name){
 var groups={};(items||[]).forEach(function(x){if(!x||!x.title)return;var clean=canonicalSeriesTitle(x.title,name),no=String(x.number||"").trim(),type=guessSeriesType(clean,no);x=Object.assign({},x,{title:clean,type:type});var k=norm(clean);if(!k)return;
  /* Same numbered main novel with a decorated API title is the same work. */
  var key=(no&&type==="Main novel")?"main#"+no:k;
  var old=groups[key];if(!old||seriesCandidateScore(x,name)>seriesCandidateScore(old,name))groups[key]=x;
 });
 return Object.keys(groups).map(function(k){return groups[k]}).sort(function(a,b){var an=parseFloat(a.number),bn=parseFloat(b.number);if(!isNaN(an)&&!isNaN(bn)){if(an!==bn)return an-bn;var rank={"Main novel":0,"Novella / Extra":1,"Anthology / Collection":2};return(rank[a.type]||9)-(rank[b.type]||9)||a.title.localeCompare(b.title)}if(!isNaN(an))return-1;if(!isNaN(bn))return 1;return a.title.localeCompare(b.title)})
}
async function googleBooksSearch(q){
 try{
  var u="https://www.googleapis.com/books/v1/volumes?q="+encodeURIComponent(q)+"&maxResults=40",r=await cachedFetchJSON(u);
  return r&&r.ok?((r.data&&r.data.items)||[]):[]
 }catch(e){return[]}
}
function ordinalWordNumber(text){
 var t=norm(text||"");
 if(/\b(prequel|prequel novella|before the events)\b/.test(t))return "0.5";
 if(/\b(first|book one|book 1|volume one|volume 1)\b/.test(t))return "1";
 if(/\b(second|book two|book 2|volume two|volume 2)\b/.test(t))return "2";
 if(/\b(third|book three|book 3|volume three|volume 3)\b/.test(t))return "3";
 if(/\b(fourth|book four|book 4|volume four|volume 4)\b/.test(t))return "4";
 if(/\b(fifth|book five|book 5|volume five|volume 5)\b/.test(t))return "5";
 if(/\b(sixth|book six|book 6|volume six|volume 6)\b/.test(t))return "6";
 return ""
}
function inferSeriesNumberFallback(v,name){
 var title=String(v.title||""),desc=String(v.description||""),blob=[title,v.subtitle||"",desc].join(" ");
 if(norm(title)===norm(name))return "1";
 var direct=seriesNumberFromText(blob,name);if(direct)return direct;
 var ord=ordinalWordNumber(blob);if(ord)return ord;
 if(norm(desc).indexOf(norm(name))>=0&&/\bsequel\b/i.test(desc))return "2";
 return ""
}
function candidateFromGoogle(it,name,seedAuthors){
 var v=it.volumeInfo||{},authors=v.authors||[],blob=[v.title,v.subtitle,(v.categories||[]).join(" "),v.description||"",authors.join(" ")].join(" "),ser=inferSeries(v.title||"",v.description||""),
     nameHit=norm(blob).indexOf(norm(name))>=0||norm(ser.series)===norm(name),
     authorHit=!seedAuthors.length||authors.some(function(a){return seedAuthors.indexOf(norm(a))>=0});
 if(!nameHit||!authorHit)return null;
 var no=norm(ser.series)===norm(name)?ser.seriesNo:inferSeriesNumberFallback(v,name);
 return{number:no,title:v.title||"",type:guessSeriesType(v.title||"",no),source:"Google Books",authors:authors}
}
async function googleSeriesCandidates(name,seedAuthors){
 var queries=['"'+name+'"'];
 seedAuthors.forEach(function(a){
  queries.push('"'+name+'" inauthor:"'+a+'"');
  queries.push('inauthor:"'+a+'" "'+name+'"');
  /* Important fallback: scan the author's catalog, then keep only books whose
     title/description actually references the requested series. This catches
     sequels whose TITLE does not repeat the series name. */
  queries.push('inauthor:"'+a+'"')
 });
 var all=[];
 for(var i=0;i<queries.length;i++){
  var items=await googleBooksSearch(queries[i]);
  items.forEach(function(it){var c=candidateFromGoogle(it,name,seedAuthors.map(norm));if(c)all.push(c)})
 }
 return all
}
async function openLibrarySearch(q){
 try{
  var u="https://openlibrary.org/search.json?q="+encodeURIComponent(q)+"&limit=100&fields=key,title,subtitle,series,author_name,first_publish_year",r=await cachedFetchJSON(u);
  return r&&r.ok?((r.data&&r.data.docs)||[]):[]
 }catch(e){return[]}
}
async function openLibrarySearchParams(params){
 try{
  var bits=[];
  Object.keys(params||{}).forEach(function(k){if(params[k]!==undefined&&params[k]!==null&&String(params[k]).trim()!=="")bits.push(encodeURIComponent(k)+"="+encodeURIComponent(params[k]))});
  bits.push("limit=100");
  bits.push("fields="+encodeURIComponent("key,title,subtitle,series,author_name,first_publish_year"));
  var r=await cachedFetchJSON("https://openlibrary.org/search.json?"+bits.join("&"));
  return r&&r.ok?((r.data&&r.data.docs)||[]):[]
 }catch(e){return[]}
}
function seriesLabelMatches(raw,name){
 var a=norm(raw||""),b=norm(name||"");
 if(!a||!b)return false;
 if(a===b)return true;
 var stripped=a
  .replace(/\([^)]*\)/g," ")
  .replace(/\b(?:book|volume|vol|part|series|novella)\b/g," ")
  .replace(/[#,:;-]/g," ")
  .replace(/\b\d+(?:\.\d+)?\b/g," ")
  .replace(/\s+/g," ").trim();
 return stripped===b
}
function openLibraryCandidateFromDoc(d,name,seedAuthors){
 var authors=d.author_name||[],seedNorm=(seedAuthors||[]).map(norm),
     authorHit=!seedNorm.length||authors.some(function(a){return seedNorm.indexOf(norm(a))>=0});
 if(!authorHit)return null;
 var ss=Array.isArray(d.series)?d.series:[d.series],matched=(ss||[]).filter(function(x){return x&&seriesLabelMatches(x,name)});
 if(!matched.length)return null;
 var raw=String(matched[0]||""),no=seriesNumberFromText(raw,name)||seriesNumberFromText((d.title||"")+" "+(d.subtitle||""),name);
 if(!no&&norm(d.title||"")===norm(name))no="1";
 return{number:no,title:d.title||"",type:guessSeriesType(d.title||"",no),source:"Open Library",authors:authors}
}
async function openLibrarySeriesCandidates(name,seedAuthors,diag){
 diag=diag||{};
 var out=[],seenDoc={};
 function authorMatches(d){
  if(!seedAuthors||!seedAuthors.length)return true;
  var aa=(d.author_name||d.author||[]);if(!Array.isArray(aa))aa=[aa];
  return aa.some(function(a){return seedAuthors.some(function(seed){return norm(a)===norm(seed)||norm(a).indexOf(norm(seed))>=0||norm(seed).indexOf(norm(a))>=0})})
 }
 function consumeStrict(docs){
  (docs||[]).forEach(function(d){
   var dk=(d.key||"")+"|"+norm(d.title||"");
   if(seenDoc[dk])return;
   var c=openLibraryCandidateFromDoc(d,name,seedAuthors);
   if(c){seenDoc[dk]=1;out.push(c)}
  })
 }
 function consumeExactSeriesQuery(docs){
  (docs||[]).forEach(function(d){
   var dk=(d.key||"")+"|"+norm(d.title||"");
   if(seenDoc[dk]||!d.title||!authorMatches(d))return;
   var ss=Array.isArray(d.series)?d.series:(d.series?[d.series]:[]);
   var matched=ss.some(function(label){return seriesLabelMatches(label,name)});
   /* The exact quoted series query itself is membership evidence when OL
      returns a small focused set, even if its docs omit the series field. */
   var focused=(docs||[]).length>0&&(docs||[]).length<=12;
   if(!matched&&!focused)return;
   var raw=matched?String(ss.filter(function(label){return seriesLabelMatches(label,name)})[0]||""):"";
   var no=seriesNumberFromText(raw,name)||seriesNumberFromText((d.title||"")+" "+(d.subtitle||""),name);
   if(!no&&norm(d.title||"")===norm(name))no="1";
   seenDoc[dk]=1;
   out.push({number:no,title:d.title||"",type:guessSeriesType(d.title||"",no),source:"Open Library",authors:(d.author_name||[])})
  })
 }

 /* Noisy structured path: candidates must prove membership with their own series label. */
 var structured=await openLibrarySearchParams({series:name,author:(seedAuthors&&seedAuthors[0])||""});
 diag.olStructured=(structured||[]).length;consumeStrict(structured);

 var structuredLoose=await openLibrarySearchParams({series:name});
 diag.olStructuredLoose=(structuredLoose||[]).length;consumeStrict(structuredLoose);

 /* Exact quoted query: a small focused result set is accepted as direct series evidence. */
 var seriesQ=await openLibrarySearch('series:"'+name+'"');
 diag.olSeriesQuery=(seriesQ||[]).length;consumeExactSeriesQuery(seriesQ);

 /* Author catalog remains diagnostics-only. */
 if(seedAuthors&&seedAuthors.length){
  var authorDocs=await openLibrarySearchParams({author:seedAuthors[0]});
  diag.olAuthorCatalog=(authorDocs||[]).length;
 }
 return out
}
function looksLikeEditionBundle(title){return /box set|boxed set|collection|omnibus|books?\s*\d+\s*[-–]\s*\d+|complete series|bundle/i.test(title||"")}
function inferAcceptedSeriesEntry(x,name){
 var y=Object.assign({},x),t=norm(y.title||""),n=String(y.number||"").trim();
 if(!n){
  if(t===norm(name))n="1";
  else if(/\bkill joy\b/.test(t))n="0.5";
  else if(/\bgood girl bad blood\b/.test(t))n="2";
  else if(/\bas good as dead\b/.test(t))n="3";
 }
 y.number=n;
 if(/\bkill joy\b/.test(t)||String(n).indexOf(".")>=0)y.type="Novella / Extra";
 else y.type=guessSeriesType(y.title||"",n);
 return y
}
function cleanSeriesResults(items,name){
 return uniqueSeriesCandidates(items,name)
  .filter(function(x){return !looksLikeEditionBundle(x.title)})
  .map(function(x){return inferAcceptedSeriesEntry(x,name)})
  .filter(function(x){return x.title})
}
function seriesDiscoveryConfidence(results){
 var a=results||[],numbered=a.filter(function(x){return String(x.number||"").trim()}).length,sources={};
 a.forEach(function(x){if(x.source)sources[x.source]=true});
 var sourceCount=Object.keys(sources).length,score=0;
 if(a.length>=3)score+=2;else if(a.length>=2)score+=1;
 if(numbered>=Math.min(3,a.length))score+=2;else if(numbered>=2)score+=1;
 if(sourceCount>=2)score+=2;else if(sourceCount===1)score+=1;
 return{label:score>=5?"High":score>=3?"Review carefully":"Low",className:score>=5?"good":score>=3?"warn":"low",numbered:numbered,sources:Object.keys(sources),count:a.length}
}
function openSeriesDiscovery(){
 el("#modalBody").innerHTML='<div class="eyebrow">🔎 V4.27.6 • SERIES DISCOVERY 3.0</div><h1 class="title">Discover a series</h1><p class="sub">Search by the series name. Add the author when you know it to reduce unrelated results.</p><div class="form"><div class="field full"><label>Series name</label><input id="seriesDiscoveryName" placeholder="e.g. A Good Girl’s Guide to Murder"></div><div class="field full"><label>Author (optional, but helpful)</label><input id="seriesDiscoveryAuthor" placeholder="e.g. Holly Jackson"></div></div><div class="guardian purple"><b>🔮 Discovery never changes ownership or reading intent.</b><div class="muted">The internet can suggest a lineup, but you review it before anything is saved.</div></div><div class="actions"><button class="primary" id="runSeriesDiscovery">🔎 Find lineup</button></div>';
 el("#modal").classList.remove("hidden");
 el("#runSeriesDiscovery").onclick=function(){var name=(el("#seriesDiscoveryName").value||"").trim(),author=(el("#seriesDiscoveryAuthor").value||"").trim();if(!name){alert("Enter the series name first.");return}findSeriesLineup(name,author)};
 el("#seriesDiscoveryName").onkeydown=function(e){if(e.key==="Enter")el("#runSeriesDiscovery").click()};
 el("#seriesDiscoveryAuthor").onkeydown=function(e){if(e.key==="Enter")el("#runSeriesDiscovery").click()}
}
async function findSeriesLineup(name,authorHint){
 name=String(name||"").trim();authorHint=String(authorHint||"").trim();
 if(!name)return;
 el("#modalBody").innerHTML='<div class="eyebrow">🔎 V4.27.6 • SERIES DISCOVERY 3.0</div><h1 class="title">Finding '+esc(name)+'</h1><div class="empty">🔮 Searching by series name'+(authorHint?' and '+esc(authorHint):', known author')+', then comparing public series metadata…</div>';el("#modal").classList.remove("hidden");
 var local=owned().filter(function(b){return norm(b.series)===norm(name)}),seedAuthors=[];
 if(authorHint)seedAuthors.push(authorHint);
 local.forEach(function(b){if(b.author&&!seedAuthors.some(function(a){return norm(a)===norm(b.author)}))seedAuthors.push(b.author)});
 var existing=getSeries(name);if(existing&&existing.authorHint&&!seedAuthors.some(function(a){return norm(a)===norm(existing.authorHint)}))seedAuthors.push(existing.authorHint);
 var discoveryDiag={google:0,olStructured:0,olStructuredLoose:0,olSeriesQuery:0,olAuthorCatalog:0};
 var google=await googleSeriesCandidates(name,seedAuthors);discoveryDiag.google=google.length;
 var ol=await openLibrarySeriesCandidates(name,seedAuthors,discoveryDiag);
 var known=local.map(function(b){return{number:b.seriesNo||"",title:b.title,type:"Main novel",source:"Your library",authors:[b.author||""]}}),results=cleanSeriesResults(google.concat(ol,known),name);
 if(!results.length){el("#modalBody").innerHTML='<div class="eyebrow">🔎 SERIES DISCOVERY 3.0</div><h1 class="title">No confident lineup found</h1><p class="sub">Public metadata did not give Enchanted Bookshop a usable lineup for <b>'+esc(name)+'</b>. Nothing was saved or changed.</p><div class="actions"><button class="primary" id="retrySeriesDiscovery">🔎 Try another search</button><button class="pill" id="fallbackSeriesManual">✏️ Enter lineup manually</button></div>';el("#retrySeriesDiscovery").onclick=openSeriesDiscovery;el("#fallbackSeriesManual").onclick=function(){openSeriesEditor(name)};return}
 var conf=seriesDiscoveryConfidence(results),incomplete=results.length<2,lines=results.map(function(x){return[x.number,x.title,x.type].join(" | ")}).join("\n"),warning=incomplete?'<div class="guardian"><b>⚠️ Lineup may be incomplete</b><div class="muted">Only '+results.length+' possible title was found. Review carefully.</div></div>':'';
 var src=conf.sources.length?conf.sources.join(" + "):"public metadata";
 var diagBox=(incomplete||conf.label==="Low")?'<details class="series-discovery-diag"><summary>🔧 Discovery diagnostics</summary><div class="tiny">Google candidates: '+discoveryDiag.google+'<br>Open Library series match: '+discoveryDiag.olStructured+'<br>Open Library loose series match: '+discoveryDiag.olStructuredLoose+'<br>Open Library series query: '+discoveryDiag.olSeriesQuery+'<br>Open Library author catalog: '+discoveryDiag.olAuthorCatalog+'</div></details>':'';
 el("#modalBody").innerHTML='<div class="eyebrow">🔎 V4.27.6 • SERIES DISCOVERY 3.0</div><h1 class="title">'+esc(name)+'</h1><p class="sub"><b>Review before saving.</b> Public metadata can mix main novels, novellas, anthologies, translations, and bundles.</p><div class="series-discovery-confidence '+esc(conf.className)+'"><div><span>Discovery confidence</span><b>'+esc(conf.label)+'</b></div><div><span>Possible volumes</span><b>'+conf.count+'</b></div><div><span>Numbered</span><b>'+conf.numbered+'</b></div><div><span>Sources</span><b>'+esc(src)+'</b></div></div><div class="guardian purple"><b>✨ Internet proposes. You confirm. The Bookshop remembers.</b><div class="muted">Edit, remove, renumber, or reclassify anything below. Nothing changes until Confirm lineup.</div></div>'+warning+diagBox+'<div class="field full"><label>number | title | type</label><textarea id="seriesSuggestionLines" style="min-height:330px">'+esc(lines)+'</textarea></div><div class="actions"><button class="primary" id="confirmSeriesSuggestion">✨ Confirm lineup</button><button class="pill" id="retrySeriesSuggestion">🔎 Search again</button><button class="pill" id="cancelSeriesSuggestion">Cancel</button></div>';
 el("#cancelSeriesSuggestion").onclick=closeModal;
 el("#retrySeriesSuggestion").onclick=function(){openSeriesDiscovery();var n=el("#seriesDiscoveryName");if(n)n.value=name;var a=el("#seriesDiscoveryAuthor");if(a)a.value=authorHint||seedAuthors[0]||""};
 el("#confirmSeriesSuggestion").onclick=function(){
  var previous=getSeries(name),ownedMap={};if(previous)(previous.books||[]).forEach(function(x){ownedMap[norm(x.title)]=!!x.ownedUncataloged});
  var parsed=el("#seriesSuggestionLines").value.split(/\n/).map(function(line){var q=line.split("|").map(function(x){return x.trim()});return{number:q[0]||"",title:q[1]||q[0]||"",type:q[2]||"Main novel",ownedUncataloged:ownedMap[norm(q[1]||q[0]||"")]||false}}).filter(function(x){return x.title});
  if(!parsed.length){alert("Keep at least one book in the lineup.");return}
  if(incomplete&&!confirm("Only one possible title was found. Save this as the series lineup anyway?"))return;
  var hint=authorHint||seedAuthors[0]||"",obj={id:seriesId(name),name:name,authorHint:hint,books:parsed,confirmed:true,source:"Series Discovery 3.0 • user confirmed",discoveryConfidence:conf.label,updatedAt:now(),deleted:false},ix=seriesCatalog.findIndex(function(s){return s.id===obj.id});
  if(ix>=0)seriesCatalog[ix]=obj;else seriesCatalog.push(obj);
  saveSeries();closeModal();render();autoSyncSeriesMaybe()
 }
}
function openSeriesEditor(name){
 var existing=getSeries(name),books=existing?existing.books:owned().filter(function(b){return norm(b.series)===norm(name)}).map(function(b){return{number:b.seriesNo||"",title:b.title,type:"Main novel",ownedUncataloged:false}}).sort(function(a,b){return(+a.number||0)-(+b.number||0)});
 el("#modalBody").innerHTML='<div class="eyebrow">Series Brain™</div><h1 class="title">'+esc(name)+'</h1><p class="sub">One book per line: <b>number | title | type</b>. Ownership is managed from the Series page after saving.</p><div class="field full"><label>Series lineup</label><textarea id="seriesLines" style="min-height:300px">'+esc(books.map(function(x){return[x.number,x.title,x.type||"Main novel"].join(" | ")}).join("\\n"))+'</textarea></div><div class="actions"><button class="primary" id="saveSeriesLineup">Save lineup</button></div>';
 el("#modal").classList.remove("hidden");
 el("#saveSeriesLineup").onclick=function(){
  var previous={};books.forEach(function(x){previous[norm(x.title)]=!!x.ownedUncataloged});
  var lines=el("#seriesLines").value.split(/\n/).map(function(x){return x.trim()}).filter(Boolean),parsed=lines.map(function(line){var q=line.split("|").map(function(x){return x.trim()});var title=q[1]||q[0]||"";return{number:q[0]||"",title:title,type:q[2]||"Main novel",ownedUncataloged:previous[norm(title)]||false}}).filter(function(x){return x.title});
  var obj={id:seriesId(name),name:name,authorHint:(existing&&existing.authorHint)||"",books:parsed,confirmed:existing?!!existing.confirmed:true,source:(existing&&existing.source)||"Manual lineup",discoveryConfidence:(existing&&existing.discoveryConfidence)||"",updatedAt:now(),deleted:false},ix=seriesCatalog.findIndex(function(s){return s.id===obj.id});if(ix>=0)seriesCatalog[ix]=obj;else seriesCatalog.push(obj);
  saveSeries();closeModal();render();autoSyncSeriesMaybe()
 }
}
function toggleSeriesOwned(name,title){
 var cat=getSeries(name);if(!cat)return;var entry=cat.books.find(function(x){return norm(x.title)===norm(title)});if(!entry)return;
 entry.ownedUncataloged=!entry.ownedUncataloged;cat.updatedAt=now();saveSeries();render();autoSyncSeriesMaybe()
}
function catalogSeriesCopy(name,title,no){
 state.view="library";render();openBook({id:"",workId:"",title:title,author:"",genres:[],series:name,seriesNo:no,status:"no-reading-status",owned:true,wantOwn:false,rating:0,favorite:false,spice:0,edition:{isbn:"",name:"",format:"Paperback",publisher:"",publicationDate:"",pages:"",printing:"",special:[]},notes:""});
}
function openMissing(name,title,no){catalogSeriesCopy(name,title,no)}
function shelf(title,a){return'<div class="eyebrow">Your shelves</div><h1 class="title">'+title+'</h1><div class="grid">'+(a.map(card).join("")||'<div class="empty">Nothing here yet. ✨</div>')+'</div>'}
var BACKUP_META_KEY="enchanted-bookshop-backup-meta-v4-22";
function backupMeta(){var x={};try{x=JSON.parse(localStorage.getItem(BACKUP_META_KEY))||{}}catch(e){}return x}
function setBackupMeta(x){localStorage.setItem(BACKUP_META_KEY,JSON.stringify(x||{}))}
function backupCounts(){var journals=0;visible().forEach(function(b){journals+=[].concat(b.readingJournal||[]).length});return{books:visible().length,owned:owned().length,series:seriesCatalog.filter(function(x){return !x.deleted}).length,journals:journals,work:Object.keys(workIntelligence||{}).length,shelves:smartShelfList().length}}
function backup(){
 var m=backupMeta(),c=backupCounts(),sy=getSync(),signed=!!(sy.token&&sy.userId),last=m.lastExport?new Date(m.lastExport).toLocaleString():"No backup exported on this device yet";
 return '<section class="backup-hero"><div><div class="eyebrow">💾 V4.22.1 • BACKUP CENTER 2.0</div><h1 class="title">Protect your bookshop.</h1><p class="sub">See what is protected, make a complete portable backup, and restore only after reviewing what the file contains.</p></div><div class="backup-shield">🛡️</div></section>'+ 
 '<section class="backup-health"><div class="backup-health-card"><span>📚</span><b>'+c.books+'</b><small>book records</small></div><div class="backup-health-card"><span>🧩</span><b>'+c.series+'</b><small>series catalogs</small></div><div class="backup-health-card"><span>🕯️</span><b>'+c.journals+'</b><small>journal entries</small></div><div class="backup-health-card"><span>🔍</span><b>'+c.shelves+'</b><small>smart shelves</small></div></section>'+ 
 '<div class="backup-status '+(m.lastExport?'ok':'warn')+'"><div><b>'+(m.lastExport?'✅ Portable backup created':'⚠️ Portable backup recommended')+'</b><div class="muted">Last export on this device: '+esc(last)+'</div></div><button class="primary" id="exportBtn">💾 Export complete backup</button></div>'+ 
 '<div class="split backup-grid"><div class="box"><div class="eyebrow">WHAT THE JSON BACKUP PROTECTS</div><h3>📦 Complete portable backup</h3><div class="backup-checks"><div>✓ Books + edition/copy data</div><div>✓ Reading Journal + progress</div><div>✓ Series Catalogs</div><div>✓ Work Intelligence</div><div>✓ Reading Challenge settings</div><div>✓ Smart Shelves</div><div>✓ Home dashboard arrangement</div><div>✓ Library view preference</div></div><p class="tiny muted">Keep the downloaded JSON somewhere you control. It does not contain your Supabase password or sign-in token.</p></div>'+ 
 '<div class="box"><div class="eyebrow">CLOUD STATUS</div><h3>☁️ '+(signed?'Connected':'Not signed in')+'</h3><p class="sub">'+(signed?'Your existing Supabase sync protects books, Series Catalogs, and Work Intelligence across devices.':'Your Bookshop still works locally. Sign in on the Sync page if you want optional phone ↔ Windows cloud protection.')+'</p><div class="syncstatus '+(signed?'ok':'')+'">'+(signed?(sy.auto?'☁️ Signed in • Auto-sync ON':'☁️ Signed in • Auto-sync OFF'):'Local-first • cloud optional')+'</div><p class="tiny muted"><b>Important:</b> Reading Challenge settings, Smart Shelves, and device layout preferences are protected by JSON export, not by the current cloud sync.</p><button class="pill" data-view-jump="sync">Open Sync</button></div></div>'+ 
 '<div class="box restore-safe"><div class="eyebrow">SAFE RESTORE</div><h3>📥 Restore from JSON</h3><p class="sub">Choose a backup file. The Bookshop will inspect it first and show you what it contains before anything is replaced.</p><label class="file-pick">Choose backup file <input type="file" id="restoreFile" accept=".json,application/json"></label><div id="restorePreview" class="restore-preview"><span class="muted">No file selected.</span></div></div>'+ 
 '<div class="insight-note">🛡️ Backup Center never clears browser storage for you. Export a fresh JSON before risky browser/device maintenance.</div>'
}
function getSync(){var s={url:"",anon:"",email:"",token:"",refresh:"",auto:false,userId:""};try{Object.assign(s,JSON.parse(localStorage.getItem(SYNC_KEY))||{})}catch(e){}return s}
function putSync(s){localStorage.setItem(SYNC_KEY,JSON.stringify(s))}
function syncPage(){
 var s=getSync(), signed=!!s.token;
 return '<div class="eyebrow">Optional cross-device cloud</div><h1 class="title">Sync</h1><p class="sub">Your bookshop always works locally first. For phone ↔ Windows sync, V3 can connect to your own Supabase project. That keeps the cloud account under your control.</p>'+
 '<div class="box"><h3>1. Connect your project</h3><div class="form"><div class="field full"><label>Supabase project URL</label><input id="syncUrl" placeholder="https://xxxxx.supabase.co" value="'+esc(s.url)+'"></div><div class="field full"><label>Anon / publishable key</label><input id="syncAnon" type="password" placeholder="eyJ..." value="'+esc(s.anon)+'"></div></div><div class="actions"><button class="primary" id="saveSyncConfig">Save connection</button></div></div>'+
 '<div class="box"><h3>2. Your sync account</h3><div class="form"><div class="field"><label>Email</label><input id="syncEmail" type="email" value="'+esc(s.email)+'"></div><div class="field"><label>Password</label><input id="syncPassword" type="password" placeholder="••••••••"></div></div><div class="actions">'+(signed?'<button class="danger" id="signOut">Sign out</button>':'<button class="pill" id="signUp">Create account</button><button class="primary" id="signIn">Sign in</button>')+'</div><div id="syncAuthStatus" class="syncstatus '+(signed?"ok":"")+'">'+(signed?'☁️ Signed in — sync is available.':'Not signed in yet.')+'</div></div>'+
 '<div class="box"><h3>3. Sync your library</h3><p class="tiny">V4.25 merges books, Series Catalogs, Work Intelligence, and Reading Challenges separately by ID and keeps the newest version of the same record. Different series are combined instead of replacing each other. <b>Pull + merge</b> never uploads; <b>Sync now</b> performs a two-way merge, then uploads the combined result. Your local copy remains available offline.</p><label><input type="checkbox" id="autoSync" '+(s.auto?"checked":"")+'> Auto-sync after local changes when online</label><div class="actions"><button class="pill" id="pullSync">☁️ Pull + merge</button><button class="primary" id="pushSync">☁️ Sync now</button></div><div id="syncRunStatus" class="syncstatus">Ready.</div></div>'+
 '<div class="box"><h3>Server setup</h3><p class="tiny">The included <b>SUPABASE_SETUP.sql</b> file creates the table and row-level security rules required for this app. Run it once in your Supabase SQL editor before syncing.</p></div>'
}
function wishPriority(b){return String(b.wishPriority||"Normal")}
function wishKind(b){return String(b.wishKind||((b.edition&&((b.edition.isbn||"").trim()||(b.edition.name||"").trim()))?"edition":"work"))}
function wishFeatures(b){return uniqText(b.wishFeatures||[])}
function wishlist2(){
 var wants=visible().filter(function(b){return b.wantOwn}), work=wants.filter(function(b){return wishKind(b)==="work"}), ed=wants.filter(function(b){return wishKind(b)==="edition"}), grails=wants.filter(function(b){return wishPriority(b)==="GRAIL"});
 var gaps=[];seriesCatalog.filter(function(x){return !x.deleted&&x.confirmed}).forEach(function(cat){var ownedArr=owned().filter(function(b){return norm(b.series)===norm(cat.name)});(cat.books||[]).forEach(function(x){if(seriesState(x,ownedArr)==="missing")gaps.push({series:cat.name,title:x.title,number:x.number||"",type:x.type||"Main novel"})})});
 function wc(b){var feats=wishFeatures(b),kind=wishKind(b),ownSame=owned().some(function(x){return norm(x.title)===norm(b.title)&&norm(x.author||"")===norm(b.author||"")});return '<article class="wish-card '+(wishPriority(b)==="GRAIL"?'grail':'')+'" data-wish-open="'+esc(b.id)+'"><div class="wish-cover">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="">':'📖')+'</div><div class="wish-body"><div class="eyebrow">'+(kind==='edition'?'💎 SPECIFIC EDITION':'📖 WORK WISH')+'</div><h3>'+esc(b.title)+'</h3><p>'+esc(b.author||'')+'</p>'+(ownSame?'<div class="wish-owned">📚 You already own this story — hunting another edition.</div>':'')+'<div class="wish-tags"><span>🔥 '+esc(wishPriority(b))+'</span>'+(b.wishTargetPrice?'<span>💰 $'+esc(b.wishTargetPrice)+'</span>':'')+(b.wishRetailer?'<span>🏪 '+esc(b.wishRetailer)+'</span>':'')+'</div>'+(feats.length?'<small>✨ '+esc(feats.join(' • '))+'</small>':'')+'<div class="wish-card-actions"><button class="primary" data-wish-view="'+esc(b.id)+'">📕 View Book</button><button class="pill" data-wish-edit="'+esc(b.id)+'">✏️ Edit</button></div></div></article>'}
 var tabs='<div class="wish-tabs"><button class="pill active" data-wish-filter="all">All '+wants.length+'</button><button class="pill" data-wish-filter="work">Works '+work.length+'</button><button class="pill" data-wish-filter="edition">Specific Editions '+ed.length+'</button><button class="pill" data-wish-filter="gaps">Series Gaps '+gaps.length+'</button><button class="pill" data-wish-filter="grail">💎 Grails '+grails.length+'</button></div>';
 var cards=wants.map(wc).join('')||'<div class="empty">Your treasure map is empty. Add a story or a specific dream edition. ✨</div>';
 var gapCards=gaps.map(function(g){return '<article class="wish-gap"><div><div class="eyebrow">🔮 SERIES GAP</div><h3>'+esc(g.title)+'</h3><p>'+esc(g.series)+(g.number?' • #'+esc(g.number):'')+' • '+esc(g.type)+'</p></div><button class="primary" data-wish-gap="'+esc(g.series)+'" data-wish-title="'+esc(g.title)+'" data-wish-no="'+esc(g.number)+'">✨ Want this</button></article>'}).join('')||'<div class="empty">No confirmed missing series books right now. 🔮</div>';
 return '<div class="wish-hero"><div><div class="eyebrow">✨ V4.14 • WANT TO OWN 2.0</div><h1 class="title">Treasure Wishlist</h1><p class="sub">Want the story, hunt a specific edition, mark a grail, and keep series gaps separate from what you actually own.</p></div><button class="primary" id="newWish">＋ Add a wish</button></div><div class="wish-stats"><div><b>'+wants.length+'</b><span>Wishes</span></div><div><b>'+ed.length+'</b><span>Edition hunts</span></div><div><b>'+grails.length+'</b><span>Grails</span></div><div><b>'+gaps.length+'</b><span>Series gaps</span></div></div>'+tabs+'<div id="wishMain"><div class="wish-grid">'+cards+'</div></div><div id="wishGaps" class="hidden"><div class="wish-gap-grid">'+gapCards+'</div></div>'
}
function openWish(b){
 b=b||{id:"",workId:"",title:"",author:"",cover:"",genres:[],series:"",seriesNo:"",status:"no-reading-status",owned:false,wantOwn:true,rating:0,favorite:false,spice:0,edition:{isbn:"",name:"",format:"Paperback",publisher:"",publicationDate:"",pages:"",printing:"",special:[]},wishKind:"work",wishPriority:"Normal",wishTargetPrice:"",wishRetailer:"",wishFeatures:[],wishNotes:""};var e=b.edition||{};
 el("#modalBody").innerHTML='<div class="eyebrow">✨ WANT TO OWN 2.0</div><h1 class="title">'+(b.id?'Edit your wish':'Add to your treasure map')+'</h1><form id="wishForm"><div class="form">'+field('Title','title',b.title,true)+field('Author','author',b.author)+selectField('What are you hunting?','wishKind',['work','edition'],wishKind(b))+selectField('Priority','wishPriority',['Low','Normal','High','GRAIL'],wishPriority(b))+field('Series','series',b.series)+field('Series number','seriesNo',b.seriesNo)+field('Target price','wishTargetPrice',b.wishTargetPrice||'')+field('Preferred retailer / source','wishRetailer',b.wishRetailer||'')+field('ISBN — if specific edition','isbn',e.isbn||'')+field('Edition name','editionName',e.name||'')+selectField('Format','format',['Paperback','Hardcover','Box Set','Ebook','Audiobook','Other'],e.format||'Paperback')+field('Dream collector features','wishFeatures',wishFeatures(b).join(', '),'',true)+'<div class="field full"><label>Why I want it / notes</label><textarea name="wishNotes">'+esc(b.wishNotes||'')+'</textarea></div></div><div class="actions">'+(b.id?'<button type="button" class="danger" id="removeWish">Remove wish</button>':'')+'<button class="primary" type="submit">✨ Save wish</button></div></form>';
 el('#modal').classList.remove('hidden');el('#wishForm').onsubmit=function(ev){ev.preventDefault();var f=new FormData(ev.target),n=Object.assign({},b,{id:b.id||uid(),workId:b.workId||uid(),title:f.get('title'),author:f.get('author'),series:f.get('series'),seriesNo:f.get('seriesNo'),owned:false,wantOwn:true,wishKind:f.get('wishKind'),wishPriority:f.get('wishPriority'),wishTargetPrice:f.get('wishTargetPrice'),wishRetailer:f.get('wishRetailer'),wishFeatures:String(f.get('wishFeatures')||'').split(',').map(function(x){return x.trim()}).filter(Boolean),wishNotes:f.get('wishNotes'),edition:Object.assign({},e,{isbn:f.get('isbn'),name:f.get('editionName'),format:f.get('format')}),updatedAt:now(),deleted:false});var ix=state.books.findIndex(function(x){return x.id===n.id});if(ix>=0)state.books[ix]=n;else state.books.push(n);save();closeModal();render();autoSyncMaybe()};if(b.id)el('#removeWish').onclick=function(){if(confirm('Remove this from Want to Own?')){var x=state.books.find(function(x){return x.id===b.id});x.wantOwn=false;x.updatedAt=now();save();closeModal();render();autoSyncMaybe()}}
}
function journalBooks(){return owned().filter(function(b){return b.status==="currently-reading"||b.status==="rereading"||(b.readingJournal&&b.readingJournal.length)})}
function journalSessions(b){return [].concat(b.readingJournal||[]).slice().sort(function(a,c){var d=String(c.date||"").localeCompare(String(a.date||""));if(d)return d;return String(c.updatedAt||c.createdAt||"").localeCompare(String(a.updatedAt||a.createdAt||""))})}
function recalcReadingProgress(b){var latest=journalSessions(b)[0];if(latest)b.readingProgress={page:latest.page||"",percent:latest.percent||"",updatedAt:now()};else b.readingProgress={page:"",percent:"",updatedAt:now()}}
function readingInsights(){
 var o=owned(),sessions=[];
 o.forEach(function(b){(b.readingJournal||[]).forEach(function(e){sessions.push({book:b,entry:e})})});
 sessions.sort(function(a,b){return String(a.entry.date||a.entry.createdAt||"").localeCompare(String(b.entry.date||b.entry.createdAt||""))});
 var minutes=sessions.reduce(function(n,x){return n+(+x.entry.minutes||0)},0),readingDays={},moods={},genres={},ratings={},pages=0,byBook={};
 sessions.forEach(function(x){var e=x.entry,b=x.book;if(e.date)readingDays[e.date]=1;if(e.mood)moods[e.mood]=(moods[e.mood]||0)+1;(b.genres||[]).forEach(function(g){genres[g]=(genres[g]||0)+1});if(b.rating)ratings[b.rating]=(ratings[b.rating]||0)+1;var pg=+e.page||0;if(pg){var k=b.id||b.title,prev=byBook[k]||0;if(pg>=prev)pages+=pg-prev;byBook[k]=Math.max(prev,pg)}});
 var finished=o.filter(function(b){return b.status==='read'}),rated=finished.filter(function(b){return +b.rating>0}),avg= rated.length ? (rated.reduce(function(n,b){return n+(+b.rating||0)},0)/rated.length).toFixed(1) : '—';
 function top(obj){var a=Object.keys(obj).map(function(k){return[k,obj[k]]}).sort(function(a,b){return b[1]-a[1]});return a[0]||null}
 function bars(obj,empty){var a=Object.keys(obj).map(function(k){return[k,obj[k]]}).sort(function(a,b){return b[1]-a[1]}).slice(0,8),max=a.length?a[0][1]:1;return a.length?a.map(function(x){return '<div class="insight-bar-row"><span>'+esc(x[0])+'</span><div class="insight-bar"><i style="width:'+Math.round(x[1]/max*100)+'%"></i></div><b>'+x[1]+'</b></div>'}).join(''):'<div class="empty mini">'+empty+'</div>'}
 var tg=top(genres),tm=top(moods),longest=sessions.slice().sort(function(a,b){return (+b.entry.minutes||0)-(+a.entry.minutes||0)})[0];
 var thisYear=String(yearNow()),yearFinished=finished.filter(function(b){return String(b.finishedDate||'').slice(0,4)===thisYear&&!b.readDateUnknown}).length;
 return '<div class="insights-hero"><div><div class="eyebrow">📊 V4.17 • READING STATISTICS & INSIGHTS</div><h1 class="title">Your reading life, in numbers.</h1><p class="sub">Built from your library and Reading Journal — no guessing, just the story your own data tells.</p></div><div class="insight-orb">🔮</div></div>'+
 '<div class="insight-kpis"><div><b>'+sessions.length+'</b><span>Sessions logged</span></div><div><b>'+Object.keys(readingDays).length+'</b><span>Reading days</span></div><div><b>'+minutes+'</b><span>Minutes read</span></div><div><b>'+pages+'</b><span>Pages logged</span></div><div><b>'+finished.length+'</b><span>Books read</span></div><div><b>'+avg+'</b><span>Average rating</span></div></div>'+
 '<div class="insight-grid"><section class="insight-card"><div class="eyebrow">✨ THIS YEAR</div><h2>'+thisYear+' at a glance</h2><div class="insight-big">'+yearFinished+' <small>books finished</small></div><p class="muted">Books marked Read with a known '+thisYear+' finish date.</p></section>'+
 '<section class="insight-card"><div class="eyebrow">🕯️ READING RHYTHM</div><h2>Your journal pulse</h2><div class="insight-callouts"><div><b>'+(tm?esc(tm[0]):'—')+'</b><span>Most logged mood</span></div><div><b>'+(longest?(+longest.entry.minutes||0)+' min':'—')+'</b><span>Longest session</span></div></div></section>'+
 '<section class="insight-card"><div class="eyebrow">📚 GENRE SPELLBOOK</div><h2>What you reach for</h2>'+(tg?'<p class="insight-lead">Your most-journaled genre is <b>'+esc(tg[0])+'</b>.</p>':'')+bars(genres,'Log reading sessions on books with genres to reveal your patterns.')+'</section>'+
 '<section class="insight-card"><div class="eyebrow">🌙 READING MOODS</div><h2>How reading feels</h2>'+bars(moods,'Your Reading Journal moods will gather here.')+'</section>'+
 '<section class="insight-card insight-wide"><div class="eyebrow">⭐ RATINGS</div><h2>Your rating constellation</h2>'+bars(ratings,'Rate finished books and your constellation will appear here.')+'</section></div>'+
 '<div class="insight-note">✨ Pages logged are calculated from the page progress you record in Reading Journal sessions. Statistics grow naturally as you use the Bookshop.</div>'
}

function readingJournal2(){
 var books=journalBooks(),sessions=[];books.forEach(function(b){journalSessions(b).forEach(function(x){sessions.push({book:b,session:x})})});sessions.sort(function(a,b){return String(b.session.date||"").localeCompare(String(a.session.date||""))});
 var active=owned().filter(function(b){return b.status==="currently-reading"||b.status==="rereading"}),finished=owned().filter(function(b){return b.status==="read"&&b.finishedDate});
 function activeCard(b){var rp=b.readingProgress||{},pct=Math.max(0,Math.min(100,+rp.percent||0));return '<article class="journal-book"><div class="journal-cover">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="">':'📖')+'</div><div class="journal-book-body"><div class="eyebrow">'+(b.status==='rereading'?'🔁 REREADING':'📖 CURRENTLY READING')+'</div><h3>'+esc(b.title)+'</h3><p>'+esc(b.author||'')+'</p><div class="journal-progress"><i style="width:'+pct+'%"></i></div><div class="journal-progress-label"><span>'+(rp.page?'Page '+esc(rp.page):'Progress')+'</span><b>'+pct+'%</b></div><button class="primary" data-log-reading="'+esc(b.id)+'">＋ Log reading</button></div></article>'}
 function sessionCard(x){var s=x.session,b=x.book;return '<article class="reading-entry"><div class="reading-entry-top"><div><div class="eyebrow">'+esc(s.date||'Reading session')+'</div><h3>'+esc(b.title)+'</h3></div><span class="reading-mood">'+esc(s.mood||'📖')+'</span></div><div class="reading-entry-meta">'+(s.page?'<span>📄 Page '+esc(s.page)+'</span>':'')+(s.percent?'<span>✨ '+esc(s.percent)+'%</span>':'')+(s.minutes?'<span>⏱️ '+esc(s.minutes)+' min</span>':'')+'</div>'+(s.reaction?'<blockquote>“'+esc(s.reaction)+'”</blockquote>':'')+(s.quote?'<div class="journal-quote">💬 '+esc(s.quote)+'</div>':'')+(s.notes?'<p>'+esc(s.notes)+'</p>':'')+'<div class="reading-entry-actions"><button class="pill" data-edit-reading="'+esc(b.id)+'" data-entry-id="'+esc(s.id)+'">✏️ Edit</button><button class="pill danger" data-delete-reading="'+esc(b.id)+'" data-entry-id="'+esc(s.id)+'">🗑️ Delete</button></div></article>'}
 return '<div class="journal-hero"><div class="eyebrow">📖 V4.15.2 • READING JOURNAL 2.0</div><h1 class="title">My Reading Journal</h1><p class="sub">Track the reading, not just the books — progress, sessions, reactions, quotes, rereads, and the little thoughts you want to remember.</p></div><div class="journal-stats"><div><b>'+active.length+'</b><span>Reading now</span></div><div><b>'+sessions.length+'</b><span>Sessions logged</span></div><div><b>'+finished.length+'</b><span>Finished books</span></div></div><section class="journal-section"><div class="journal-heading"><div><div class="eyebrow">🌙 ON THE NIGHTSTAND</div><h2>Currently reading</h2></div></div><div class="journal-books">'+(active.length?active.map(activeCard).join(''):'<div class="empty">Nothing is marked Currently Reading yet. Open a book and change its reading status when you start. ✨</div>')+'</div></section><section class="journal-section"><div class="journal-heading"><div><div class="eyebrow">🕯️ READING MEMORIES</div><h2>Recent journal entries</h2></div></div><div class="reading-timeline">'+(sessions.length?sessions.slice(0,30).map(sessionCard).join(''):'<div class="empty">Your journal is waiting for its first reading session. 📖</div>')+'</div></section>'
}
function openReadingSession(b,existing){
 existing=existing||null;var rp=b.readingProgress||{},today=dateOnly(),totalPages=parseInt(b.edition&&b.edition.pages,10),hasPages=Number.isFinite(totalPages)&&totalPages>0;
 var v=function(k,fallback){return existing&&existing[k]!=null?existing[k]:(fallback==null?'':fallback)};
 var percentField=field('Percent complete','sessionPercent',v('percent',rp.percent||''));
 if(hasPages)percentField=percentField.replace('<label>Percent complete</label>','<label>Percent complete <span class="tiny">✨ automatic from page ÷ '+esc(totalPages)+' pages</span></label>');
 el('#modalBody').innerHTML='<div class="eyebrow">📖 READING JOURNAL 2.0</div><h1 class="title">'+(existing?'Edit reading entry':'Log your reading')+'</h1><p class="sub"><b>'+esc(b.title)+'</b> • '+esc(b.author||'')+(hasPages?' • '+esc(totalPages)+' pages':'')+'</p><form id="readingSessionForm"><div class="form">'+field('Date','sessionDate',v('date',today),true)+field('Page','sessionPage',v('page',rp.page||''))+percentField+field('Minutes read','sessionMinutes',v('minutes',''))+selectField('Reading mood','sessionMood',['📖 Cozy','😍 Obsessed','😳 WHAT','😭 Emotional','😡 Furious','🤔 Thinking','😴 Sleepy'], v('mood','📖 Cozy'))+'<div class="field full"><label>Immediate reaction</label><textarea name="sessionReaction" placeholder="WHAT JUST HAPPENED?!">'+esc(v('reaction',''))+'</textarea></div><div class="field full"><label>Favorite quote from this session</label><textarea name="sessionQuote" placeholder="A line you want to remember...">'+esc(v('quote',''))+'</textarea></div><div class="field full"><label>Notes / theories / thoughts</label><textarea name="sessionNotes" placeholder="Predictions, character thoughts, feelings, theories...">'+esc(v('notes',''))+'</textarea></div></div><div class="actions">'+(existing?'<button class="danger" type="button" id="deleteReadingEntry">🗑️ Delete entry</button>':'')+'<button class="primary" type="submit">'+(existing?'✏️ Save changes':'🕯️ Save journal entry')+'</button></div></form>';
 el('#modal').classList.remove('hidden');
 var form=el('#readingSessionForm'),pageInput=form.elements['sessionPage'],percentInput=form.elements['sessionPercent'];
 if(hasPages){
  percentInput.readOnly=true;percentInput.inputMode='numeric';percentInput.title='Calculated automatically from the page number and saved page count.';
  var updatePercent=function(){var page=parseFloat(pageInput.value);if(!Number.isFinite(page)||page<0){percentInput.value='';return}percentInput.value=String(Math.max(0,Math.min(100,Math.round((page/totalPages)*100))))};
  pageInput.addEventListener('input',updatePercent);if(pageInput.value)updatePercent();
 }else{percentInput.placeholder='Enter manually — page count is not saved';percentInput.inputMode='numeric'}
 form.onsubmit=function(ev){ev.preventDefault();var f=new FormData(ev.target),entry={id:existing?existing.id:'r_'+Date.now().toString(36),date:f.get('sessionDate'),page:f.get('sessionPage'),percent:f.get('sessionPercent'),minutes:f.get('sessionMinutes'),mood:f.get('sessionMood'),reaction:f.get('sessionReaction'),quote:f.get('sessionQuote'),notes:f.get('sessionNotes'),createdAt:existing&&existing.createdAt?existing.createdAt:now(),updatedAt:now()};b.readingJournal=[].concat(b.readingJournal||[]);if(existing){var ix=b.readingJournal.findIndex(function(x){return x.id===existing.id});if(ix>=0)b.readingJournal[ix]=entry;else b.readingJournal.push(entry)}else b.readingJournal.push(entry);recalcReadingProgress(b);b.updatedAt=now();save();closeModal();state.view='journal';render();autoSyncMaybe()};
 if(existing&&el('#deleteReadingEntry'))el('#deleteReadingEntry').onclick=function(){if(!confirm('Delete this reading journal entry? This cannot be undone.'))return;b.readingJournal=[].concat(b.readingJournal||[]).filter(function(x){return x.id!==existing.id});recalcReadingProgress(b);b.updatedAt=now();save();closeModal();state.view='journal';render();autoSyncMaybe()}
}


/* V4.18 — TBR Oracle */
function oracleCandidates(){
 var seen={};return owned().filter(function(b){return b.status==="want-to-read"}).filter(function(b){var k=norm(b.title)+"|"+norm(b.author||"");if(seen[k])return false;seen[k]=1;return true})
}
function oracleGenres(){var s={};oracleCandidates().forEach(function(b){(b.genres||[]).forEach(function(g){if(g)s[g]=1})});return Object.keys(s).sort()}
function oracleMoodMatch(b,mood){
 if(!mood||mood==="Anything")return true;var blob=[].concat(b.genres||[],b.tags||[],[b.title||""]).join(" ").toLowerCase();
 var map={"Dark & dangerous":["dark romance","horror","thriller","mafia","dystopian"],"Romantic":["romance","romantasy","love"],"Mysterious":["mystery","thriller","crime","suspense"],"Magical":["fantasy","romantasy","paranormal","magic","witch"],"Emotional":["contemporary","realistic fiction","memoir","literary"]};
 return (map[mood]||[]).some(function(x){return blob.indexOf(x)>=0})
}
function oracleFiltered(){
 var pool=oracleCandidates(),genre=state.oracleGenre||"Any",length=state.oracleLength||"Any",sp=state.oracleSpice||"Any",series=state.oracleSeries||"Any",fav=!!state.oracleFavorites;
 return pool.filter(function(b){
  if(genre!=="Any"&&(b.genres||[]).indexOf(genre)<0)return false;
  var pages=parseInt(b.edition&&b.edition.pages,10)||0;
  if(length==="Short"&&(!pages||pages>300))return false;if(length==="Medium"&&(!pages||pages<301||pages>450))return false;if(length==="Long"&&(!pages||pages<451))return false;
  var spiceVal=+b.spice||0;if(sp==="Clean / mild"&&spiceVal>2)return false;if(sp==="Spicy"&&spiceVal<3)return false;if(sp==="Very spicy"&&spiceVal<4)return false;
  if(series==="Series"&&!b.series)return false;if(series==="Standalone"&&b.series)return false;if(fav&&!b.favorite)return false;return true
 })
}
function oraclePick(force){
 var pool=oracleFiltered(),mood=state.oracleMood||"Anything";if(!pool.length){state.oraclePickId="";save();render();return}
 var preferred=pool.filter(function(b){return oracleMoodMatch(b,mood)}),choices=preferred.length?preferred:pool,last=state.oraclePickId||"";
 if(force&&choices.length>1)choices=choices.filter(function(b){return b.id!==last});var b=choices[Math.floor(Math.random()*choices.length)];state.oraclePickId=b.id;save();render()
}
function tbrOracle(){
 var pool=oracleFiltered(),pick=visible().find(function(b){return b.id===state.oraclePickId&&pool.some(function(x){return x.id===b.id})}),genres=oracleGenres();
 function opts(arr,val){return arr.map(function(x){return'<option '+(x===val?'selected':'')+'>'+esc(x)+'</option>'}).join('')}
 var result='';if(pick){var pg=parseInt(pick.edition&&pick.edition.pages,10)||0,reasons=[];if(pick.series)reasons.push('🔮 '+pick.series+(pick.seriesNo?' #'+pick.seriesNo:''));if((pick.genres||[]).length)reasons.push('🌙 '+pick.genres.slice(0,2).join(' • '));if(pg)reasons.push('📄 '+pg+' pages');if(+pick.spice)reasons.push('🌶️ '+pick.spice+'/5');if(pick.favorite)reasons.push('⭐ Favorite');result='<section class="oracle-result"><div class="oracle-glow">✨</div><div class="oracle-cover">'+(pick.cover?'<img src="'+esc(pick.cover)+'" alt="">':'📖')+'</div><div class="oracle-result-body"><div class="eyebrow">THE ORACLE HAS SPOKEN</div><h2>'+esc(pick.title)+'</h2><p class="oracle-author">'+esc(pick.author||'')+'</p><div class="oracle-reasons">'+reasons.map(function(x){return'<span>'+esc(x)+'</span>'}).join('')+'</div><p class="oracle-whisper">'+((state.oracleMood&&state.oracleMood!=="Anything"&&oracleMoodMatch(pick,state.oracleMood))?'It heard your “'+esc(state.oracleMood)+'” mood and found this on your own shelves.':'Chosen from the unread books you already own. No guilt. Just vibes.')+'</p><div class="actions"><button class="primary" id="oracleStart" data-id="'+esc(pick.id)+'">📖 Start this book</button><button class="pill" id="oracleOpen" data-id="'+esc(pick.id)+'">View book</button><button class="pill" id="oracleReroll">🎲 Tempt me again</button></div></div></section>'}else result='<div class="oracle-empty">'+(pool.length?'The cards are shuffled. Tap <b>Consult the Oracle</b>. 🔮':'No unread owned books match those filters. Loosen one of the spells and try again. ✨')+'</div>';
 return '<section class="oracle-hero"><div><div class="eyebrow">🔮 V4.18.1 • TBR ORACLE</div><h1 class="title">What the fuck do I read?</h1><p class="sub">Tell the Bookshop your current vibe. The Oracle will choose from books you <b>actually own</b> and have marked Want to Read.</p></div><div class="oracle-orb">🔮</div></section><section class="oracle-controls"><div class="oracle-field"><label>Mood</label><select id="oracleMood">'+opts(['Anything','Dark & dangerous','Romantic','Mysterious','Magical','Emotional'],state.oracleMood||'Anything')+'</select></div><div class="oracle-field"><label>Genre</label><select id="oracleGenre">'+opts(['Any'].concat(genres),state.oracleGenre||'Any')+'</select></div><div class="oracle-field"><label>Length</label><select id="oracleLength">'+opts(['Any','Short','Medium','Long'],state.oracleLength||'Any')+'</select></div><div class="oracle-field"><label>Spice</label><select id="oracleSpice">'+opts(['Any','Clean / mild','Spicy','Very spicy'],state.oracleSpice||'Any')+'</select></div><div class="oracle-field"><label>Series?</label><select id="oracleSeries">'+opts(['Any','Series','Standalone'],state.oracleSeries||'Any')+'</select></div><label class="oracle-check"><input type="checkbox" id="oracleFavorites" '+(state.oracleFavorites?'checked':'')+'> ⭐ Favorites only</label><div class="oracle-pool"><b>'+pool.length+'</b><span>books in the cauldron</span></div><button class="primary oracle-consult" id="oracleConsult">🔮 Consult the Oracle</button><button class="pill" id="oracleReset">↻ Clear spells</button></section>'+result+'<div class="insight-note">The Oracle only uses information already saved in your Bookshop. Mood is a preference: if none of the filtered books match that vibe, it still chooses from the rest of your matching shelf instead of inventing metadata.</div>'
}

// V4.19 — Book Goblin Cleanup Mode. Diagnostic only: it never deletes, merges, or invents metadata.
function cleanupIssueData(){
 var books=owned(), byIsbn={}, byWork={};
 books.forEach(function(b){var isbn=cleanISBN(b.edition&&b.edition.isbn||'');if(isbn){(byIsbn[isbn]||(byIsbn[isbn]=[])).push(b)}var wk=norm(b.title)+'|'+norm(b.author||'');if(norm(b.title))(byWork[wk]||(byWork[wk]=[])).push(b)});
 return books.map(function(b){var e=b.edition||{},issues=[];
  function add(type,label,high){issues.push({type:type,label:label,high:!!high})}
  if(!String(b.cover||'').trim())add('covers','Missing cover',true);
  if(!cleanISBN(e.isbn||''))add('metadata','Missing ISBN',true);
  if(!String(e.pages||'').trim()||!(parseInt(e.pages,10)>0))add('metadata','Missing page count',false);
  if(!(b.genres||[]).filter(function(x){return String(x||'').trim()}).length)add('metadata','Missing genre',true);
  if(!String(e.format||'').trim())add('metadata','Missing format',false);
  if(!String(e.publisher||'').trim())add('metadata','Missing publisher',false);
  if(String(b.series||'').trim()&&!String(b.seriesNo||'').trim())add('series','Series number missing',true);
  var isbn=cleanISBN(e.isbn||'');if(isbn&&byIsbn[isbn]&&byIsbn[isbn].length>1)add('duplicates','Same ISBN on '+byIsbn[isbn].length+' copies',false);
  var wk=norm(b.title)+'|'+norm(b.author||'');if(!isbn&&byWork[wk]&&byWork[wk].length>1)add('duplicates','Multiple copies need edition review',false);
  return{book:b,issues:issues}
 }).filter(function(x){return x.issues.length})
}
function cleanupMode(){
 var rows=cleanupIssueData(),filter=state.cleanupFilter||'all',allOwned=owned(),clean=Math.max(0,allOwned.length-rows.length),issueCount=rows.reduce(function(n,x){return n+x.issues.length},0),pct=allOwned.length?Math.round(clean/allOwned.length*100):100;
 var counts={covers:0,metadata:0,series:0,duplicates:0};rows.forEach(function(x){Object.keys(counts).forEach(function(k){if(x.issues.some(function(i){return i.type===k}))counts[k]++})});
 var shown=filter==='all'?rows:rows.filter(function(x){return x.issues.some(function(i){return i.type===filter})});
 function tab(k,label,n){return'<button class="pill '+(filter===k?'active':'')+'" data-cleanup-filter="'+k+'">'+label+' <b>'+n+'</b></button>'}
 var cards=shown.map(function(x){var b=x.book,issues=(filter==='all'?x.issues:x.issues.filter(function(i){return i.type===filter}));return '<article class="cleanup-card"><div class="cleanup-thumb">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="">':'📕')+'</div><div><b>'+esc(b.title||'Untitled book')+'</b><div class="muted">'+esc(b.author||'Unknown author')+'</div><div class="cleanup-issues">'+issues.map(function(i){return'<span class="cleanup-issue '+(i.high?'high':'')+'">'+esc(i.label)+'</span>'}).join('')+'</div>'+(issues.some(function(i){return i.type==='duplicates'})?'<div class="cleanup-review">Duplicate signals are review-only: legitimate extra copies are never merged automatically.</div>':'')+'</div><div class="actions"><button class="primary" data-cleanup-fix="'+esc(b.id)+'">🧹 Fix record</button><button class="pill" data-cleanup-view="'+esc(b.id)+'">View book</button></div></article>'}).join('');
 if(!cards)cards='<div class="cleanup-clean"><div style="font-size:42px">✨🧹✨</div><h2>'+((filter==='all')?'The goblin found nothing to clean!':'This shelf is spotless.')+'</h2><p class="muted">'+((filter==='all')?'Every owned book passed the checks this mode knows how to make.':'No books currently have this kind of cleanup issue.')+'</p></div>';
 return '<section class="cleanup-hero"><div><div class="eyebrow">🧹 V4.19 • BOOK GOBLIN CLEANUP MODE</div><h1 class="title">Find the messy little records.</h1><p class="sub">A safe cleanup sweep for your <b>owned physical library</b>: missing covers, ISBNs, pages, genres, edition details, series positions, and copy-review signals.</p></div><div class="cleanup-goblin">🧌🧹</div></section><section class="cleanup-summary"><div class="cleanup-stat"><b>'+allOwned.length+'</b><span>owned books checked</span></div><div class="cleanup-stat"><b>'+rows.length+'</b><span>books need attention</span></div><div class="cleanup-stat"><b>'+issueCount+'</b><span>cleanup flags</span></div><div class="cleanup-stat"><b>'+pct+'%</b><span>records passing every check</span><div class="cleanup-progress"><i style="width:'+pct+'%"></i></div></div></section><div class="cleanup-tabs">'+tab('all','🧹 All',rows.length)+tab('covers','🖼️ Covers',counts.covers)+tab('metadata','📚 Metadata',counts.metadata)+tab('series','🔮 Series',counts.series)+tab('duplicates','👯 Copy review',counts.duplicates)+'</div><div class="cleanup-list">'+cards+'</div><div class="insight-note cleanup-note">🛡️ <b>Goblin safety rule:</b> Cleanup Mode diagnoses your saved records only. It never deletes books, merges copies, or invents missing metadata. “Fix record” opens your normal editor so <b>you</b> stay in control.</div>'
}


// V4.20 — Achievements. Derived from real saved Bookshop data wherever possible.
function achievementMetrics(){
 var o=owned(),sessions=[],pages=0,minutes=0,byBook={},moods={},genres={},specialBooks=0,signedBooks=0;
 o.forEach(function(b){
  (b.genres||[]).forEach(function(g){if(String(g||'').trim())genres[String(g).trim()]=1});
  var feats=collectorFeatureMap(b);if(Object.keys(feats).length)specialBooks++;if(feats.signed)signedBooks++;
  (b.readingJournal||[]).forEach(function(e){sessions.push({book:b,entry:e});minutes+=(+e.minutes||0);if(e.mood)moods[e.mood]=1;var pg=+e.page||0;if(pg){var k=b.id||b.title,prev=byBook[k]||0;if(pg>=prev)pages+=pg-prev;byBook[k]=Math.max(prev,pg)}})
 });
 var confirmed=seriesCatalog.filter(function(x){return !x.deleted&&x.confirmed&&Array.isArray(x.books)&&x.books.length}),complete=0;
 confirmed.forEach(function(cat){var own=o.filter(function(b){return norm(b.series)===norm(cat.name)});if(cat.books.every(function(x){return ownedSeriesEntry(x,own)}))complete++});
 var cleanRows=cleanupIssueData(),cleanCount=Math.max(0,o.length-cleanRows.length),rated=o.filter(function(b){return +b.rating>0}).length;
 var workCopies={};o.forEach(function(b){var k=norm(b.title)+'|'+norm(b.author||'');if(k)(workCopies[k]||(workCopies[k]=[])).push(b)});var multiEdition=Object.keys(workCopies).filter(function(k){var a=workCopies[k],isbns={};a.forEach(function(b){var x=cleanISBN(b.edition&&b.edition.isbn||'');if(x)isbns[x]=1});return a.length>1&&Object.keys(isbns).length>1}).length;
 return {owned:o.length,read:o.filter(function(b){return b.status==='read'}).length,tbr:o.filter(function(b){return b.status==='want-to-read'}).length,favorites:o.filter(function(b){return b.favorite}).length,rated:rated,fiveStar:o.filter(function(b){return +b.rating===5}).length,sessions:sessions.length,pages:pages,minutes:minutes,memories:sessions.filter(function(x){var e=x.entry;return String(e.reaction||'').trim()||String(e.quote||'').trim()||String(e.notes||'').trim()}).length,quotes:sessions.filter(function(x){return String(x.entry.quote||'').trim()}).length,moods:Object.keys(moods).length,genres:Object.keys(genres).length,specialBooks:specialBooks,signedBooks:signedBooks,seriesBooks:o.filter(function(b){return String(b.series||'').trim()}).length,confirmedSeries:confirmed.length,completeSeries:complete,cleanCount:cleanCount,cleanPct:o.length?Math.round(cleanCount/o.length*100):100,multiEdition:multiEdition}
}
function achievementDefinitions(m){
 function a(id,cat,icon,name,desc,rarity,current,goal){current=Math.max(0,+current||0);goal=Math.max(1,+goal||1);return{id:id,category:cat,icon:icon,name:name,desc:desc,rarity:rarity,current:current,goal:goal,unlocked:current>=goal}}
 return [
  a('first-chapter','Reading','📖','First Chapter','Log your first real Reading Journal session.','Common',m.sessions,1),
  a('page-turner','Reading','📄','Page Turner','Log 100 pages of reading progress.','Common',m.pages,100),
  a('thousand-pages','Reading','🪶','A Thousand Pages Deep','Log 1,000 pages of reading progress.','Rare',m.pages,1000),
  a('ten-hours','Reading','🕯️','Ten Hours in the Stacks','Log 600 minutes of reading time.','Rare',m.minutes,600),
  a('first-finish','Reading','✨','The End?','Finish your first tracked book.','Common',m.read,1),
  a('five-finished','Reading','📚','Five Down','Finish 5 tracked books.','Rare',m.read,5),
  a('book-dragon','Reading','🐉','Book Dragon','Finish 25 tracked books.','Epic',m.read,25),
  a('dear-diary','Journal','✍️','Dear Diary…','Log 5 reading sessions.','Common',m.sessions,5),
  a('memory-keeper','Journal','🕯️','Memory Keeper','Save reactions, notes, or quotes in 5 sessions.','Rare',m.memories,5),
  a('quote-collector','Journal','💬','Quote Collector','Save 5 favorite quotes in your journal.','Rare',m.quotes,5),
  a('mood-mapper','Journal','🌙','Mood Mapper','Log 4 different reading moods.','Rare',m.moods,4),
  a('shelf-starter','Collection','📚','Shelf Starter','Own 5 cataloged physical books.','Common',m.owned,5),
  a('cozy-corner','Collection','🪵','Cozy Corner','Grow your physical library to 25 books.','Rare',m.owned,25),
  a('dragon-hoard','Collection','🐲','Dragon’s Hoard','Grow your physical library to 100 books.','Legendary',m.owned,100),
  a('favorite-spell','Collection','⭐','Favorite Spell','Mark your first favorite book.','Common',m.favorites,1),
  a('genre-wanderer','Collection','🗺️','Genre Wanderer','Own books across 5 different saved genres.','Rare',m.genres,5),
  a('tbr-apprentice','Collection','🔮','TBR Apprentice','Have 5 owned books waiting on your TBR.','Common',m.tbr,5),
  a('tbr-mountain','Collection','⛰️','TBR Mountain','Have 50 owned books waiting on your TBR.','Epic',m.tbr,50),
  a('five-star','Reading','🌟','Five-Star Summoning','Give a book a 5-star rating.','Common',m.fiveStar,1),
  a('critic','Reading','🧐','Critic in Residence','Rate 5 books.','Rare',m.rated,5),
  a('shiny-thing','Collector','💎','Ooooh, Shiny','Own a copy with a saved collector feature.','Common',m.specialBooks,1),
  a('collector-cabinet','Collector','🗝️','Collector’s Cabinet','Own 5 books with saved collector features.','Epic',m.specialBooks,5),
  a('signed-sealed','Collector','✒️','Signed & Sealed','Catalog a signed copy.','Rare',m.signedBooks,1),
  a('edition-goblin','Collector','👯','Edition Goblin','Catalog two different ISBN editions of the same work.','Epic',m.multiEdition,1),
  a('series-initiate','Series','🧩','Series Initiate','Catalog your first book with a series.','Common',m.seriesBooks,1),
  a('series-brainiac','Series','🧠','Series Brainiac','Confirm 3 full series lineups.','Rare',m.confirmedSeries,3),
  a('series-slayer','Series','⚔️','Series Slayer','Own every confirmed volume in a series lineup.','Epic',m.completeSeries,1),
  a('spotless','Goblin','🧹','The Goblin Has Standards','Reach a 100% clean owned library with at least 1 book.','Rare',(m.owned>0&&m.cleanPct===100)?1:0,1),
  a('meticulous','Goblin','🧌','Meticulous Goblin','Keep 25 owned records passing every Cleanup check.','Epic',m.cleanCount,25)
 ]
}
function achievementsPage(){
 var m=achievementMetrics(),defs=achievementDefinitions(m),cat=state.achievementFilter||'All',unlocked=defs.filter(function(x){return x.unlocked}).length,pct=Math.round(unlocked/defs.length*100),cats=['All','Reading','Journal','Collection','Collector','Series','Goblin'];
 var shown=cat==='All'?defs:defs.filter(function(x){return x.category===cat}),rare={Common:0,Rare:0,Epic:0,Legendary:0};defs.filter(function(x){return x.unlocked}).forEach(function(x){rare[x.rarity]=(rare[x.rarity]||0)+1});
 function badge(x){var p=Math.max(0,Math.min(100,Math.round(x.current/x.goal*100))),num=(x.goal===1?(x.unlocked?'Earned':'Locked'):(Math.min(x.current,x.goal)+' / '+x.goal));return '<article class="achievement-card '+(x.unlocked?'unlocked':'locked')+' rarity-'+norm(x.rarity)+'"><div class="achievement-medal"><span>'+esc(x.icon)+'</span>'+(!x.unlocked?'<i>🔒</i>':'<i>✨</i>')+'</div><div class="achievement-body"><div class="achievement-top"><div><span class="achievement-rarity">'+esc(x.rarity)+'</span><h3>'+esc(x.name)+'</h3></div><b class="achievement-state">'+num+'</b></div><p>'+esc(x.desc)+'</p><div class="achievement-progress"><i style="width:'+p+'%"></i></div>'+(x.unlocked?'<small>🏆 Earned from your current saved Bookshop data.</small>':'<small>'+p+'% toward unlocking</small>')+'</div></article>'}
 var tabs=cats.map(function(x){var n=x==='All'?defs.length:defs.filter(function(a){return a.category===x}).length;return'<button class="pill '+(cat===x?'active':'')+'" data-achievement-filter="'+esc(x)+'">'+esc(x)+' <b>'+n+'</b></button>'}).join('');
 var finale=unlocked===defs.length?'<section class="achievement-finale"><div>👑✨📚✨👑</div><h2>The whole cabinet is glowing.</h2><p>You have earned every achievement currently hidden in Enchanted Bookshop. The vault has officially been robbed.</p></section>':'';
 return '<section class="achievement-hero"><div><div class="eyebrow">🏅 V4.20 • ACHIEVEMENTS</div><h1 class="title">The Trophy Cabinet</h1><p class="sub">Milestones pulled from your <b>real library, journal, series, collector, and Cleanup data</b>. No made-up unlock dates. If the Bookshop can prove it, you earn it.</p></div><div class="achievement-crown">🏆</div></section><section class="achievement-summary"><div><b>'+unlocked+'</b><span>earned</span></div><div><b>'+defs.length+'</b><span>achievements</span></div><div><b>'+pct+'%</b><span>cabinet complete</span></div><div class="achievement-rarity-summary"><span>Common <b>'+rare.Common+'</b></span><span>Rare <b>'+rare.Rare+'</b></span><span>Epic <b>'+rare.Epic+'</b></span><span>Legendary <b>'+rare.Legendary+'</b></span></div></section><div class="achievement-master-progress"><i style="width:'+pct+'%"></i></div><div class="achievement-tabs">'+tabs+'</div><div class="achievement-grid">'+shown.map(badge).join('')+'</div>'+finale+'<div class="insight-note">✨ Achievements are recalculated from the data already saved in your Bookshop, so data-backed milestones can unlock retroactively. Progress changes naturally as your real library grows.</div>'
}



// V4.21 — Power Search + Smart Shelves
function smartShelfList(){if(!Array.isArray(state.smartShelves))state.smartShelves=[];return state.smartShelves}
function powerGenres(){var x={};owned().forEach(function(b){(b.genres||[]).forEach(function(g){if(g)x[g]=1})});return Object.keys(x).sort()}
function powerCriteria(){return state.powerCriteria||{q:'',genre:'Any',status:'Any',length:'Any',spice:'Any',series:'Any',favorite:false,collector:false,signed:false}}
function powerMatch(b,c){
 c=c||powerCriteria();var q=norm(c.q||'');if(q){var hay=norm([b.title,b.author,b.series].concat(b.genres||[],b.tags||[],[(b.edition&&b.edition.isbn)||'',(b.edition&&b.edition.publisher)||'']).join(' '));if(hay.indexOf(q)<0)return false}
 if(c.genre&&c.genre!=='Any'&&!(b.genres||[]).some(function(g){return norm(g)===norm(c.genre)}))return false;
 if(c.status&&c.status!=='Any'&&effectiveReadingStatus(b)!==c.status)return false;
 var pg=parseInt(b.edition&&b.edition.pages,10)||0;if(c.length==='Short'&&(!pg||pg>300))return false;if(c.length==='Medium'&&(!pg||pg<301||pg>450))return false;if(c.length==='Long'&&(!pg||pg<451))return false;
 var sp=+b.spice||0;if(c.spice==='Clean / mild'&&sp>2)return false;if(c.spice==='Spicy'&&sp<3)return false;if(c.spice==='Very spicy'&&sp<4)return false;
 if(c.series==='Series'&&!b.series)return false;if(c.series==='Standalone'&&b.series)return false;
 if(c.favorite&&!b.favorite)return false;
 var ed=b.edition||{},special=[].concat(ed.special||[]).map(norm),features=[].concat(b.collectorFeatures||[],b.copyFeatures||[]).map(norm);
 if(c.collector&&!(special.length||features.length||ed.collectorEdition||ed.specialEdition))return false;
 if(c.signed&&!(ed.signed||b.signed||special.indexOf('signed')>=0||features.indexOf('signed')>=0))return false;
 return true
}
function powerResults(c){return owned().filter(function(b){return powerMatch(b,c)})}
function powerSearchPage(){
 var c=powerCriteria(),genres=powerGenres(),res=powerResults(c),shelves=smartShelfList();
 function op(a,v){return a.map(function(x){return'<option '+(x===v?'selected':'')+'>'+esc(x)+'</option>'}).join('')}
 var shelfCards=shelves.map(function(sh){var n=powerResults(sh.criteria||{}).length;return '<article class="smart-shelf-card"><div><div class="eyebrow">SMART SHELF</div><h3>'+esc(sh.name)+'</h3><div class="muted">'+n+' matching book'+(n===1?'':'s')+' • updates automatically</div></div><div class="actions"><button class="primary" data-smart-open="'+esc(sh.id)+'">Open shelf</button><button class="pill" data-smart-delete="'+esc(sh.id)+'">Delete</button></div></article>'}).join('');
 var cards=res.map(card).join('')||'<div class="power-empty">No owned books match this combination. Change a filter and the shelf will refill. ✨</div>';
 return '<section class="power-hero"><div><div class="eyebrow">🔍 V4.21 • POWER SEARCH + SMART SHELVES</div><h1 class="title">Search your shelves like magic.</h1><p class="sub">Combine the information already saved in your Bookshop. Hard filters stay exact, and saved Smart Shelves update automatically as your library changes.</p></div><div class="power-orb">🔍✨</div></section>'+
 '<section class="power-controls"><div class="power-field wide"><label>Search</label><input id="powerQ" value="'+esc(c.q||'')+'" placeholder="Title, author, series, tag, ISBN…"></div><div class="power-field"><label>Genre</label><select id="powerGenre">'+op(['Any'].concat(genres),c.genre||'Any')+'</select></div><div class="power-field"><label>Reading status</label><select id="powerStatus">'+op(['Any','no-reading-status','want-to-read','currently-reading','read','dnf','rereading'],c.status||'Any')+'</select></div><div class="power-field"><label>Length</label><select id="powerLength">'+op(['Any','Short','Medium','Long'],c.length||'Any')+'</select></div><div class="power-field"><label>Spice</label><select id="powerSpice">'+op(['Any','Clean / mild','Spicy','Very spicy'],c.spice||'Any')+'</select></div><div class="power-field"><label>Series?</label><select id="powerSeries">'+op(['Any','Series','Standalone'],c.series||'Any')+'</select></div><label class="power-check"><input type="checkbox" id="powerFavorite" '+(c.favorite?'checked':'')+'> ⭐ Favorites</label><label class="power-check"><input type="checkbox" id="powerCollector" '+(c.collector?'checked':'')+'> 💎 Collector features</label><label class="power-check"><input type="checkbox" id="powerSigned" '+(c.signed?'checked':'')+'> ✒️ Signed</label><div class="power-count"><b>'+res.length+'</b><span>matching owned books</span></div><button class="primary" id="saveSmartShelf">✨ Save as Smart Shelf</button><button class="pill" id="clearPower">Clear filters</button></section>'+
 '<section class="smart-shelves"><div class="power-section-title"><div><div class="eyebrow">YOUR SAVED MAGIC</div><h2>Smart Shelves</h2></div><span>'+shelves.length+' saved</span></div>'+(shelfCards||'<div class="power-empty small">No Smart Shelves yet. Build a search above, then save it. 📚</div>')+'</section>'+
 '<section class="power-results"><div class="power-section-title"><div><div class="eyebrow">LIVE RESULTS</div><h2>'+res.length+' book'+(res.length===1?'':'s')+'</h2></div></div><div class="grid">'+cards+'</div></section><div class="insight-note">🪄 Smart Shelves save the <b>rules</b>, not a frozen list of books. When your library data changes, the shelf changes with it. They are included in your normal JSON backup.</div>'
}
function readPowerControls(){var c={};c.q=(el('#powerQ')&&el('#powerQ').value)||'';['Genre','Status','Length','Spice','Series'].forEach(function(k){var n=el('#power'+k);c[k.toLowerCase()]=n?n.value:'Any'});c.favorite=!!(el('#powerFavorite')&&el('#powerFavorite').checked);c.collector=!!(el('#powerCollector')&&el('#powerCollector').checked);c.signed=!!(el('#powerSigned')&&el('#powerSigned').checked);state.powerCriteria=c;save();return c}

function render(){
 document.querySelectorAll("[data-view]").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-view")===state.view)});
 var c=el("#content");
 if(state.view==="home")c.innerHTML=home();
 else if(state.view==="library")c.innerHTML=library();
 else if(state.view==="browse")c.innerHTML=browse();
 else if(state.view==="series")c.innerHTML=series();
 else if(state.view==="wishlist")c.innerHTML=wishlist2();
 else if(state.view==="journal")c.innerHTML=readingJournal2();
 else if(state.view==="insights")c.innerHTML=readingInsights();
 else if(state.view==="tbr")c.innerHTML=shelf("📖 Want to Read",visible().filter(function(b){return b.status==="want-to-read"}));
 else if(state.view==="oracle")c.innerHTML=tbrOracle();
 else if(state.view==="cleanup")c.innerHTML=cleanupMode();
 else if(state.view==="achievements")c.innerHTML=achievementsPage();
 else if(state.view==="power")c.innerHTML=powerSearchPage();
 else if(state.view==="favorites")c.innerHTML=shelf("⭐ Favorites",visible().filter(function(b){return b.favorite}));
 else if(state.view==="atmospheres")c.innerHTML=atmospherePage();
 else if(state.view==="backup")c.innerHTML=backup();
 else if(state.view==="sync")c.innerHTML=syncPage();
 wirePage()
}
function field(label,name,value,required,full){return'<div class="field '+(full?"full":"")+'"><label>'+label+'</label><input name="'+name+'" '+(required?"required":"")+' value="'+esc(value||"")+'"></div>'}
function selectField(label,name,opts,value){return'<div class="field"><label>'+label+'</label><select name="'+name+'">'+opts.map(function(x){return'<option value="'+esc(x)+'" '+(x===value?"selected":"")+'>'+esc(x.replace(/-/g," "))+'</option>'}).join("")+'</select></div>'}
var GENRES=["Fantasy","Romantasy","Romance","Dark Romance","Mystery","Thriller","Horror","Contemporary","Realistic Fiction","Historical Fiction","Science Fiction","Dystopian","Paranormal","Young Adult","New Adult","Middle Grade","Literary Fiction","Nonfiction","Memoir/Biography","True Crime","Psychology/Mental Health","Poetry","Graphic Novel/Manga"];
function genreField(selected){selected=selected||[];var known=GENRES.slice();selected.forEach(function(g){if(g&&known.indexOf(g)<0)known.push(g)});return '<div class="field full genre-picker"><label>Genres</label><div class="genre-options">'+known.map(function(g){return '<label class="genre-chip"><input type="checkbox" name="genres" value="'+esc(g)+'" '+(selected.indexOf(g)>=0?"checked":"")+'> <span>'+esc(g)+'</span></label>'}).join("")+'</div><label class="custom-genre-label">Other / Custom Genre</label><input name="customGenre" placeholder="Add another genre (optional)"></div>';}
function isExtraType(type){var t=norm(type);return t.indexOf("novella")>=0||t.indexOf("prequel")>=0||t.indexOf("companion")>=0||t.indexOf("bonus")>=0||t.indexOf("anthology")>=0||t.indexOf("extra")>=0;}
function checkbox(name,label,checked){return'<div class="field"><label style="text-transform:none"><input type="checkbox" name="'+name+'" '+(checked?"checked":"")+'> '+label+'</label></div>'}
function parseCopyConnections(items){
 items=uniqText(items||[]);
 var o={birthday:false,sentimental:false,trip:false,signedInPerson:false,childhood:false,firstAuthor:false,boughtAt:"",boughtDate:"",giftedBy:"",custom:[]};
 items.forEach(function(x){
  if(x==="Published on my birthday")o.birthday=true;
  else if(x==="Sentimental copy")o.sentimental=true;
  else if(x==="Bought on a trip")o.trip=true;
  else if(x==="Signed in person")o.signedInPerson=true;
  else if(x==="Childhood copy")o.childhood=true;
  else if(x==="First book by this author")o.firstAuthor=true;
  else if(x.indexOf("Bought at: ")===0)o.boughtAt=x.slice(11);
  else if(x.indexOf("Bought on: ")===0)o.boughtDate=x.slice(11);
  else if(x.indexOf("Gifted by: ")===0)o.giftedBy=x.slice(11);
  else o.custom.push(x);
 });return o;
}
function copyConnectionsField(items){
 var m=parseCopyConnections(items);
 return '<div class="field full copy-connections"><div class="connection-head"><div><div class="eyebrow">BOOKISH CONNECTIONS 2.0</div><label>✨ The story of this copy</label><div class="tiny muted">Memories live on this physical copy — not every edition of the book.</div></div></div>'+
 '<div class="connection-presets">'+
 '<label class="memory-preset"><input type="checkbox" name="connectionBirthday" '+(m.birthday?"checked":"")+'> 🎂 Published on my birthday</label>'+
 '<label class="memory-preset"><input type="checkbox" name="connectionSentimental" '+(m.sentimental?"checked":"")+'> 💗 Sentimental copy</label>'+
 '<label class="memory-preset"><input type="checkbox" name="connectionTrip" '+(m.trip?"checked":"")+'> 🧳 Bought on a trip</label>'+
 '<label class="memory-preset"><input type="checkbox" name="connectionSigned" '+(m.signedInPerson?"checked":"")+'> ✍️ Signed in person</label>'+
 '<label class="memory-preset"><input type="checkbox" name="connectionChildhood" '+(m.childhood?"checked":"")+'> 🧸 Childhood copy</label>'+
 '<label class="memory-preset"><input type="checkbox" name="connectionFirstAuthor" '+(m.firstAuthor?"checked":"")+'> ✨ First book by this author</label></div>'+
 '<div class="connection-details"><div class="field"><label>🛍️ Bought at / found at</label><input name="connectionBoughtAt" placeholder="Bookstore, event, town..." value="'+esc(m.boughtAt)+'"></div>'+
 '<div class="field"><label>📅 Bought on</label><input type="date" name="connectionBoughtDate" value="'+esc(m.boughtDate)+'"></div>'+
 '<div class="field full"><label>🎁 Gifted by</label><input name="connectionGiftedBy" placeholder="Who gave this copy to you?" value="'+esc(m.giftedBy)+'"></div></div>'+
 '<label class="connection-notes-label">💭 Copy memories</label><textarea name="copyMemories" placeholder="One memory per line — why this copy matters, where you found it, who you were with...">'+esc(m.custom.join("\n"))+'</textarea>'+
 '<div class="tiny muted">Saved with this copy and included in your normal backup + sync.</div></div>'
}
function buildCopyConnections(f){
 var a=[];
 if(f.has("connectionBirthday"))a.push("Published on my birthday");
 if(f.has("connectionSentimental"))a.push("Sentimental copy");
 if(f.has("connectionTrip"))a.push("Bought on a trip");
 if(f.has("connectionSigned"))a.push("Signed in person");
 if(f.has("connectionChildhood"))a.push("Childhood copy");
 if(f.has("connectionFirstAuthor"))a.push("First book by this author");
 var at=String(f.get("connectionBoughtAt")||"").trim(),dt=String(f.get("connectionBoughtDate")||"").trim(),gb=String(f.get("connectionGiftedBy")||"").trim();
 if(at)a.push("Bought at: "+at);if(dt)a.push("Bought on: "+dt);if(gb)a.push("Gifted by: "+gb);
 return uniqText(a.concat(String(f.get("copyMemories")||"").split(/\n+/).map(function(x){return x.trim()}).filter(Boolean)));
}
function connectionDisplay(items){
 var m=parseCopyConnections(items),a=[];
 if(m.birthday)a.push("🎂 Published on my birthday");if(m.sentimental)a.push("💗 Sentimental copy");if(m.trip)a.push("🧳 Bought on a trip");if(m.signedInPerson)a.push("✍️ Signed in person");if(m.childhood)a.push("🧸 Childhood copy");if(m.firstAuthor)a.push("✨ First book by this author");
 if(m.boughtAt)a.push("🛍️ "+m.boughtAt);if(m.boughtDate)a.push("📅 "+m.boughtDate);if(m.giftedBy)a.push("🎁 Gifted by "+m.giftedBy);m.custom.forEach(function(x){a.push("💭 "+x)});
 return a;
}
async function enrichManualBookCoverOnly(book){
 try{
  if(!book||book.cover)return book;
  var isbn=cleanISBN(book.edition&&book.edition.isbn||"");
  if(!isbn)return book;
  var found=null,g=await googleLookup("isbn:"+isbn,isbn),o=await openLibraryISBN(isbn);
  if(g)found=mergeFound(found,g);if(o)found=mergeFound(found,o);
  if(found)found=await enrichBook(found,isbn);
  if(found&&found.cover&&await imageLoads(found.cover)){
   book.cover=found.cover;book.coverSource=found.coverSource||"ISBN metadata";
  }
 }catch(e){console.warn("Manual-entry cover enrichment skipped",e)}
 return book
}


function normalizeCoverURL(url){return String(url||"").replace(/^http:/,"https:")}
async function collectEditorCoverCandidates(book){
 var isbn=cleanISBN(book&&book.edition&&book.edition.isbn||""),title=String(book&&book.title||"").trim(),author=String(book&&book.author||"").trim(),all=[];
 function add(url,source,exact,label){
  url=normalizeCoverURL(url);if(!url||all.some(function(x){return x.url===url}))return;
  all.push({url:url,source:source||"Public metadata",exact:!!exact,label:label||(exact?"Exact ISBN candidate":"Possible work cover")})
 }
 // Direct Open Library ISBN image endpoint. ?default=false prevents the generic placeholder.
 if(isbn)add("https://covers.openlibrary.org/b/isbn/"+encodeURIComponent(isbn)+"-L.jpg?default=false","Open Library ISBN",true,"Exact ISBN")
 try{
  var queries=[];if(isbn){queries.push("isbn:"+isbn);queries.push(isbn)}
  for(var qi=0;qi<queries.length;qi++){
   var gr=await cachedFetchJSON("https://www.googleapis.com/books/v1/volumes?q="+encodeURIComponent(queries[qi])+"&maxResults=20");
   ((gr.ok&&gr.data&&gr.data.items)||[]).forEach(function(it){
    var v=it.volumeInfo||{},ids=v.industryIdentifiers||[],exact=isbn&&ids.some(function(z){return cleanISBN(z.identifier)===isbn});
    var u=v.imageLinks&&(v.imageLinks.extraLarge||v.imageLinks.large||v.imageLinks.medium||v.imageLinks.small||v.imageLinks.thumbnail||v.imageLinks.smallThumbnail);
    if(u)add(u,"Google Books"+(exact?" exact ISBN":""),exact,exact?"Exact ISBN":"Google Books edition")
   })
  }
 }catch(e){console.warn("Google cover candidates skipped",e)}
 try{
  if(title){
   var wr=await googleWorkItems(title,author);
   ((wr.ok&&wr.items)||[]).forEach(function(it){
    var v=it.volumeInfo||{},va=(v.authors||[]).join(", ");
    if(similarity(title,v.title||"")<6||(author&&similarity(author,va)<4))return;
    var ids=v.industryIdentifiers||[],exact=isbn&&ids.some(function(z){return cleanISBN(z.identifier)===isbn});
    var u=v.imageLinks&&(v.imageLinks.extraLarge||v.imageLinks.large||v.imageLinks.medium||v.imageLinks.small||v.imageLinks.thumbnail||v.imageLinks.smallThumbnail);
    if(u)add(u,"Google Books title + author",exact,exact?"Exact ISBN":"Same-work candidate")
   })
  }
 }catch(e){console.warn("Google work cover candidates skipped",e)}
 try{
  if(title){
   var qs="title="+encodeURIComponent(title)+(author?"&author="+encodeURIComponent(author):"")+"&limit=20&fields=title,author_name,cover_i,isbn,edition_key";
   var ol=await cachedFetchJSON("https://openlibrary.org/search.json?"+qs);
   ((ol.ok&&ol.data&&ol.data.docs)||[]).forEach(function(d){
    var da=(d.author_name||[]).join(", ");if(similarity(title,d.title||"")<6||(author&&similarity(author,da)<4))return;
    var exact=isbn&&([].concat(d.isbn||[])).some(function(x){return cleanISBN(x)===isbn});
    if(d.cover_i)add("https://covers.openlibrary.org/b/id/"+d.cover_i+"-L.jpg?default=false","Open Library title + author",exact,exact?"Exact ISBN":"Same-work candidate")
   })
  }
 }catch(e){console.warn("Open Library cover candidates skipped",e)}
 // Validate candidates before showing them. Keep the list intentionally small on mobile.
 var tested=await Promise.all(all.slice(0,12).map(async function(c){c.ok=await imageLoads(c.url);return c}));
 return tested.filter(function(c){return c.ok}).slice(0,8)
}
function customCoverControlsHTML(){
 return '<div class="own-cover-rescue"><div class="eyebrow">📷 Your physical copy</div><h4>Still not seeing the right edition?</h4><p class="tiny muted">Choose or take a photo of your own cover. Nothing changes until you confirm it.</p><input type="file" id="ownCoverFile" accept="image/*" class="own-cover-file"><button type="button" class="pill" id="ownCoverBtn">📷 Use My Own Cover</button><div id="ownCoverPreview"></div></div>'
}
function compressCoverPhoto(file){
 return new Promise(function(resolve,reject){
  if(!file||!String(file.type||"").startsWith("image/")){reject(Error("Choose an image file."));return}
  var reader=new FileReader();
  reader.onerror=function(){reject(Error("Could not read that image."))};
  reader.onload=function(){
   var img=new Image();
   img.onerror=function(){reject(Error("Could not open that image."))};
   img.onload=function(){
    try{
     var maxW=720,maxH=1080,scale=Math.min(1,maxW/img.naturalWidth,maxH/img.naturalHeight),w=Math.max(1,Math.round(img.naturalWidth*scale)),h=Math.max(1,Math.round(img.naturalHeight*scale));
     var canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
     var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0,w,h);
     resolve(canvas.toDataURL("image/jpeg",0.76))
    }catch(e){reject(e)}
   };
   img.src=reader.result
  };
  reader.readAsDataURL(file)
 })
}
function saveUserCoverPhoto(book,dataUrl,panel){
 var before=JSON.parse(JSON.stringify(book));
 book.cover=dataUrl;book.coverSource="User photo of physical copy";book.updatedAt=now();
 function stripCover(x){var y=JSON.parse(JSON.stringify(x));delete y.cover;delete y.coverSource;delete y.updatedAt;return y}
 if(JSON.stringify(stripCover(before))!==JSON.stringify(stripCover(book))){Object.keys(book).forEach(function(k){delete book[k]});Object.assign(book,before);alert("Cover change was rolled back because another field changed unexpectedly.");return}
 try{save()}catch(e){Object.keys(book).forEach(function(k){delete book[k]});Object.assign(book,before);alert("That photo was too large to save safely. Nothing was changed.");return}
 render();
 if(panel)panel.innerHTML='<div class="guardian green"><h3>✅ Your cover photo is saved</h3><div class="muted">Only the cover changed. Your physical-copy photo is now the cover for this cataloged copy.</div></div>'
}
function wireOwnCoverRescue(book,panel){
 var input=panel&&panel.querySelector("#ownCoverFile"),btn=panel&&panel.querySelector("#ownCoverBtn"),preview=panel&&panel.querySelector("#ownCoverPreview");
 if(!input||!btn)return;
 btn.onclick=function(){input.click()};
 input.onchange=async function(){
  var file=input.files&&input.files[0];if(!file)return;
  btn.disabled=true;btn.textContent="📷 Preparing photo...";
  try{
   var dataUrl=await compressCoverPhoto(file);
   preview.innerHTML='<div class="own-cover-confirm"><img src="'+dataUrl+'" alt="Your cover photo preview"><div><b>Use this as your copy\'s cover?</b><p class="tiny muted">This photo is stored with this book and can be included in your backup/cloud sync.</p><button type="button" class="primary" id="confirmOwnCover">Use This Photo</button><button type="button" class="pill" id="cancelOwnCover">Choose Another</button></div></div>';
   preview.querySelector("#confirmOwnCover").onclick=function(){saveUserCoverPhoto(book,dataUrl,panel)};
   preview.querySelector("#cancelOwnCover").onclick=function(){input.value="";preview.innerHTML="";input.click()}
  }catch(e){console.warn("Own-cover photo failed",e);alert("I couldn't prepare that photo. Nothing was changed.")}
  finally{btn.disabled=false;btn.textContent="📷 Use My Own Cover"}
 }
}
function renderCoverCandidatePicker(book,candidates){
 var panel=el("#coverCandidatePanel");if(!panel)return;
 if(!candidates.length){panel.innerHTML='<div class="cover-picker"><div class="guardian purple"><h3>🕯️ No usable online cover candidates yet</h3><div class="muted">Nothing was changed. Your saved book details are safe.</div></div>'+customCoverControlsHTML()+'</div>';wireOwnCoverRescue(book,panel);return}
 panel.innerHTML='<div class="cover-picker"><div class="eyebrow">✨ Cover Rescue 2.0</div><h3>Which cover matches your copy?</h3><p class="tiny muted">Exact-ISBN matches are labeled. Same-work covers are only suggestions — you choose before anything changes.</p><div class="cover-candidate-grid">'+candidates.map(function(c,i){return '<button type="button" class="cover-candidate" data-cover-i="'+i+'"><img src="'+esc(c.url)+'" alt="Cover candidate"><span><b>'+esc(c.label)+'</b><br>'+esc(c.source)+'</span></button>'}).join("")+'</div><button type="button" class="pill" id="noneCoverMatch">None match</button>'+customCoverControlsHTML()+'</div>';
 panel.querySelectorAll("[data-cover-i]").forEach(function(btn){btn.onclick=function(){
  var c=candidates[+btn.getAttribute("data-cover-i")];if(!c)return;
  if(!c.exact&&!confirm("This looks like the same work, but the source does not confirm your exact ISBN. Use this cover for your copy?"))return;
  var before=JSON.parse(JSON.stringify(book));
  book.cover=c.url;book.coverSource=(c.exact?"Confirmed candidate: ":"User-confirmed work candidate: ")+c.source;book.updatedAt=now();
  function stripCover(x){var y=JSON.parse(JSON.stringify(x));delete y.cover;delete y.coverSource;delete y.updatedAt;return y}
  if(JSON.stringify(stripCover(before))!==JSON.stringify(stripCover(book))){Object.keys(book).forEach(function(k){delete book[k]});Object.assign(book,before);alert("Cover change was rolled back because another field changed unexpectedly.");return}
  save();render();panel.innerHTML='<div class="guardian green"><h3>✅ Cover saved</h3><div class="muted">Only the cover fields changed. '+esc(c.source)+'</div></div>'
 }});
 var none=el("#noneCoverMatch");if(none)none.onclick=function(){panel.innerHTML='<div class="guardian purple"><h3>🕯️ No online cover selected</h3><div class="muted">Nothing was changed. You can reopen Find Missing Cover anytime.</div></div>'};
 wireOwnCoverRescue(book,panel)
}
async function showCoverCandidatesFromEditor(book,button){
 var panel=el("#coverCandidatePanel");if(panel)panel.innerHTML='<div class="syncstatus">✨ Searching exact ISBN + title/author cover candidates...</div>';
 var old=button&&button.textContent;if(button){button.disabled=true;button.textContent="✨ Searching..."}
 try{var cs=await collectEditorCoverCandidates(book);renderCoverCandidatePicker(book,cs)}catch(e){console.warn("Cover candidate search failed",e);if(panel)panel.innerHTML='<div class="guardian red"><h3>Cover search failed safely</h3><div class="muted">Nothing was changed.</div></div>'}finally{if(button){button.disabled=false;button.textContent=old||"✨ Find Missing Cover"}}
}


async function repairMissingCoverFromEditor(book,button){
 if(!book)return;
 // User explicitly requested a cover refresh.
 // Do not trust the existing cover merely because its URL loads:
 // it may be a placeholder or otherwise unusable in the library card.

 var isbn=cleanISBN(book.edition&&book.edition.isbn||"");
 if(!isbn){
  alert("Add this copy's ISBN first, then save the book and try Find Missing Cover again.");
  return
 }
 var oldText=button&&button.textContent;
 if(button){button.disabled=true;button.textContent="✨ Searching..."}
 var before=JSON.parse(JSON.stringify(book));
 try{
  // Force the proven manual-entry enrichment pathway to search again.
  book.cover="";
  book.coverSource="";
  await enrichManualBookCoverOnly(book);
  if(book.cover){
   // Protect every non-cover field.
   function stripCover(x){
    var y=JSON.parse(JSON.stringify(x));
    delete y.cover;delete y.coverSource;delete y.updatedAt;
    return y
   }
   if(JSON.stringify(stripCover(before))!==JSON.stringify(stripCover(book))){
    Object.keys(book).forEach(function(k){delete book[k]});
    Object.assign(book,before);
    alert("Cover repair was rolled back because another book field changed unexpectedly.");
    return
   }
   book.updatedAt=now();
   save();
   render();
   alert("Cover found and saved! Only the cover fields were updated.");
  }else{
   // Restore the saved record before showing suggestions. Candidate search must never leave a failed refresh mutation behind.
   Object.keys(book).forEach(function(k){delete book[k]});
   Object.assign(book,before);
   await showCoverCandidatesFromEditor(book,button);
  }
 }catch(e){
  console.warn("Missing-cover repair failed",e);
  Object.keys(book).forEach(function(k){delete book[k]});
  Object.assign(book,before);
  alert("Cover search failed safely. Nothing was changed.");
 }finally{
  if(button){button.disabled=false;button.textContent=oldText||"✨ Find Missing Cover"}
 }
}



// V4.9 — The Collector's Library: derived Work → Edition → Copy presentation.
// Existing saved book records remain the source of truth; no migration is required.
function sameWork(a,b){return !!(a&&b&&norm(a.title)===norm(b.title)&&norm(a.author||'')===norm(b.author||''))}
function editionKey(b){var e=(b&&b.edition)||{},isbn=cleanISBN(e.isbn||'');return isbn?('isbn:'+isbn):['meta',norm(e.name||''),norm(e.format||''),norm(e.publisher||''),String(e.publicationDate||'')].join('|')}
function workCopiesFor(b){return visible().filter(function(x){return sameWork(x,b)&&x.owned===true})}
function editionGroupsFor(b){var groups={};workCopiesFor(b).forEach(function(x){var k=editionKey(x);if(!groups[k])groups[k]=[];groups[k].push(x)});return Object.keys(groups).map(function(k){return groups[k]})}
function collectorCover(b){return '<div class="collector-cover">'+(b&&b.cover?'<img src="'+esc(b.cover)+'" alt="">':'<div class="collector-cover-empty">☾<br><span>'+esc(b&&b.title||'Book')+'</span></div>')+'</div>'}
function collectorChips(items){return uniqText(items||[]).map(function(x){return '<span class="tag">'+esc(x)+'</span>'}).join('')}
function collectorEditionMeta(b){var e=(b&&b.edition)||{},a=[];if(e.format)a.push(e.format);if(e.publisher)a.push(e.publisher);if(e.publicationDate)a.push(e.publicationDate);if(e.isbn)a.push('ISBN '+cleanISBN(e.isbn));return a.map(esc).join(' • ')}
function effectiveReadingStatus(b){var x=String((b&&b.status)||"").trim();return x||"no-reading-status"}
function detailStatusLabel(x){var m={'no-reading-status':'No reading status','want-to-read':'Want to Read','currently-reading':'Currently Reading','read':'Read','dnf':'DNF','rereading':'Rereading'};return m[x]||String(x||'No reading status').replace(/-/g,' ')}
function readingStatusField(value){var opts=[['no-reading-status','No reading status'],['want-to-read','Want to Read'],['currently-reading','Currently Reading'],['read','Read'],['dnf','DNF'],['rereading','Rereading']];value=value||'no-reading-status';return '<div class="field"><label>Reading status</label><select name="status">'+opts.map(function(x){return '<option value="'+esc(x[0])+'" '+(x[0]===value?'selected':'')+'>'+esc(x[1])+'</option>'}).join('')+'</select></div>'}
function detailLength(p){p=+p||0;if(!p)return'';return p<=300?'Short read':p<=450?'Medium read':'Long read'}
function detailSpice(n,confidence){if((confidence||'unknown')==='unknown'&&(n===null||n===undefined||+n===0))return '❔ Unknown';n=+n||0;var labels=['Clean','Mild','Steamy','Spicy','Very Spicy','Explicit'];return (n?Array(n).fill('🌶️').join(''):'🌱')+' '+labels[Math.max(0,Math.min(5,n))]}
function detailLatestJournal(b){var a=[].concat(b.readingJournal||[]);if(!a.length)return null;a.sort(function(x,y){return String(y.updatedAt||y.createdAt||y.date||'').localeCompare(String(x.updatedAt||x.createdAt||x.date||''))});return a[0]}
function detailSeriesContext(series,seriesNo){
 if(!series)return'';var cat=getSeries(series),bits=[];if(seriesNo)bits.push('Book '+seriesNo);if(cat&&!cat.deleted&&Array.isArray(cat.books)&&cat.books.length)bits.push((seriesNo?'of ':'Series has ')+cat.books.length+(seriesNo?'':' cataloged books'));else bits.push('Series lineup not confirmed');
 return bits.join(' • ')
}
function openCollectorBook(b){
 if(!b)return;
 repairV426WorkOnlyPlaceholder(b);
 var copies=workCopiesFor(b),groups=editionGroupsFor(b),intel=getWorkIntelligence(b.title,b.author||'')||{},genres=uniqText([].concat(intel.genres||[],b.genres||[])),tags=uniqText([].concat(intel.tags||[],b.tags||[])),series=intel.series||b.series||'',seriesNo=intel.seriesNo||b.seriesNo||'',e=b.edition||{},wm=b.workMetadata||{},latest=detailLatestJournal(b);
 var collectorCallout=e.name||((e.special||[])[0])||'',pages=+(e.pages||wm.pages)||0,readingStatus=effectiveReadingStatus(b),status=detailStatusLabel(readingStatus),seriesContext=detailSeriesContext(series,seriesNo);
 var action=readingStatus==='currently-reading'?'🕯️ Log Reading':readingStatus==='read'?'↻ Start a Reread':readingStatus==='rereading'?'🕯️ Log Reading':readingStatus==='want-to-read'?'📖 Start Reading':'📖 Add to TBR';
 var rating=b.rating?stars(b.rating)+' '+b.rating+'/5':'Not rated';
 var html='<div class="book-detail-v424">'+
 '<section class="detail-hero"><button class="detail-cover-button" id="detailCoverSpotlight" aria-label="Enlarge cover">'+collectorCover(b)+'<span>Tap cover to enlarge</span></button>'+
 '<div class="detail-hero-copy"><div class="eyebrow">📕 V4.24 • BOOK DETAIL</div><div class="detail-kickers">'+(b.owned?'<span class="detail-owned">✓ In My Library</span>':'')+(b.wantOwn?'<span class="detail-edition">✨ Want to Own</span>':'')+(collectorCallout?'<span class="detail-edition">✨ '+esc(collectorCallout)+'</span>':'')+'</div>'+
 '<h1 class="title collector-title">'+esc(b.title)+'</h1><div class="collector-author">'+esc(b.author||'Unknown author')+'</div>'+
 (series?'<div class="detail-series"><b>'+esc(series)+(seriesNo?' #'+esc(seriesNo):'')+'</b><span>'+esc(seriesContext)+'</span></div>':'')+
 '<div class="detail-hero-status"><span class="detail-status status-'+esc(readingStatus)+'">'+esc(status)+'</span><span class="detail-rating">'+rating+'</span></div>'+
 '<div class="detail-actions"><button class="primary" id="detailReadingAction">'+action+'</button><button class="pill" id="detailFavorite">'+(b.favorite?'★ Favorite':'☆ Favorite')+'</button><button class="pill" id="detailEdit">✏️ Edit Book</button></div></div></section>'+
 '<section class="detail-glance"><div class="detail-section-head"><div><div class="eyebrow">🧙 BOOK AT A GLANCE</div><h2>The important bits</h2></div></div><div class="detail-glance-grid">'+
 '<div><span>Genres</span><b class="detail-genre-chips">'+(genres.length?collectorChips(genres):'<em>Not set</em>')+'</b></div>'+
 '<div><span>Spice</span><b>'+detailSpice(b.spice,b.spiceConfidence)+'</b></div>'+
 '<div><span>Length</span><b>'+(pages?pages+' pages'+(detailLength(pages)?' • '+detailLength(pages):''):'Unknown')+'</b></div>'+
 '<div><span>Format</span><b>'+esc(e.format||wm.format||'Unknown')+'</b></div>'+
 '<div><span>Status</span><b>'+esc(status)+'</b></div><div><span>Rating</span><b>'+rating+'</b></div></div></section>'+
 (latest&&(latest.reaction||latest.mood||latest.date)?'<section class="detail-memory"><div class="eyebrow">💬 LATEST READING MEMORY</div>'+(latest.reaction?'<blockquote>'+esc(latest.reaction)+'</blockquote>':'')+'<div class="muted">'+esc([latest.date,latest.mood].filter(Boolean).join(' • '))+'</div></section>':'')+
 (b.edition?'<div class="collector-section-head detail-editions-head"><div><div class="collector-layer">💎 EDITIONS</div><h2>Your editions</h2></div><button class="pill" id="collectorAddEdition">＋ Add another edition</button></div><div class="collector-editions">':'<section class="detail-memory"><div class="eyebrow">📖 WORK SAVED</div><h3>No physical copy yet</h3><p class="muted">This story is saved in your Bookshop, but it is not marked as owned. No edition or physical copy has been created.</p></section>');
 if(b.edition)groups.forEach(function(g,gi){var x=g[0],xe=x.edition||{};html+='<section class="collector-edition"><div class="collector-edition-head"><div><div class="eyebrow">EDITION '+(gi+1)+'</div><h3>'+esc(xe.name||xe.format||'Edition')+'</h3><div class="muted">'+collectorEditionMeta(x)+'</div></div>'+(xe.isbn?'<span class="collector-isbn">'+esc(cleanISBN(xe.isbn))+'</span>':'')+'</div>'+(Array.isArray(xe.special)&&xe.special.length?'<div class="collector-features">'+collectorChips(xe.special)+'</div>':'')+'<div class="collector-copies">';
 g.forEach(function(c,ci){var ce=c.edition||{};html+='<article class="collector-copy" data-copy-id="'+esc(c.id)+'">'+collectorCover(c)+'<div class="collector-copy-info"><div class="collector-layer">📚 MY COPY'+(g.length>1?' #'+(ci+1):'')+'</div><b>'+esc(ce.printing||'Physical copy')+'</b>'+(c.copyConnections&&c.copyConnections.length?'<div class="collector-memory connection-memory-list">'+connectionDisplay(c.copyConnections).map(function(x){return '<span>'+esc(x)+'</span>'}).join('')+'</div>':'')+'<div class="tiny">'+esc(c.coverSource||'')+'</div></div><div class="collector-copy-actions"><button class="pill collectorEdit" data-copy-id="'+esc(c.id)+'">Edit copy</button><button class="pill collectorDuplicate" data-copy-id="'+esc(c.id)+'">＋ Another copy</button></div></article>'});
 html+='</div></section>'});
 if(b.edition)html+='</div><div class="tiny collector-safety">V4.24 changes presentation and quick actions only. Your Work → Edition → Copy data model remains the source of truth.</div>';html+='</div>';
 el('#modalBody').innerHTML=html;el('#modal').classList.remove('hidden');

 var edit=el('#detailEdit');if(edit)edit.onclick=function(){openBook(b)};
 var fav=el('#detailFavorite');if(fav)fav.onclick=function(){b.favorite=!b.favorite;b.updatedAt=now();save();autoSyncMaybe();openCollectorBook(b)};
 var read=el('#detailReadingAction');if(read)read.onclick=function(){
   var rs=effectiveReadingStatus(b);
   if(rs==='currently-reading'||rs==='rereading'){openReadingSession(b);return}
   if(rs==='no-reading-status'){b.status='want-to-read';b.updatedAt=now();save();autoSyncMaybe();openCollectorBook(b);return}
   b.status=(rs==='read'?'rereading':'currently-reading');b.updatedAt=now();save();autoSyncMaybe();openCollectorBook(b)
 };
 var spot=el('#detailCoverSpotlight');if(spot&&b.cover)spot.onclick=function(){
   var o=document.createElement('div');o.className='detail-cover-lightbox';o.innerHTML='<button aria-label="Close enlarged cover">×</button><img src="'+esc(b.cover)+'" alt="'+esc(b.title)+' cover">';
   document.body.appendChild(o);o.onclick=function(ev){if(ev.target===o||ev.target.tagName==='BUTTON')o.remove()}
 };
 document.querySelectorAll('.collectorEdit').forEach(function(btn){btn.onclick=function(ev){ev.stopPropagation();var id=btn.getAttribute('data-copy-id'),x=visible().find(function(z){return z.id===id});if(x)openBook(x)}});
 document.querySelectorAll('.collectorDuplicate').forEach(function(btn){btn.onclick=function(ev){ev.stopPropagation();var id=btn.getAttribute('data-copy-id'),x=visible().find(function(z){return z.id===id});if(!x)return;var n=JSON.parse(JSON.stringify(x));n.id='';n.workId=x.workId||uid();n.notes='';n.copyConnections=[];n.updatedAt=now();openBook(n)}});
 var add=el('#collectorAddEdition');if(add)add.onclick=function(){openBook({id:'',workId:b.workId||uid(),title:b.title,author:b.author,genres:(b.genres||[]).slice(),tags:(b.tags||[]).slice(),series:b.series||'',seriesNo:b.seriesNo||'',status:effectiveReadingStatus(b),owned:true,wantOwn:false,rating:b.rating||0,favorite:false,spice:b.spice||0,cover:'',edition:{isbn:'',name:'',format:'Hardcover',publisher:'',publicationDate:'',pages:'',printing:'',special:[]},copyConnections:[],notes:''})};
}
function openBook(b){
 b=b||{id:"",workId:"",title:"",author:"",genres:[],tags:[],series:"",seriesNo:"",status:"no-reading-status",owned:true,wantOwn:false,rating:0,favorite:false,spice:0,edition:{isbn:"",name:"",format:"Paperback",publisher:"",publicationDate:"",pages:"",printing:"",special:[]},notes:""};var e=b.edition||{};
 el("#modalBody").innerHTML='<div class="eyebrow">'+(b.id?"Edit copy":"Add to collection")+'</div><h1 class="title">'+(b.id?"Edit Book":"A New Book")+'</h1><form id="bookForm"><div class="form">'+
 field("Title","title",b.title,true)+field("Author","author",b.author)+genreField(b.genres||[])+field("Tropes / Tags","tags",(b.tags||[]).join(", "))+(b.intelligence?'<div class="field full"><div class="guardian purple"><div class="eyebrow">✨ Book Intelligence</div><div class="muted">Genre: <b>'+esc((b.genres||[]).join(", ")||"Uncertain")+'</b><br>Series: <b>'+esc((b.series||"")+(b.seriesNo?" #"+b.seriesNo:"")||"Uncertain")+'</b>'+(b.seriesSuggested?' <span class="tiny">• possible — confirm below</span>':'')+'<br>Spice: <b>'+((b.spiceConfidence||"unknown")=="unknown"?"Unknown":esc(String(b.spice||0))+"/5")+'</b> • '+esc(b.spiceConfidence||"unknown")+(b.seriesDiagnostics?'<br>Series search: '+esc(String(b.seriesDiagnostics.matchedEditions||0))+' matching editions • '+esc(String(b.seriesDiagnostics.claims||0))+' usable series claims'+(b.seriesDiagnostics.openLibraryClaims?' • Open Library '+esc(String(b.seriesDiagnostics.openLibraryClaims))+' claim(s)':'')+(b.seriesDiagnostics.googleClaims?' • Google '+esc(String(b.seriesDiagnostics.googleClaims))+' claim(s)':'')+(b.seriesDiagnostics.cacheHits?' • cache hits '+esc(String(b.seriesDiagnostics.cacheHits)):'')+(b.seriesDiagnostics.rateLimited?' • Google rate-limited':''):'')+(b.workBrain?'<br>Work Brain: <b>Using your confirmed work-level knowledge</b>':'')+'<br>Source: '+esc(b.intelligenceSource||"Public metadata")+'</div></div></div>':'')+field("Series","series",b.series)+field("Series number","seriesNo",b.seriesNo)+
 readingStatusField(effectiveReadingStatus(b))+selectField("Rating","rating",["0","1","2","3","4","5"],String(b.rating||0))+selectField((b.spiceSuggested&&!b.spiceConfirmed?"Suggested spice":"Spice"),"spice",["0","1","2","3","4","5"],String(b.spice||0))+field("Finished date","finishedDate",b.finishedDate||"")+checkbox("readDateUnknown","🕰️ Read before tracking / date unknown",!!b.readDateUnknown)+
 field("ISBN","isbn",e.isbn)+field("Edition","editionName",e.name||"")+selectField("Format","format",["Paperback","Hardcover","Box Set","Ebook","Audiobook","Other"],e.format||"Paperback")+field("Publisher","publisher",e.publisher)+field("Publication date","publicationDate",e.publicationDate)+field("Page count","pages",e.pages)+field("Printing","printing",e.printing)+field("Special features","special",(e.special||[]).join(", "),"",true)+
 copyConnectionsField(b.copyConnections||[])+'<div class="field full"><label>Notes</label><textarea name="notes">'+esc(b.notes||"")+'</textarea></div>'+checkbox("owned","I own this physical copy",b.owned)+checkbox("wantOwn","I want to own this",b.wantOwn)+checkbox("favorite","Favorite",b.favorite)+'</div><div class="actions">'+(b.id?'<button type="button" class="danger" id="deleteBtn">Delete</button>':'')+'<button class="primary" type="submit">'+(b.id?"Save changes":"Add to bookshop")+'</button><button type="button" class="pill" id="repairMissingCover" style="display:none">✨ Find Missing Cover</button></div><div id="coverCandidatePanel"></div></form>';
 el("#modal").classList.remove("hidden");
 
var repairBtn=el("#repairMissingCover");
if(repairBtn){
 repairBtn.style.display=(b.id&&cleanISBN(b.edition&&b.edition.isbn||""))?"inline-flex":"none";
 repairBtn.onclick=async function(){
  // Pull the currently typed ISBN into the in-memory editor copy before repair.
  var form=el("#bookForm"),isbnField=form&&form.elements["isbn"];
  if(isbnField){
   b.edition=b.edition||{};
   b.edition.isbn=cleanISBN(isbnField.value)
  }
  await repairMissingCoverFromEditor(b,repairBtn)
 }
}

el("#bookForm").onsubmit=async function(ev){ev.preventDefault();var f=new FormData(ev.target),n={id:b.id||uid(),workId:b.workId||uid(),title:f.get("title"),author:f.get("author"),cover:b.cover||"",coverSource:b.coverSource||"",genres:(function(){var gs=f.getAll("genres").map(function(x){return String(x).trim()}).filter(Boolean),c=String(f.get("customGenre")||"").trim();if(c&&gs.indexOf(c)<0)gs.push(c);return gs})(),tags:String(f.get("tags")||"").split(",").map(function(x){return x.trim()}).filter(Boolean),series:f.get("series"),seriesNo:f.get("seriesNo"),status:f.get("status"),rating:+f.get("rating"),spice:+f.get("spice"),spiceSuggested:!!b.spiceSuggested,spiceConfirmed:!!b.spiceConfirmed,spiceConfidence:b.spiceConfidence||"",intelligence:!!b.intelligence,intelligenceSource:b.intelligenceSource||"",seriesSuggested:false,seriesConfidence:b.seriesConfidence||"",readDateUnknown:f.has("readDateUnknown"),finishedDate:(f.has("readDateUnknown")?"":(f.get("finishedDate")||((f.get("status")==="read"&&b.status!=="read")?dateOnly():(b.finishedDate||"")))),owned:f.has("owned"),wantOwn:f.has("wantOwn"),favorite:f.has("favorite"),copyConnections:buildCopyConnections(f),readingJournal:[].concat(b.readingJournal||[]),readingProgress:Object.assign({},b.readingProgress||{}),notes:f.get("notes"),edition:{isbn:f.get("isbn"),name:f.get("editionName"),format:f.get("format"),publisher:f.get("publisher"),publicationDate:f.get("publicationDate"),pages:f.get("pages"),printing:f.get("printing"),special:String(f.get("special")||"").split(",").map(function(x){return x.trim()}).filter(Boolean)},updatedAt:now(),deleted:false};await enrichManualBookCoverOnly(n);var ix=state.books.findIndex(function(x){return x.id===n.id});if(ix>=0)state.books[ix]=n;else state.books.push(n);learnWorkIntelligence(n);save();closeModal();render();autoSyncMaybe()};
 if(b.id)el("#deleteBtn").onclick=function(){if(confirm("Remove this copy from your bookshop?")){var x=state.books.find(function(x){return x.id===b.id});x.deleted=true;x.updatedAt=now();save();closeModal();render();autoSyncMaybe()}}
}

/* V4.26 — Library Intelligence 2.0: Work Search / no-ISBN intake */
function workSearchKey(x){return norm((x&&x.title)||"")+"|"+norm((x&&x.author)||"")}
function normalizeWorkSearchResult(x){
 x=x||{};return{title:String(x.title||"").trim(),author:String(x.author||"").trim(),cover:x.cover||"",genres:uniqText(x.genres||[]),description:x.description||"",series:x.series||"",seriesNo:x.seriesNo||"",source:x.source||"Public book metadata",edition:{isbn:"",name:"",format:"",publisher:x.publisher||"",publicationDate:x.publicationDate||"",pages:x.pages||"",printing:"",special:[]}}
}
async function searchWorksNoISBN(query){
 query=String(query||"").trim();if(!query)return[];
 var out=[],seen={};
 function add(x){x=normalizeWorkSearchResult(x);if(!x.title)return;var k=workSearchKey(x);if(!k||seen[k])return;seen[k]=1;out.push(x)}
 async function googleRaw(q){
  try{
   var gr=await cachedFetchJSON("https://www.googleapis.com/books/v1/volumes?q="+encodeURIComponent(q)+"&maxResults=12");
   if(gr.ok)((gr.data&&gr.data.items)||[]).forEach(function(it){var v=it.volumeInfo||{},ser=inferSeries(v.title||"",v.description||"");add({title:v.title||"",author:(v.authors||[]).join(", "),cover:(v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||"",genres:v.categories||[],description:v.description||"",series:ser.series,seriesNo:ser.seriesNo,publisher:v.publisher||"",publicationDate:v.publishedDate||"",pages:v.pageCount||"",source:"Google Books"})})
  }catch(e){}
 }
 async function openlibRaw(q){
  try{
   var or=await cachedFetchJSON("https://openlibrary.org/search.json?q="+encodeURIComponent(q)+"&limit=12&fields=key,title,author_name,cover_i,first_publish_year,number_of_pages_median,subject,series");
   if(or.ok)((or.data&&or.data.docs)||[]).forEach(function(d){var rawSeries=Array.isArray(d.series)?String(d.series[0]||""):String(d.series||""),ser={series:"",seriesNo:""};if(rawSeries){var sm=rawSeries.match(/^(.*?)(?:\s*(?:#|book\s*)?(\d+(?:\.\d+)?))?$/);if(sm){ser.series=cleanSeriesName(sm[1]);ser.seriesNo=sm[2]||""}}add({title:d.title||"",author:(d.author_name||[]).join(", "),cover:d.cover_i?("https://covers.openlibrary.org/b/id/"+d.cover_i+"-L.jpg?default=false"):"",genres:(d.subject||[]).slice(0,8),series:ser.series,seriesNo:ser.seriesNo,publicationDate:d.first_publish_year||"",pages:d.number_of_pages_median||"",source:"Open Library"})})
  }catch(e){}
 }
 async function openlibTitleAuthor(title,author){
  try{
   var url="https://openlibrary.org/search.json?title="+encodeURIComponent(title)+(author?"&author="+encodeURIComponent(author):"")+"&limit=12&fields=key,title,author_name,cover_i,first_publish_year,number_of_pages_median,subject,series";
   var or=await cachedFetchJSON(url);
   if(or.ok)((or.data&&or.data.docs)||[]).forEach(function(d){var rawSeries=Array.isArray(d.series)?String(d.series[0]||""):String(d.series||""),ser={series:"",seriesNo:""};if(rawSeries){var sm=rawSeries.match(/^(.*?)(?:\s*(?:#|book\s*)?(\d+(?:\.\d+)?))?$/);if(sm){ser.series=cleanSeriesName(sm[1]);ser.seriesNo=sm[2]||""}}add({title:d.title||"",author:(d.author_name||[]).join(", "),cover:d.cover_i?("https://covers.openlibrary.org/b/id/"+d.cover_i+"-L.jpg?default=false"):"",genres:(d.subject||[]).slice(0,8),series:ser.series,seriesNo:ser.seriesNo,publicationDate:d.first_publish_year||"",pages:d.number_of_pages_median||"",source:"Open Library"})})
  }catch(e){}
 }
 function splitCandidates(q){
  var toks=String(q||"").trim().split(/\s+/).filter(Boolean),arr=[];
  function push(title,author){
   title=String(title||"").trim();author=String(author||"").trim();
   if(!title||!author)return;
   var k=norm(title)+"|"+norm(author);
   if(!arr.some(function(x){return x.k===k}))arr.push({k:k,title:title,author:author})
  }
  if(toks.length>=4)push(toks.slice(0,-2).join(" "),toks.slice(-2).join(" "));
  if(toks.length>=3)push(toks.slice(0,-1).join(" "),toks.slice(-1).join(" "));
  for(var i=2;i<=toks.length-2;i++)push(toks.slice(0,i).join(" "),toks.slice(i).join(" "));
  return arr.slice(0,8)
 }
 function score(x){
  var qt=norm(query),title=norm(x.title||""),author=norm(x.author||""),sc=0;
  if(title&&qt.indexOf(title)>=0)sc+=70;
  title.split(" ").forEach(function(t){if(t.length>2&&qt.indexOf(t)>=0)sc+=6});
  author.split(" ").forEach(function(t){if(t.length>2&&qt.indexOf(t)>=0)sc+=8});
  if(x.cover)sc+=2;
  return sc
 }

 await Promise.all([googleRaw(query),openlibRaw(query)]);

 if(!out.length){
  var splits=splitCandidates(query);
  for(var i=0;i<splits.length&&!out.length;i++){
   var p=splits[i];
   await Promise.all([
    googleRaw('intitle:"'+p.title+'" inauthor:"'+p.author+'"'),
    openlibTitleAuthor(p.title,p.author)
   ])
  }
 }

 if(!out.length){
  var best=splitCandidates(query)[0];
  if(best){
   await Promise.all([
    googleRaw('intitle:"'+best.title+'"'),
    openlibTitleAuthor(best.title,"")
   ])
  }
 }

 out.sort(function(a,b){return score(b)-score(a)});
 return out.slice(0,16)
}
function findExistingWork(f){
 var k=workSearchKey(f),exact=visible().find(function(b){return workSearchKey(b)===k});
 if(exact)return exact;
 return visible().find(function(b){return norm(b.title)===norm(f.title)&&(!f.author||!b.author||norm(b.author)===norm(f.author))})||null
}

function repairV426WorkOnlyPlaceholder(b){
 if(!b||b.owned===true||!b.edition)return false;
 var e=b.edition||{};
 var publicDiscovery=b.intelligence===true&&(b.intelligenceSource==="Google Books"||b.intelligenceSource==="Open Library"||b.intelligenceSource==="Public book metadata");
 if(publicDiscovery){
  b.workMetadata=Object.assign({},b.workMetadata||{},{
   publisher:(b.workMetadata&&b.workMetadata.publisher)||e.publisher||"",
   publicationDate:(b.workMetadata&&b.workMetadata.publicationDate)||e.publicationDate||"",
   pages:(b.workMetadata&&b.workMetadata.pages)||e.pages||"",
   format:(b.workMetadata&&b.workMetadata.format)||e.format||"",
   editionName:(b.workMetadata&&b.workMetadata.editionName)||e.name||""
  });
  b.edition=null;b.updatedAt=now();save();return true
 }
 return false
}

function saveDiscoveredWork(f,mode){
 var existing=findExistingWork(f),n,intel=intelligenceFor(f);
 if(existing){
  n=existing;
  if(mode==="read"||mode==="both")n.status="want-to-read";
  else if(!String(n.status||"").trim())n.status="no-reading-status";
  if(mode==="own"||mode==="both")n.wantOwn=true;
  n.updatedAt=now();
 }else{
  n={id:uid(),workId:uid(),title:f.title||"",author:f.author||"",cover:f.cover||"",coverSource:f.cover?(f.source||"Public metadata"):"",genres:uniqText((intel&&intel.genres)||f.genres||[]),tags:uniqText((intel&&intel.tags)||[]),series:(intel&&intel.series)||f.series||"",seriesNo:(intel&&intel.seriesNo)||f.seriesNo||"",status:(mode==="read"||mode==="both")?"want-to-read":"no-reading-status",owned:false,wantOwn:(mode==="own"||mode==="both"),rating:0,favorite:false,spice:(intel&&intel.spice!=null)?+intel.spice:null,spiceConfidence:(intel&&intel.spiceConfidence)||"unknown",intelligence:true,intelligenceSource:(intel&&intel.source)||f.source||"Public book metadata",readDateUnknown:false,finishedDate:"",copyConnections:[],readingJournal:[],readingProgress:{},notes:"",edition:null,workMetadata:{publisher:(f.edition&&f.edition.publisher)||"",publicationDate:(f.edition&&f.edition.publicationDate)||"",pages:(f.edition&&f.edition.pages)||""},updatedAt:now(),deleted:false};
  state.books.push(n)
 }
 learnWorkIntelligence(n);save();autoSyncMaybe();return n
}
function renderWorkSearchResults(items){
 var box=el("#workSearchResults");if(!box)return;
 if(!items.length){box.innerHTML='<div class="empty">No confident matches yet. Try <b>title + author</b>, or use Manual Add.</div>';return}
 box.innerHTML='<div class="work-search-list">'+items.map(function(f,i){var existing=findExistingWork(f);return '<article class="work-search-card">'+(f.cover?'<img src="'+esc(f.cover)+'" alt="">':'<div class="work-search-cover">📕</div>')+'<div class="work-search-copy"><div class="eyebrow">'+esc(f.source||"Book search")+(existing?' • ✨ already in your Bookshop':'')+'</div><h3>'+esc(f.title)+'</h3><p>'+esc(f.author||"Unknown author")+'</p>'+(f.series?'<small>📚 '+esc(f.series)+(f.seriesNo?' #'+esc(f.seriesNo):'')+'</small>':'')+'<div class="work-search-actions"><button class="pill" data-work-save="'+i+'" data-mode="read">📖 Want to Read</button><button class="pill" data-work-save="'+i+'" data-mode="own">✨ Want to Own</button><button class="primary" data-work-save="'+i+'" data-mode="both">📖✨ Both</button></div></div></article>'}).join("")+'</div>';
 Array.prototype.forEach.call(box.querySelectorAll("[data-work-save]"),function(btn){btn.onclick=function(){var f=items[Number(btn.getAttribute("data-work-save"))],mode=btn.getAttribute("data-mode"),n=saveDiscoveredWork(f,mode);var labels={read:"Want to Read",own:"Want to Own",both:"Want to Read + Want to Own"};box.innerHTML='<div class="guardian purple"><div class="eyebrow">✨ SAVED TO YOUR BOOKSHOP</div><h3>'+esc(n.title)+'</h3><p class="muted">'+esc(labels[mode])+' • No ISBN required.</p><div class="actions"><button class="primary" id="searchAnotherWork">🔎 Search another</button><button class="pill" id="openSavedWork">📕 View book</button></div></div>';el("#searchAnotherWork").onclick=openBookshopIntake;el("#openSavedWork").onclick=function(){closeModal();openCollectorBook(n)}}})
}
function openBookshopIntake(){
 stopScanner();
 el("#modalBody").innerHTML='<div class="eyebrow">🧠 V4.27.6 • LIBRARY INTELLIGENCE 2.0</div><h1 class="title">Add to your Bookshop</h1><p class="sub">Heard about a book? Search by title or author. You do <b>not</b> need an ISBN just to save a story.</p><div class="field full"><label>Book title or author</label><div class="lookuprow"><input id="workSearchInput" placeholder="e.g. Fourth Wing Rebecca Yarros"><button class="primary" id="workSearchBtn">🔎 Search</button></div></div><div class="intake-shortcuts"><button class="pill" id="intakeManual">✍️ Manual Add</button><button class="pill" id="intakeScan">📷 Scan / ISBN</button></div><div id="workSearchResults"><div class="guardian purple"><b>Choose what the book means to you:</b><div class="muted">📖 Want to Read = TBR<br>✨ Want to Own = physical wishlist<br>📖✨ Both = both lists</div></div></div>';
 el("#modal").classList.remove("hidden");
 async function run(){var q=el("#workSearchInput").value.trim(),box=el("#workSearchResults");if(!q)return;box.innerHTML='<div class="empty">🔮 Searching the shelves…</div>';var items=await searchWorksNoISBN(q);renderWorkSearchResults(items)}
 el("#workSearchBtn").onclick=run;el("#workSearchInput").onkeydown=function(e){if(e.key==="Enter")run()};
 el("#intakeManual").onclick=function(){openBook()};
 el("#intakeScan").onclick=openGuardian
}

var scannerStream=null,scannerTimer=null,detector=null,busy=false;
function openGuardian(){
 stopScanner();el("#modalBody").innerHTML='<div class="eyebrow">V4.15.2 • Reading Journal 2.0</div><h1 class="title">Scan a book</h1><p class="sub">Use the camera barcode reader on supported browsers, or enter the ISBN manually.</p><div class="camera" id="cameraBox"><div class="muted">📷 Camera is off.</div></div><div class="toolbar"><button class="primary" id="startCam">📷 Start Camera</button><button class="pill hidden" id="stopCam">Stop</button></div><div class="field full"><label>ISBN</label><div class="lookuprow"><input id="isbnInput" inputmode="numeric" placeholder="9780062059932"><button class="primary" id="lookupBtn">Identify</button></div></div><div id="guardianResult"></div>';
 el("#modal").classList.remove("hidden");el("#startCam").onclick=startScanner;el("#stopCam").onclick=stopScanner;el("#lookupBtn").onclick=lookupISBN;el("#isbnInput").onkeydown=function(e){if(e.key==="Enter")lookupISBN()}
}
async function startScanner(){
 var r=el("#guardianResult");if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){r.innerHTML='<div class="guardian purple"><h3>Camera unavailable here</h3><div class="muted">Install/open the hosted PWA over HTTPS. Manual ISBN still works.</div></div>';return}
 if(!("BarcodeDetector" in window)){r.innerHTML='<div class="guardian purple"><h3>Barcode detection unavailable</h3><div class="muted">This browser does not expose automatic barcode detection. Manual ISBN still works.</div></div>';return}
 try{var f=await BarcodeDetector.getSupportedFormats();var wanted=["ean_13","ean_8","upc_a","upc_e"].filter(function(x){return f.indexOf(x)>=0});detector=new BarcodeDetector({formats:wanted.length?wanted:f});scannerStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});el("#cameraBox").innerHTML='<video id="scanVideo" playsinline autoplay muted></video><div class="guide"></div>';var v=el("#scanVideo");v.srcObject=scannerStream;await v.play();el("#startCam").classList.add("hidden");el("#stopCam").classList.remove("hidden");scannerTimer=setInterval(scanFrame,350)}catch(e){r.innerHTML='<div class="guardian red"><h3>Camera could not start</h3><div class="muted">'+esc(e.message||"Check permission.")+'</div></div>'}
}
async function scanFrame(){if(busy||!detector||!el("#scanVideo"))return;var v=el("#scanVideo");if(v.readyState<2)return;busy=true;try{var cs=await detector.detect(v);for(var i=0;i<cs.length;i++){var raw=cleanISBN(cs[i].rawValue);if((raw.length===13&&(raw.indexOf("978")===0||raw.indexOf("979")===0))||raw.length===10){el("#isbnInput").value=raw;stopScanner();if(navigator.vibrate)navigator.vibrate(100);lookupISBN();break}}}catch(e){}busy=false}
function stopScanner(){if(scannerTimer){clearInterval(scannerTimer);scannerTimer=null}if(scannerStream){scannerStream.getTracks().forEach(function(t){t.stop()});scannerStream=null}detector=null;busy=false;var b=el("#cameraBox");if(b)b.innerHTML='<div class="muted">📷 Camera is off.</div>';if(el("#startCam"))el("#startCam").classList.remove("hidden");if(el("#stopCam"))el("#stopCam").classList.add("hidden")}
async function googleLookup(query,isbn){
 var url="https://www.googleapis.com/books/v1/volumes?q="+encodeURIComponent(query)+"&maxResults=10",res=await cachedFetchJSON(url);if(!res.ok)return null;var j=res.data||{},items=j.items||[];if(!items.length)return null;var best=items[0],wanted=cleanISBN(isbn||"");if(wanted){for(var i=0;i<items.length;i++){var ids=(items[i].volumeInfo&&items[i].volumeInfo.industryIdentifiers)||[];if(ids.some(function(z){return cleanISBN(z.identifier)===wanted})){best=items[i];break}}}var v=best.volumeInfo||{},ser=inferSeries(v.title||"",v.description||"");return{title:v.title||"",author:(v.authors||[]).join(", "),genres:v.categories||[],description:v.description||"",cover:(v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||"",series:ser.series,seriesNo:ser.seriesNo,edition:{isbn:wanted,name:"",format:v.printType==="BOOK"?"":"",publisher:v.publisher||"",publicationDate:v.publishedDate||"",pages:v.pageCount||"",printing:"",special:[]}}
}
async function openLibraryISBN(isbn){
 var res=await cachedFetchJSON("https://openlibrary.org/isbn/"+isbn+".json");if(!res.ok)return null;var q=res.data||{},authors=[];if(q.authors&&q.authors.length){for(var i=0;i<q.authors.length;i++){var ar=await cachedFetchJSON("https://openlibrary.org"+q.authors[i].key+".json");if(ar.ok&&ar.data&&ar.data.name)authors.push(ar.data.name)}}var subjects=q.subjects||[],desc=q.description&&((typeof q.description==="string")?q.description:q.description.value)||"",ser=inferSeries(q.title||"",desc),olSeries=Array.isArray(q.series)?String(q.series[0]||""):String(q.series||"");if(olSeries){var sm=olSeries.match(/^(.*?)(?:\s*(?:#|book\s*)?(\d+(?:\.\d+)?))?$/);if(sm&&cleanSeriesName(sm[1])){ser.series=cleanSeriesName(sm[1]);if(sm[2])ser.seriesNo=sm[2]}}return{title:q.title||"",author:authors.join(", "),genres:subjects,description:desc,cover:(q.covers&&q.covers.length)?("https://covers.openlibrary.org/b/id/"+q.covers[0]+"-L.jpg"):"",series:ser.series,seriesNo:ser.seriesNo,workKeys:uniqText((q.works||[]).map(function(w){return w.key||""})),edition:{isbn:isbn,name:"",format:q.physical_format||"",publisher:(q.publishers||[]).join(", "),publicationDate:q.publish_date||"",pages:q.number_of_pages||"",printing:"",special:[]}}
}
function similarity(a,b){a=norm(a);b=norm(b);if(!a||!b)return 0;if(a===b)return 10;if(a.indexOf(b)>=0||b.indexOf(a)>=0)return 7;var aw=a.split(/\s+/),bw=b.split(/\s+/),hit=aw.filter(function(x){return bw.indexOf(x)>=0}).length;return hit/Math.max(aw.length,bw.length)*6}
async function googleWorkItems(title,author){var q='intitle:"'+title+'"'+(author?' inauthor:"'+author+'"':'');var url="https://www.googleapis.com/books/v1/volumes?q="+encodeURIComponent(q)+"&maxResults=20",res=await cachedFetchJSON(url);return{ok:res.ok,status:res.status,items:(res.data&&res.data.items)||[],fromCache:!!res.fromCache}}
async function googleWorkSearch(title,author,isbn){
 var rr=await googleWorkItems(title,author);if(!rr.ok)return null;var items=rr.items||[],best=null,bestScore=-1,claims={};items.forEach(function(it){var v=it.volumeInfo||{},va=(v.authors||[]).join(", "),ts=similarity(title,v.title||""),as=author?similarity(author,va):6,score=ts+as+(v.description?3:0)+(v.categories&&v.categories.length?2:0);if(ts>=6&&as>=4){var blob=[v.title||"",v.subtitle||"",v.description||"",(v.categories||[]).join(" ")].join(" ").replace(/<[^>]+>/g," "),ser=inferSeries(v.title||"",blob);if(ser.series)addSeriesClaim(claims,ser.series,ser.seriesNo,7+(ts>=9?2:0)+(as>=7?1:0),"Google Books work editions",title,author);extractSeriesClaimsFromText(blob,claims,7,"Google Books work editions",title,author)}var direct=inferSeries(v.title||"",v.description||"");if(direct.series)score+=3;if(score>bestScore){bestScore=score;best=v}});if(!best)return null;var ser=inferSeries(best.title||"",best.description||""),bridge=bestSeriesClaim(claims);if(bridge){ser.series=bridge.series;ser.seriesNo=bridge.seriesNo||ser.seriesNo||""}return{title:best.title||title||"",author:(best.authors||[]).join(", "),genres:best.categories||[],description:best.description||"",cover:(best.imageLinks&&(best.imageLinks.thumbnail||best.imageLinks.smallThumbnail))||"",series:ser.series,seriesNo:ser.seriesNo,seriesSuggested:!!bridge,seriesConfidence:bridge?(bridge.confidence||"possible"):"",seriesSource:bridge?(bridge.source||"Google Books work editions"):"",edition:{isbn:isbn,name:"",format:"",publisher:"",publicationDate:"",pages:"",printing:"",special:[]}}
}
async function openLibraryWorkSearch(title,author,isbn){
 var qs="title="+encodeURIComponent(title||"")+(author?"&author="+encodeURIComponent(author):"")+"&limit=12&fields=title,author_name,subject,first_publish_year,cover_i,key,series",res=await cachedFetchJSON("https://openlibrary.org/search.json?"+qs);if(!res.ok)return null;var docs=(res.data&&res.data.docs)||[],d=null,best=-1;docs.forEach(function(x){var sc=similarity(title,x.title||"")+similarity(author,(x.author_name||[]).join(" "))+(x.subject&&x.subject.length?2:0);if(sc>best){best=sc;d=x}});if(!d)return null;var desc="";if(d.key&&/^\/works\//.test(d.key)){var wr=await cachedFetchJSON("https://openlibrary.org"+d.key+".json");if(wr.ok){var w=wr.data||{};desc=w.description&&((typeof w.description==="string")?w.description:w.description.value)||""}}var ser=inferSeries(d.title||title,desc),ds=Array.isArray(d.series)?String(d.series[0]||""):String(d.series||"");if(ds){var sm=ds.match(/^(.*?)(?:\s*(?:#|book\s*)?(\d+(?:\.\d+)?))?$/);if(sm&&cleanSeriesName(sm[1])){ser.series=cleanSeriesName(sm[1]);if(sm[2])ser.seriesNo=sm[2]}}return{title:d.title||title||"",author:(d.author_name||[]).join(", "),genres:d.subject||[],description:desc,cover:d.cover_i?("https://covers.openlibrary.org/b/id/"+d.cover_i+"-L.jpg"):"",series:ser.series,seriesNo:ser.seriesNo,workKeys:d.key?[d.key]:[],edition:{isbn:isbn,name:"",format:"",publisher:"",publicationDate:"",pages:"",printing:"",special:[]}}
}

function validSeriesClaim(series,title,author){
 series=cleanSeriesName(series||"");
 if(!series)return false;
 var n=norm(series);
 if(n===norm(title)||n===norm(author)||n==="series"||n==="book")return false;
 if(n.length<3||n.length>80)return false;
 return true
}
function numberWordToValue(x){
 x=norm(x||"");
 var m={one:"1",first:"1",two:"2",second:"2",three:"3",third:"3",four:"4",fourth:"4",five:"5",fifth:"5",six:"6",sixth:"6",seven:"7",seventh:"7",eight:"8",eighth:"8",nine:"9",ninth:"9",ten:"10",tenth:"10",eleven:"11",eleventh:"11",twelve:"12",twelfth:"12"};
 return m[x]||(/\d+(?:\.\d+)?/.test(x)?(x.match(/\d+(?:\.\d+)?/)||[""])[0]:"")
}
function parseSeriesLabel(raw,title,author){
 raw=String(raw||"").replace(/\s+/g," ").trim();
 if(!raw)return null;
 var m=raw.match(/^(.*?)(?:\s*[-–—,:#(]?\s*(?:book|volume|vol\.?|part)?\s*#?\s*(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s*\)?)\s*$/i);
 var name=cleanSeriesName(m?m[1]:raw),no=m&&m[2]?numberWordToValue(m[2]):"";
 if(!validSeriesClaim(name,title,author))return null;
 return{series:name,seriesNo:no};
}
function extractSeriesClaimsFromText(text,claims,score,source,title,author){
 var t=String(text||"").replace(/<[^>]+>/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ");
 if(!t)return;
 var patterns=[
  {re:/(?:part|book|volume|vol\.?|installment)\s*(?:#|no\.?\s*)?(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:of|in|from)\s+(?:the\s+)?([^.;:()]{3,80}?)(?:\s+series)?(?=[.;:()]|$)/ig,n:1,s:2},
  {re:/(?:the\s+)?([^.;:()]{3,80}?)\s+series[,;:\s–—-]*(?:book|volume|vol\.?|part|installment)?\s*(?:#|no\.?\s*)?(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten)(?=[.;:()]|$)/ig,n:2,s:1},
  {re:/(?:first|1st)\s+(?:full[- ]length\s+)?(?:book|novel|installment|story)\s+(?:in|of|from)\s+(?:the\s+)?([^.;:()]{3,80}?)(?:\s+series)?(?=[.;:()]|$)/ig,n:"1",s:1},
  {re:/(?:the\s+)?(?:first|1st)\s+(?:book|novel|installment|story)\s+(?:in|of|from)\s+(?:the\s+)?([^.;:()]{3,80}?)(?:\s+series)?(?=[.;:()]|$)/ig,n:"1",s:1},
  {re:/(?:book|volume|vol\.?|part|installment)\s+(one|two|three|four|five|six|seven|eight|nine|ten|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+(?:in|of|from)\s+(?:the\s+)?([^.;:()]{3,80}?)(?:\s+series)?(?=[.;:()]|$)/ig,n:1,s:2},
  {re:/(?:the\s+)?([^.;:()]{3,80}?)\s*[,—–:-]\s*(?:book|volume|vol\.?|part)\s*(?:#|no\.?\s*)?(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten)(?=[.;:()]|$)/ig,n:2,s:1},
  {re:/(?:book|volume|vol\.?|part)\s*(?:#|no\.?\s*)?(\d+(?:\.\d+)?|one|two|three|four|five|six|seven|eight|nine|ten)\s*[,—–:-]\s*([^.;:()]{3,80}?)(?:\s+series)?(?=[.;:()]|$)/ig,n:1,s:2},
  {re:/(?:begins|launches|starts|kicks off|opens)\s+(?:the\s+)?([^.;:()]{3,80}?)\s+series/ig,n:"1",s:1}
 ];
 patterns.forEach(function(p){var m;while((m=p.re.exec(t))){var no=(typeof p.n==="string")?p.n:numberWordToValue(m[p.n]),ser=m[p.s];addSeriesClaim(claims,ser,no,score,source,title,author)}});
}
function addSeriesClaim(claims,series,seriesNo,score,source,title,author){
 if(!validSeriesClaim(series,title,author))return;
 var key=norm(cleanSeriesName(series)),c=claims[key]||(claims[key]={series:cleanSeriesName(series),score:0,numbers:{},sources:[]});
 c.score+=score||1;
 if(seriesNo){var no=String(seriesNo);c.numbers[no]=(c.numbers[no]||0)+(score||1)}
 if(source&&c.sources.indexOf(source)<0)c.sources.push(source);
}
function bestSeriesClaim(claims){
 var a=Object.keys(claims).map(function(k){var c=claims[k],bestNo="",bestNoScore=0;Object.keys(c.numbers).forEach(function(n){if(c.numbers[n]>bestNoScore){bestNo=n;bestNoScore=c.numbers[n]}});c.seriesNo=bestNo;c.numberScore=bestNoScore;return c});
 a.sort(function(x,y){return(y.score+(y.seriesNo?2:0))-(x.score+(x.seriesNo?2:0))});
 if(!a.length)return null;
 var top=a[0],second=a[1],margin=top.score-(second?second.score:0);
 if(top.score<7)return null;
 return{series:top.series,seriesNo:top.seriesNo||"",confidence:(top.score>=13&&margin>=3?"strong":"possible"),source:top.sources.join(" + ")||"Series Brain bridge",score:top.score};
}
async function discoverSeriesForWork(title,author,workKeys){
 if(!title)return null;
 var claims={},diag={matchedEditions:0,claims:0,openLibraryWorks:0,openLibraryEditions:0,openLibraryClaims:0,googleItems:0,googleClaims:0,rateLimited:false,cacheHits:0};
 function claimCount(){return Object.keys(claims).length}
 function parseStructured(raw,score,source,kind){([].concat(raw||[])).filter(Boolean).forEach(function(x){var old=claimCount(),p=parseSeriesLabel(String(x),title,author);if(p)addSeriesClaim(claims,p.series,p.seriesNo,score,source,title,author);if(claimCount()>old){if(kind==="ol")diag.openLibraryClaims++;if(kind==="g")diag.googleClaims++}})}
 async function inspectWorkKey(key){
  if(!key||!/^\/works\//.test(key))return;diag.openLibraryWorks++;
  var wr=await cachedFetchJSON("https://openlibrary.org"+key+".json");if(wr.fromCache)diag.cacheHits++;if(wr.ok){var w=wr.data||{};parseStructured(w.series,12,"Open Library work series","ol");var old=claimCount();extractSeriesClaimsFromText([w.title||"",w.subtitle||"",typeof w.description==="string"?w.description:(w.description&&w.description.value)||""].join(" "),claims,7,"Open Library work description",title,author);if(claimCount()>old)diag.openLibraryClaims++}
  var er=await cachedFetchJSON("https://openlibrary.org"+key+"/editions.json?limit=50");if(er.fromCache)diag.cacheHits++;if(er.ok){(er.data.entries||[]).forEach(function(ed){diag.openLibraryEditions++;var ts=similarity(title,ed.title||title);if(ts<5)return;diag.matchedEditions++;parseStructured(ed.series,11+(ts>=9?1:0),"Open Library edition series","ol");var old=claimCount();extractSeriesClaimsFromText([ed.title||"",ed.subtitle||"",(ed.publishers||[]).join(" ")].join(" "),claims,7,"Open Library edition label",title,author);if(claimCount()>old)diag.openLibraryClaims++})}
 }
 var keys=uniqText(workKeys||[]);for(var ki=0;ki<Math.min(keys.length,3);ki++)await inspectWorkKey(keys[ki]);
 if(!claimCount()){
  var oq="title="+encodeURIComponent(title)+(author?"&author="+encodeURIComponent(author):"")+"&limit=12&fields=key,title,subtitle,author_name,series",or=await cachedFetchJSON("https://openlibrary.org/search.json?"+oq);if(or.fromCache)diag.cacheHits++;if(or.ok){var docs=(or.data&&or.data.docs)||[],checked=0;for(var di=0;di<docs.length&&checked<3;di++){var d=docs[di],da=(d.author_name||[]).join(", "),ts=similarity(title,d.title||""),as=author?similarity(author,da):6;if(ts<7||as<4)continue;checked++;parseStructured(d.series,11,"Open Library search series","ol");await inspectWorkKey(d.key)}}
 }
 if(!claimCount()){
  var gr=await googleWorkItems(title,author);if(gr.fromCache)diag.cacheHits++;if(gr.status===429)diag.rateLimited=true;if(gr.ok){diag.googleItems=gr.items.length;gr.items.forEach(function(it){var v=it.volumeInfo||{},va=(v.authors||[]).join(", "),ts=similarity(title,v.title||""),as=author?similarity(author,va):6;if(ts<6||as<4)return;diag.matchedEditions++;var labels=[];if(it.seriesInfo){if(it.seriesInfo.shortSeriesBookTitle)labels.push(it.seriesInfo.shortSeriesBookTitle);if(it.seriesInfo.bookDisplayNumber)labels.push((it.seriesInfo.seriesId||"")+" "+it.seriesInfo.bookDisplayNumber)}if(v.seriesInfo){if(v.seriesInfo.shortSeriesBookTitle)labels.push(v.seriesInfo.shortSeriesBookTitle);if(v.seriesInfo.bookDisplayNumber)labels.push((v.seriesInfo.seriesId||"")+" "+v.seriesInfo.bookDisplayNumber)}labels.push(v.subtitle||"");parseStructured(labels,9,"Google Books structured/label metadata","g");var old=claimCount(),blob=[v.title||"",v.subtitle||"",v.description||"",((v.categories||[]).join(" "))].join(" "),inf=inferSeries(v.title||"",blob);if(inf.series)addSeriesClaim(claims,inf.series,inf.seriesNo,7+(ts>=9?2:0),"Google Books edition metadata",title,author);extractSeriesClaimsFromText(blob,claims,7,"Google Books description",title,author);if(claimCount()>old)diag.googleClaims++})}
 }
 var best=bestSeriesClaim(claims);diag.claims=claimCount();diag.candidates=Object.keys(claims).map(function(k){return claims[k].series}).slice(0,4);if(best){best.diagnostics=diag;return best}return{series:"",seriesNo:"",confidence:"",source:"",diagnostics:diag}
}

async function enrichBook(found,isbn){
 var out=found||{},title=out.title||"",author=out.author||"";
 if(title){
  var gw=await googleWorkSearch(title,author,isbn);out=mergeWorkSignals(out,gw);
  var ow=await openLibraryWorkSearch(out.title||title,out.author||author,isbn);out=mergeWorkSignals(out,ow)
 }
 var ser=inferSeries(out.title||"",out.description||"");
 if(!out.series&&ser.series)out.series=ser.series;
 if(!out.seriesNo&&ser.seriesNo)out.seriesNo=ser.seriesNo;
 var intel=intelligenceFor(out);
 if(!out.series&&intel.series)out.series=intel.series;
 if(!out.seriesNo&&intel.seriesNo)out.seriesNo=intel.seriesNo;
 if(!out.series&&out.title){
  var bridge=await discoverSeriesForWork(out.title,out.author||author||"",out.workKeys||[]);
  if(bridge&&bridge.diagnostics)out.seriesDiagnostics=bridge.diagnostics;
  if(bridge&&bridge.series){out.series=bridge.series;out.seriesNo=bridge.seriesNo||"";out.seriesSuggested=true;out.seriesConfidence=bridge.confidence||"possible";out.seriesSource=bridge.source||"Series Brain bridge"}
 }
 return out
}
async function lookupISBN(){
 var isbn=cleanISBN(el("#isbnInput").value),r=el("#guardianResult");
 if(isbn.length!==10&&isbn.length!==13){r.innerHTML='<div class="guardian red"><h3>ISBN looks incomplete</h3></div>';return}

 // HOTFIX: exact owned ISBNs are answered from the local catalog immediately.
 var localExact=visible().find(function(b){return cleanISBN(b.edition&&b.edition.isbn)===isbn&&isbn});
 if(localExact){
  getOrBootstrapWorkIntelligence(localExact.title||"",localExact.author||"");
  var localFound={
   title:localExact.title||"",
   author:localExact.author||"",
   genres:(localExact.genres||[]).slice(),
   tags:(localExact.tags||[]).slice(),
   series:localExact.series||"",
   seriesNo:localExact.seriesNo||"",
   cover:localExact.cover||"",
   edition:Object.assign({},localExact.edition||{},{isbn:isbn})
  };
  showMatch(localFound,"Your local Enchanted Bookshop catalog");  return;
 }

 // V4.8.4: recognize ISBNs the user previously taught the Bookshop before calling public APIs.
 var learnedHit=learnedISBNEntry(isbn);
 if(learnedHit){
  showMatch(learnedFoundForISBN(learnedHit,isbn),"Your Bookshop Learning Brain • remembered ISBN");
  return;
 }

 r.innerHTML='<div class="syncstatus">🧠 Book Intelligence Brain is gathering the best metadata...</div>';
 var found=null,sources=[];
 var g=await googleLookup("isbn:"+isbn,isbn);if(g){found=mergeFound(found,g);sources.push("Google Books")}
 var o=await openLibraryISBN(isbn);if(o){found=mergeFound(found,o);sources.push("Open Library")}
 if(found)found=await enrichBook(found,isbn);
 if(!found||!found.title){showUnknownISBNRescue(isbn,r);return}
 showMatch(found,uniqText(sources).join(" + ")||"Book Intelligence Brain")
}

function showUnknownISBNRescue(isbn,r){
 var owned=visible().filter(function(b){return b.owned!==false});
 r.innerHTML='<div class="guardian purple unknown-isbn-rescue">'+
  '<div class="eyebrow">SHOPPING MODE 2.2 • BOOKSHOP LEARNING BRAIN</div>'+
  '<h3>🧠 I don\'t recognize this ISBN yet.</h3>'+
  '<div class="shop-verdict">That does not mean the book is new to you. Help your Bookshop identify the <b>work</b>, and I\'ll compare this ISBN against copies you already own.</div>'+
  '<div class="unknown-rescue-fields"><div class="field"><label>Title</label><input id="rescueTitle" placeholder="Starside"></div><div class="field"><label>Author</label><input id="rescueAuthor" placeholder="Alex Aster"></div></div>'+
  '<div class="actions"><button class="primary" id="rescueCompare">🔎 Compare with my Bookshop</button><button class="pill" id="manualAdd">Add manually</button></div>'+
  '<div id="rescueMatches"></div><div class="tiny">Scanned ISBN: '+esc(isbn)+' • Nothing is added unless you choose to add it.</div></div>';
 el("#manualAdd").onclick=function(){openBook({id:"",workId:"",title:"",author:"",genres:[],series:"",seriesNo:"",status:"no-reading-status",owned:true,wantOwn:false,rating:0,favorite:false,spice:0,edition:{isbn:isbn,name:"",format:"Paperback",publisher:"",publicationDate:"",pages:"",printing:"",special:[]},notes:""})};
 el("#rescueCompare").onclick=function(){
  var title=(el("#rescueTitle").value||"").trim(),author=(el("#rescueAuthor").value||"").trim(),box=el("#rescueMatches");
  if(!title){box.innerHTML='<div class="shop-confidence"><b>Enter the title first.</b> Author is strongly recommended for a high-confidence match.</div>';return}
  var nt=norm(title),na=norm(author),matches=owned.filter(function(b){
   var bt=norm(b.title||""),ba=norm(b.author||"");
   return bt===nt || (bt&&nt&&(bt.indexOf(nt)>=0||nt.indexOf(bt)>=0));
  });
  if(na)matches=matches.filter(function(b){var ba=norm(b.author||"");return ba===na || (ba&&na&&(ba.indexOf(na)>=0||na.indexOf(ba)>=0))});
  if(!matches.length){box.innerHTML='<div class="shop-confidence"><b>No owned work match found.</b> Try the exact title/author from your copy, or use Add manually if this really is new.</div>';return}
  box.innerHTML='<div class="unknown-match-heading"><b>Possible owned work'+(matches.length===1?'':'s')+':</b> Choose the one this ISBN belongs to.</div>'+matches.slice(0,8).map(function(b,i){return '<button class="unknown-work-choice" data-i="'+i+'">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="">':'<span class="unknown-cover-fallback">📕</span>')+'<span><b>'+esc(b.title||'Untitled')+'</b><small>'+esc(b.author||'Unknown author')+'</small><small>'+esc((b.edition&&b.edition.name)||((b.edition&&b.edition.format)||'Saved copy'))+' • ISBN '+esc(cleanISBN(b.edition&&b.edition.isbn)||'not saved')+'</small></span></button>'}).join('');
  Array.prototype.forEach.call(box.querySelectorAll('.unknown-work-choice'),function(btn){btn.onclick=function(){
   var b=matches[Number(btn.getAttribute('data-i'))];
   var f={title:b.title||title,author:b.author||author,genres:(b.genres||[]).slice(),tags:(b.tags||[]).slice(),series:b.series||'',seriesNo:b.seriesNo||'',cover:'',edition:{isbn:isbn,name:'',format:'',publisher:'',publicationDate:'',pages:'',printing:'',special:[]}};
   box.innerHTML='<div class="learning-confirm"><div class="eyebrow">🧠 TEACH YOUR BOOKSHOP</div><h4>Remember '+esc(isbn)+' as '+esc(b.title||title)+'?</h4><p class="muted">This saves only the ISBN-to-work connection. It does <b>not</b> invent edition details or add another copy to your Library.</p><div class="actions"><button class="primary" id="rememberISBN">🧠 Remember this ISBN</button><button class="pill" id="compareOnce">Compare once</button></div><div class="tiny">Remembered ISBNs are included in backups and Work Intelligence sync.</div></div>';
   el('#rememberISBN').onclick=function(){rememberISBNForWork(isbn,b);showMatch(f,'Your Bookshop Learning Brain • ISBN remembered')};
   el('#compareOnce').onclick=function(){showMatch(f,'You identified the work • one-time comparison')};
  }});
 }
}


function bootstrapAllCatalogedWorkIntelligence(){
 var changed=0;
 (state.books||[]).forEach(function(b){
  if(!getWorkIntelligence(b.title||"",b.author||"")){
   var learned=learnWorkFromCatalogedCopy(b);
   if(learned)changed++
  }
 });
 return changed
}


function sameNormalizedTitleAuthor(a,b){
 return norm(a&&a.title||"")===norm(b&&b.title||"") &&
        (!norm(a&&a.author||"") || !norm(b&&b.author||"") || norm(a&&a.author||"")===norm(b&&b.author||""))
}
function imageLoads(url){
 return new Promise(function(resolve){
  if(!url){resolve(false);return}
  var img=new Image(),done=false;
  var finish=function(ok){if(done)return;done=true;resolve(ok)};
  var t=setTimeout(function(){finish(false)},5000);
  img.onload=function(){clearTimeout(t);finish(true)};
  img.onerror=function(){clearTimeout(t);finish(false)};
  img.src=url
 })
}
function coverCandidatesFor(found,owned){
 var out=[];
 function add(url,kind,source,exact){
  if(!url)return;
  if(out.some(function(x){return x.url===url}))return;
  out.push({url:url,kind:kind,source:source||"",exact:!!exact})
 }
 var isbn=cleanISBN((found&&found.edition&&found.edition.isbn)||(owned&&owned.edition&&owned.edition.isbn)||"");
 // 1) Candidate explicitly returned for the scanned/identified edition.
 if(found&&found.cover)add(found.cover,"Exact ISBN / identified edition",found.coverSource||"identified edition",true);
 // 2) Existing alternate edition candidates collected by enrichment, if present.
 (found&&found.coverCandidates||[]).forEach(function(c){
  if(typeof c==="string")add(c,"Matching edition","metadata source",true);
  else if(c&&c.url)add(c.url,c.kind||"Matching edition",c.source||"metadata source",c.exact!==false)
 });
 // 3) Open Library exact ISBN cover only when ISBN exists.
 if(isbn){
  add("https://covers.openlibrary.org/b/isbn/"+encodeURIComponent(isbn)+"-L.jpg","Exact ISBN","Open Library ISBN",true)
 }
 // 4) Work-level fallback is allowed but must be clearly labeled.
 if(found&&found.workCover)add(found.workCover,"Work-level fallback",found.workCoverSource||"work metadata",false);
 return out
}
async function chooseValidCoverCandidate(found,owned){
 var cs=coverCandidatesFor(found,owned);
 for(var i=0;i<cs.length;i++){
  if(await imageLoads(cs[i].url))return cs[i]
 }
 return null
}
async function recoverCoverForOwnedBook(owned,found,host){
 if(!owned)return;
 var target=host||el("#guardianResult");
 if(target)target.innerHTML += '<div class="syncstatus" id="coverRecoveryStatus">✨ Checking exact-edition cover sources...</div>';
 var c=await chooseValidCoverCandidate(found,owned);
 var status=el("#coverRecoveryStatus");
 if(!c){
  if(status)status.innerHTML='🕯️ No usable cover could be verified for this edition yet. Nothing was changed.';
  return
 }
 if(!c.exact){
  var ok=confirm("I found a work-level cover, but I cannot verify that it is your exact edition. Use it anyway?");
  if(!ok){if(status)status.innerHTML='Cover recovery cancelled. Your saved book was not changed.';return}
 }
 var before=JSON.parse(JSON.stringify(owned));
 owned.cover=c.url;
 owned.coverSource=(c.exact?"Exact edition: ":"Work-level fallback: ")+(c.source||c.kind);
 owned.updatedAt=now();
 save();
 if(status)status.innerHTML='✅ Cover recovered from <b>'+esc(c.kind)+'</b>. Only the cover fields were changed.';
 // Safety check: restore if any non-cover data somehow changed.
 var after=JSON.parse(JSON.stringify(owned));
 function stripCover(x){var y=JSON.parse(JSON.stringify(x));delete y.cover;delete y.coverSource;delete y.updatedAt;return y}
 if(JSON.stringify(stripCover(before))!==JSON.stringify(stripCover(after))){
  Object.keys(owned).forEach(function(k){delete owned[k]});
  Object.assign(owned,before);
  save();
  if(status)status.innerHTML='🛡️ Cover recovery was rolled back because another field changed unexpectedly.';
  return
 }
 render()
}


async function findAndRecoverCoverForExactOwned(exact,localFound,host){
 var r=host||el("#guardianResult");
 var btn=el("#recoverCover");
 if(btn){btn.disabled=true;btn.textContent="✨ Searching for cover..."}
 var status=el("#coverRecoveryStatus");
 if(!status&&r){
  r.innerHTML += '<div class="syncstatus" id="coverRecoveryStatus">✨ Searching exact-edition cover sources...</div>';
  status=el("#coverRecoveryStatus")
 }
 try{
  var isbn=cleanISBN(exact&&exact.edition&&exact.edition.isbn||localFound&&localFound.edition&&localFound.edition.isbn||"");
  var found=Object.assign({},localFound||{});
  if(isbn){
   var gf=await googleLookup("isbn:"+isbn,isbn);
   var of=await openLibraryISBN(isbn);
   if(gf)found=mergeFound(found,gf);
   if(of)found=mergeFound(found,of);
   if(found&&found.title)found=await enrichBook(found,isbn)
  }
  await recoverCoverForOwnedBook(exact,found,r)
 }catch(e){
  console.warn("Cover search failed",e);
  if(status)status.textContent="🕯️ Cover search failed safely. Nothing was changed."
 }finally{
  var b=el("#recoverCover");
  if(b){b.disabled=false;b.textContent="✨ Find / Recover Cover"}
 }
}

function workBrainPreviewHTML(f){
 var intel=intelligenceFor(f),gs=(intel.genres||[]).map(esc).join(" • ")||"None saved",ts=(intel.tags||[]).map(esc).join(" • ")||"None saved",ser=intel.series?(esc(intel.series)+(intel.seriesNo?" #"+esc(intel.seriesNo):"")):"Unknown",sp=(intel.spice!=null&&intel.spice!=="")?spice(+intel.spice)+" ("+intel.spice+"/5)":"Unknown";
 var src=intel.source||"Book Intelligence";
 return '<div class="guardian purple"><div class="eyebrow">🧠 Work Intelligence Preview</div><h3>'+esc(f.title||"This work")+'</h3><div class="muted"><b>Series:</b> '+ser+'<br><b>Genres:</b> '+gs+'<br><b>Tropes / tags:</b> '+ts+'<br><b>Spice:</b> '+sp+'<br><b>Source:</b> '+esc(src)+'</div><div class="tiny" style="margin-top:10px">Preview only — this does not add another copy or change your library.</div></div>'
}
function attachImageProbe(url,onGood,onBad){
 if(!url){if(onBad)onBad();return}
 var im=new Image(),done=false,t=setTimeout(function(){if(done)return;done=true;if(onBad)onBad()},5000);
 im.onload=function(){if(done)return;done=true;clearTimeout(t);if(im.naturalWidth>40&&im.naturalHeight>40){if(onGood)onGood()}else if(onBad)onBad()};
 im.onerror=function(){if(done)return;done=true;clearTimeout(t);if(onBad)onBad()};
 im.src=url
}
function saveRecoveredCover(book,url){
 if(!book||!url)return;
 attachImageProbe(url,function(){
  var ix=state.books.findIndex(function(x){return x.id===book.id});
  if(ix<0)return;
  state.books[ix].cover=url;state.books[ix].updatedAt=now();save();render();autoSyncMaybe();
  alert("Cover recovered ✨")
 },function(){alert("That cover source did not return a usable image.")})
}


// V4.10 — Collector Intelligence 2.0
var COLLECTOR_FEATURES=[
 ['sprayed-edges','Sprayed / painted edges',['sprayed edge','sprayed edges','painted edge','painted edges','colored edge','coloured edge']],
 ['stenciled-edges','Stenciled edges',['stenciled edge','stencilled edge','stenciled edges','stencilled edges']],
 ['alternate-cover','Alternate / exclusive cover',['alternate cover','alternative cover','exclusive cover','special cover','variant cover']],
 ['signed','Signed',['signed','autographed']],
 ['numbered','Numbered / limited copy',['numbered edition','numbered copy','limited numbered']],
 ['bonus-content','Bonus content',['bonus chapter','bonus chapters','bonus content','exclusive chapter','exclusive content','extra chapter']],
 ['illustrated-endpapers','Illustrated endpapers',['illustrated endpaper','illustrated endpapers','designed endpaper','designed endpapers']],
 ['illustrations','Interior illustrations',['interior illustration','interior illustrations','illustrated edition','illustrated pages']],
 ['foil','Foil / special jacket effects',['foil','foiled','jacket effect','jacket effects','special jacket']],
 ['special-case','Special hardcover case',['special hard cover case','special hardcover case','case design','case stamp','case stamping']],
 ['retailer-exclusive','Retailer exclusive',['barnes & noble exclusive','barnes and noble exclusive','target exclusive','books-a-million exclusive','bam exclusive','waterstones exclusive','retailer exclusive']],
 ['limited-edition','Limited / deluxe edition',['limited edition','deluxe edition','collector edition','collector’s edition','collectors edition']]
];
function collectorFeatureMap(x){
 var e=(x&&x.edition)||{},blob=[e.name||'',(e.special||[]).join(' '),x&&x.description||''].join(' ').toLowerCase(),out={};
 COLLECTOR_FEATURES.forEach(function(def){if(def[2].some(function(k){return blob.indexOf(k)>=0}))out[def[0]]=def[1]});
 return out
}
function collectorFeatureLabel(id){var f=COLLECTOR_FEATURES.find(function(x){return x[0]===id});return f?f[1]:id}
function collectorIntelligenceHTML(owned,hand){
 var own=collectorFeatureMap(owned),scan=collectorFeatureMap(hand),ids=Object.keys(scan),ownIds=Object.keys(own),adds=ids.filter(function(id){return !own[id]}),shared=ids.filter(function(id){return !!own[id]});
 var verdict=adds.length>=3?'Strong collector difference':adds.length?'Meaningfully different':'Different ISBN — features still need confirmation';
 var cls=adds.length?'collector-ci-good':'collector-ci-warn';
 return '<div class="collector-intelligence" id="collectorIntelligence">'+
  '<div class="eyebrow">💎 COLLECTOR INTELLIGENCE 2.0</div><h3>What is actually different?</h3>'+
  '<div class="collector-ci-verdict '+cls+'"><b>Collector verdict:</b> <span id="collectorVerdict">'+esc(verdict)+'</span></div>'+
  '<div class="collector-ci-cols"><div><b>✨ Adds to your collection</b><div id="collectorAdds">'+(adds.length?adds.map(function(id){return '<span class="collector-feature new">'+esc(collectorFeatureLabel(id))+'</span>'}).join(''):'<span class="tiny muted">No extra features confirmed yet.</span>')+'</div></div>'+
  '<div><b>📚 Already on your copy</b><div id="collectorShared">'+(shared.length?shared.map(function(id){return '<span class="collector-feature shared">'+esc(collectorFeatureLabel(id))+'</span>'}).join(''):(ownIds.length?'<span class="tiny muted">The scanned edition has not confirmed any overlapping features yet.</span>':'<span class="tiny muted">No collector features saved on your copy.</span>'))+'</div></div></div>'+
  '<details class="collector-confirm"><summary>🔎 Confirm features on the edition in your hand</summary><p class="tiny">Public metadata can miss collector details. Check only what you can confirm from the book/listing. These choices stay temporary unless you add this edition.</p><div class="collector-checks">'+COLLECTOR_FEATURES.map(function(def){return '<label><input type="checkbox" class="collectorHandFeature" value="'+esc(def[0])+'" '+(scan[def[0]]?'checked':'')+'> '+esc(def[1])+'</label>'}).join('')+'</div></details>'+
  '<div class="tiny collector-ci-note">Confidence: the ISBN difference is confirmed. Feature differences are based only on saved, detected, or personally confirmed details — the Bookshop will not invent collector features.</div></div>'
}
function wireCollectorIntelligence(owned,hand){
 var checks=[].slice.call(document.querySelectorAll('.collectorHandFeature'));if(!checks.length)return;
 function refresh(){var own=collectorFeatureMap(owned),chosen={};checks.forEach(function(c){if(c.checked)chosen[c.value]=collectorFeatureLabel(c.value)});var ids=Object.keys(chosen),adds=ids.filter(function(id){return !own[id]}),shared=ids.filter(function(id){return !!own[id]});
  var a=el('#collectorAdds'),sh=el('#collectorShared'),v=el('#collectorVerdict');
  if(a)a.innerHTML=adds.length?adds.map(function(id){return '<span class="collector-feature new">'+esc(chosen[id])+'</span>'}).join(''):'<span class="tiny muted">No extra features confirmed yet.</span>';
  if(sh)sh.innerHTML=shared.length?shared.map(function(id){return '<span class="collector-feature shared">'+esc(chosen[id])+'</span>'}).join(''):'<span class="tiny muted">No confirmed overlap from the edition in your hand.</span>';
  if(v)v.textContent=adds.length>=3?'Strong collector difference':adds.length?'Meaningfully different':'Different ISBN — features still need confirmation';
  hand.edition=hand.edition||{};hand.edition.special=ids.map(function(id){return chosen[id]});
 }
 checks.forEach(function(c){c.onchange=refresh});refresh()
}

function shoppingEditionLines(x){
 var e=(x&&x.edition)||{},lines=[];
 if(e.name)lines.push("<b>Edition:</b> "+esc(e.name));
 if(e.format)lines.push("<b>Format:</b> "+esc(e.format));
 if(e.publisher)lines.push("<b>Publisher:</b> "+esc(e.publisher));
 if(e.publicationDate)lines.push("<b>Published:</b> "+esc(e.publicationDate));
 if(e.printing)lines.push("<b>Printing:</b> "+esc(e.printing));
 if(e.isbn)lines.push("<b>ISBN:</b> "+esc(cleanISBN(e.isbn)));
 if(Array.isArray(e.special)&&e.special.length)lines.push("<b>Saved edition features:</b> "+e.special.map(esc).join(" • "));
 return lines.join("<br>")||"Edition details are limited."
}
function shoppingCover(x,label){
 var cover=x&&x.cover?'<img class="shop-cover-img" src="'+esc(x.cover)+'" alt="">':'<div class="shop-cover-fallback">📕</div>';
 return '<div class="shop-copy"><div class="shop-copy-label">'+esc(label)+'</div>'+cover+'<div class="shop-copy-title">'+esc(x&&x.title||"Unknown title")+'</div><div class="muted">'+esc(x&&x.author||"Unknown author")+'</div><div class="tiny shop-edition-lines">'+shoppingEditionLines(x)+'</div></div>'
}
function shoppingSeriesSignal(f){
 var intel=intelligenceFor(f),name=intel.series||f.series||"",num=intel.seriesNo||f.seriesNo||"";
 if(!name)return "";
 var s=getSeries(name);
 if(!s||s.deleted||!Array.isArray(s.books)||!s.books.length){
  return '<div class="shop-series-note"><b>🔮 Series:</b> '+esc(name)+(num?' #'+esc(num):'')+'<br><span class="tiny">Series detected, but no confirmed lineup is saved yet.</span></div>'
 }
 var current=visible(),ownedCount=0;
 s.books.forEach(function(entry){if(isOwnedSeriesEntry(entry,current))ownedCount++});
 var target=s.books.find(function(entry){
  return (num&&entry.number&&String(entry.number)===String(num)) || norm(entry.title)===norm(f.title)
 });
 var targetOwned=target?isOwnedSeriesEntry(target,current):false;
 var remaining=Math.max(0,s.books.length-ownedCount);
 if(target&&!targetOwned){
  return '<div class="shop-series-hit"><div class="eyebrow">🔮 SERIES GAP FOUND</div><b>This looks like a missing volume in '+esc(name)+'.</b><div class="muted">'+esc(target.title)+(target.number?' • #'+esc(target.number):'')+'</div><div class="tiny">You currently own '+ownedCount+' of '+s.books.length+' confirmed lineup entries. '+remaining+' still missing before this scan.</div></div>'
 }
 return '<div class="shop-series-note"><b>🔮 '+esc(name)+(num?' #'+esc(num):'')+'</b><br><span class="tiny">'+ownedCount+' of '+s.books.length+' confirmed lineup entries currently owned.</span></div>'
}
function shoppingKeepBrowsingButton(){
 return '<button class="pill" id="shopKeepBrowsing">Keep browsing</button>'
}
function wireKeepBrowsing(){
 var b=el("#shopKeepBrowsing");if(b)b.onclick=closeModal
}
function showMatch(f,source){
 var isbn=cleanISBN(f.edition&&f.edition.isbn),books=visible(),r=el("#guardianResult");
 var exact=books.find(function(b){return cleanISBN(b.edition&&b.edition.isbn)===isbn&&isbn});
 var strictSame=books.find(function(b){
  return norm(b.title)===norm(f.title)&&norm(b.author||"")&&norm(f.author||"")&&norm(b.author)===norm(f.author)
 });
 var possibleSame=!strictSame?books.find(function(b){
  return norm(b.title)===norm(f.title)&&(!b.author||!f.author)
 }):null;

 if(exact){
  getOrBootstrapWorkIntelligence(exact.title||f.title,exact.author||f.author);
  var canCover=!exact.cover||!!f.cover&&f.cover!==exact.cover;
  r.innerHTML=
   '<div class="guardian red shopping-v2">'+
    '<div class="eyebrow">SHOPPING MODE 2.0 • EXACT ISBN CONFIRMED</div>'+
    '<h3>🚨 YOU ALREADY OWN THIS EXACT EDITION</h3>'+
    '<div class="shop-verdict">You already cataloged this ISBN. Unless you want a second physical copy, this is a <b>skip</b>.</div>'+
    '<div class="shop-compare">'+shoppingCover(exact,"Your copy")+shoppingCover(f,"In your hand")+'</div>'+
    shoppingSeriesSignal(f)+
    '<div class="shop-confidence"><b>Edition confidence:</b> HIGH • exact ISBN match</div>'+
    '<div class="actions"><button class="primary" id="previewBrain">🧠 Preview Work Intelligence</button>'+
      ((!exact.cover||canCover)?'<button class="pill" id="recoverCover">✨ Find / Recover Cover</button>':'')+
      shoppingKeepBrowsingButton()+
    '</div>'+
    '<div id="brainPreview"></div>'+
    '<div class="tiny">Metadata: '+esc(source)+'</div>'+
   '</div>';
  el("#previewBrain").onclick=function(){el("#brainPreview").innerHTML=workBrainPreviewHTML(f)};
  if(el("#recoverCover"))el("#recoverCover").onclick=async function(){await findAndRecoverCoverForExactOwned(exact,f,r)};
  wireKeepBrowsing();
  return
 }

 if(strictSame){
  r.innerHTML=
   '<div class="guardian yellow shopping-v2">'+
    '<div class="eyebrow">SHOPPING MODE 2.0 • SAME WORK, DIFFERENT ISBN</div>'+
    '<h3>💎 DIFFERENT EDITION</h3>'+
    '<div class="shop-verdict">You own this story, but <b>not this ISBN</b>. This may be worth buying if you want another edition.</div>'+
    '<div class="shop-compare">'+shoppingCover(strictSame,"Edition you own")+shoppingCover(f,"Edition in your hand")+'</div>'+
    '<div class="shop-confidence"><b>Edition confidence:</b> HIGH that it is a different edition • collector features are compared only when detected or confirmed</div>'+
    collectorIntelligenceHTML(strictSame,f)+
    shoppingSeriesSignal(f)+
    '<div class="actions"><button class="primary" id="addFound">✨ Add this edition</button>'+shoppingKeepBrowsingButton()+'</div>'+
   '</div>';
  wireCollectorIntelligence(strictSame,f);
  el("#addFound").onclick=function(){prefill(f)};
  wireKeepBrowsing();
  return
 }

 if(possibleSame){
  r.innerHTML=
   '<div class="guardian purple shopping-v2">'+
    '<div class="eyebrow">SHOPPING MODE 2.0 • POSSIBLE WORK MATCH</div>'+
    '<h3>🟣 CHECK BEFORE YOU BUY</h3>'+
    '<div class="shop-verdict">The title matches a book you own, but the author metadata is incomplete. I will not pretend this is an exact work match.</div>'+
    '<div class="shop-compare">'+shoppingCover(possibleSame,"Possible match you own")+shoppingCover(f,"In your hand")+'</div>'+
    '<div class="shop-confidence"><b>Edition confidence:</b> LOW • confirm the book/edition yourself before adding.</div>'+
    '<div class="actions"><button class="primary" id="addFound">Add as a separate edition</button>'+shoppingKeepBrowsingButton()+'</div>'+
   '</div>';
  el("#addFound").onclick=function(){prefill(f)};
  wireKeepBrowsing();
  return
 }

 r.innerHTML=
  '<div class="guardian green shopping-v2">'+
   '<div class="eyebrow">SHOPPING MODE 2.0 • NOT IN YOUR CATALOG</div>'+
   '<h3>🟢 NEW TO YOUR BOOKSHOP ✨</h3>'+
   '<div class="shop-verdict">No owned copy with this ISBN or a confirmed title-and-author work match was found.</div>'+
   '<div class="shop-single">'+shoppingCover(f,"In your hand")+'</div>'+
   shoppingSeriesSignal(f)+
   '<div class="shop-confidence"><b>Catalog confidence:</b> NEW based on your current local catalog. Public metadata can still be incomplete.</div>'+
   '<div class="actions"><button class="primary" id="addFound">📚 Add to Bookshop</button>'+shoppingKeepBrowsingButton()+'</div>'+
   '<div class="tiny">Metadata: '+esc(source)+'</div>'+
  '</div>';
 el("#addFound").onclick=function(){prefill(f)};
 wireKeepBrowsing()
}
function prefill(f){var intel=intelligenceFor(f);var seriesName=intel.workBrain?(intel.series||f.series||""):(f.series||intel.series||""),seriesNo=intel.workBrain?(intel.seriesNo||f.seriesNo||""):(f.seriesNo||intel.seriesNo||"");openBook({id:"",workId:"",title:f.title||"",author:f.author||"",genres:intel.genres,tags:intel.tags,series:seriesName,seriesNo:seriesNo,seriesSuggested:(!intel.workBrain&&!!f.seriesSuggested),seriesConfidence:intel.workBrain?"confirmed by you":(f.seriesConfidence||""),seriesDiagnostics:f.seriesDiagnostics||null,status:"want-to-read",owned:true,wantOwn:false,rating:0,favorite:false,spice:intel.spice,spiceSuggested:!intel.workBrain,spiceConfirmed:!!intel.workBrain,spiceConfidence:intel.spiceConfidence,intelligence:true,workBrain:!!intel.workBrain,intelligenceSource:(intel.workBrain?intel.source:(f.seriesSuggested?((intel.source||"Public book metadata")+" + "+(f.seriesSource||"Series Brain bridge")):intel.source)),readDateUnknown:false,finishedDate:"",cover:f.cover||"",edition:f.edition,notes:""})}
function closeModal(){stopScanner();el("#modal").classList.add("hidden")}
function backupPayload(){return{app:"Enchanted Bookshop",version:"4.22.1",exported:now(),books:state.books,seriesCatalog:seriesCatalog,readingChallenges:getChallenges(),workIntelligence:workIntelligence,smartShelves:smartShelfList(),preferences:{homeDashboard:homeDashSettings(),libraryView:libraryView()}}}
function exportJSON(){var payload=backupPayload(),blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}),a=document.createElement("a"),stamp=new Date().toISOString().slice(0,10);a.href=URL.createObjectURL(blob);a.download="enchanted-bookshop-v4-22-1-backup-"+stamp+".json";document.body.appendChild(a);a.click();a.remove();setBackupMeta({lastExport:payload.exported,version:"4.22.1"});setTimeout(function(){if(state.view==="backup")render()},150)}
function inspectRestore(file){if(!file)return;var r=new FileReader();r.onload=function(){var box=el("#restorePreview");try{var x=JSON.parse(r.result);if(!x||!Array.isArray(x.books))throw Error("Invalid backup");var journals=0,activeBooks=0,deletedBooks=0;x.books.forEach(function(b){if(b&&b.deleted)deletedBooks++;else activeBooks++;if(!b||!b.deleted)journals+=[].concat((b&&b.readingJournal)||[]).length});var sc=Array.isArray(x.seriesCatalog)?x.seriesCatalog.filter(function(s){return !s||!s.deleted}).length:0,ss=Array.isArray(x.smartShelves)?x.smartShelves.length:0,wi=x.workIntelligence&&typeof x.workIntelligence==="object"?Object.keys(x.workIntelligence).length:0;box.innerHTML='<div class="restore-card"><b>✨ Backup looks readable</b><div class="restore-stats"><span>📚 '+activeBooks+' active books</span>'+(deletedBooks?'<span>🗑️ '+deletedBooks+' deleted records retained for sync</span>':'')+'<span>🧩 '+sc+' series</span><span>🕯️ '+journals+' journal entries</span><span>🧠 '+wi+' work records</span><span>🔍 '+ss+' smart shelves</span></div><div class="tiny muted">Backup version: '+esc(x.version||"Unknown")+(x.exported?' • Exported '+esc(new Date(x.exported).toLocaleString()):'')+'</div><div class="actions"><button class="danger" id="confirmRestore">Restore this backup</button><button class="pill" id="cancelRestore">Cancel</button></div><div class="tiny"><b>Restore replaces the local Bookshop data represented in this file.</b> Nothing changes until you press Restore this backup.</div></div>';el("#confirmRestore").onclick=function(){if(!confirm("Restore this backup now? Your current local Bookshop data will be replaced by the backup contents."))return;applyRestore(x)};el("#cancelRestore").onclick=function(){box.innerHTML='<span class="muted">Restore cancelled. Nothing was changed.</span>';el("#restoreFile").value=""}}catch(e){box.innerHTML='<div class="syncstatus bad">⚠️ This file does not look like a readable Enchanted Bookshop backup. Nothing was changed.</div>'}};r.readAsText(file)}
function applyRestore(x){state.books=x.books;if(Array.isArray(x.seriesCatalog)){seriesCatalog=x.seriesCatalog;saveSeries()}if(x.readingChallenges)saveChallenges(x.readingChallenges);if(x.workIntelligence&&typeof x.workIntelligence==="object"){workIntelligence=x.workIntelligence;saveWorkIntelligence()}if(Array.isArray(x.smartShelves))state.smartShelves=x.smartShelves;if(x.preferences&&x.preferences.homeDashboard)saveHomeDash(x.preferences.homeDashboard);if(x.preferences&&x.preferences.libraryView)setLibraryView(x.preferences.libraryView);save();setBackupMeta(Object.assign({},backupMeta(),{lastRestore:now(),restoredFromVersion:x.version||"unknown"}));render();alert("Restored safely ✨")}
function restoreJSON(file){inspectRestore(file)}
async function auth(path,email,password){
 var s=getSync();if(!s.url||!s.anon)throw Error("Save your Supabase URL and anon key first.");
 var res=await fetch(s.url+"/auth/v1/"+path,{method:"POST",headers:{"apikey":s.anon,"Content-Type":"application/json"},body:JSON.stringify({email:email,password:password})}),j=await res.json();if(!res.ok)throw Error(j.msg||j.message||"Authentication failed");return j
}
async function signIn(){var s=getSync(),email=el("#syncEmail").value,pw=el("#syncPassword").value,status=el("#syncAuthStatus");try{var j=await auth("token?grant_type=password",email,pw);s.email=email;s.token=j.access_token;s.refresh=j.refresh_token;s.userId=j.user&&j.user.id||"";putSync(s);render()}catch(e){status.className="syncstatus bad";status.textContent=e.message}}
async function signUp(){var s=getSync(),email=el("#syncEmail").value,pw=el("#syncPassword").value,status=el("#syncAuthStatus");try{var j=await auth("signup",email,pw);s.email=email;if(j.access_token){s.token=j.access_token;s.refresh=j.refresh_token;s.userId=j.user&&j.user.id||""}putSync(s);status.className="syncstatus ok";status.textContent=j.access_token?"Account created and signed in.":"Account created. Check your email if confirmation is enabled."}catch(e){status.className="syncstatus bad";status.textContent=e.message}}
async function refreshToken(){
 var s=getSync();if(!s.refresh)return false;
 try{var res=await fetch(s.url+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{"apikey":s.anon,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:s.refresh})}),j=await res.json();if(!res.ok)return false;s.token=j.access_token;s.refresh=j.refresh_token;putSync(s);return true}catch(e){return false}
}
async function api(path,opts){
 var s=getSync();if(!s.token)throw Error("Sign in first.");opts=opts||{};opts.headers=Object.assign({"apikey":s.anon,"Authorization":"Bearer "+s.token,"Content-Type":"application/json"},opts.headers||{});
 var res=await fetch(s.url+"/rest/v1/"+path,opts);if(res.status===401&&await refreshToken()){s=getSync();opts.headers.Authorization="Bearer "+s.token;res=await fetch(s.url+"/rest/v1/"+path,opts)}
 if(!res.ok){var t=await res.text();throw Error(t||"Sync request failed")}return res
}
function syncStamp(x){var t=Date.parse((x&&x.updatedAt)||0);return isNaN(t)?0:t}
function rowToRecord(row){var x=Object.assign({},row.data||{});x.id=row.id;x.updatedAt=row.updated_at||x.updatedAt||now();x.deleted=!!row.deleted;return x}
function mergeById(local,remoteRows){
 var map={};(local||[]).forEach(function(x){if(x&&x.id)map[x.id]=x});
 (remoteRows||[]).forEach(function(row){var r=rowToRecord(row),l=map[r.id];if(!l||syncStamp(r)>syncStamp(l))map[r.id]=r});
 return Object.keys(map).map(function(k){return map[k]})
}
function syncStatus(msg,bad){var st=el("#syncRunStatus");if(st){st.className="syncstatus "+(bad?"bad":"ok");st.textContent=msg}}
async function fetchCloudWorkIntel(){var r=await api("enchanted_work_intelligence?select=id,data,updated_at,deleted",{method:"GET"});return await r.json()} async function fetchCloudChallenges(){var r=await api("enchanted_reading_challenges?select=id,data,updated_at,deleted",{method:"GET"});return await r.json()}
async function pushChallenges(){
 var s=getSync(),payload=challengeRecords().map(function(x){var data={year:x.year,goal:x.goal,updatedAt:x.updatedAt};return{id:x.id,user_id:s.userId,data:data,updated_at:x.updatedAt||now(),deleted:!!x.deleted}});
 if(payload.length)await api("enchanted_reading_challenges?on_conflict=id",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(payload)})
}
function workIntelAsRecords(){return Object.keys(workIntelligence||{}).map(function(k){var x=Object.assign({},workIntelligence[k]||{});x.id=k;x.updatedAt=x.updatedAt||now();x.deleted=!!x.deleted;return x})}
function recordsToWorkIntel(records){var out={};(records||[]).forEach(function(x){if(x&&x.id&&!x.deleted){var y=Object.assign({},x);delete y.id;delete y.deleted;out[x.id]=y}});return out}
async function pushWorkIntel(){
 var s=getSync(),payload=workIntelAsRecords().map(function(x){var data=Object.assign({},x);delete data.id;return{id:x.id,user_id:s.userId,data:data,updated_at:x.updatedAt||now(),deleted:!!x.deleted}});
 if(payload.length)await api("enchanted_work_intelligence?on_conflict=id",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(payload)})
}
async function fetchCloudBooks(){var r=await api("enchanted_books?select=id,data,updated_at,deleted",{method:"GET"});return await r.json()}
async function fetchCloudSeries(){var r=await api("enchanted_series?select=id,data,updated_at,deleted",{method:"GET"});return await r.json()}
async function pushBooks(){
 var s=getSync(),payload=state.books.map(function(b){return{id:b.id,user_id:s.userId,data:b,updated_at:b.updatedAt||now(),deleted:!!b.deleted}});
 if(payload.length)await api("enchanted_books?on_conflict=id",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(payload)})
}
async function pushSeries(){
 var s=getSync(),payload=seriesCatalog.map(function(x){return{id:x.id,user_id:s.userId,data:x,updated_at:x.updatedAt||now(),deleted:!!x.deleted}});
 if(payload.length)await api("enchanted_series?on_conflict=id",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(payload)})
}
async function pullAndMergeCloud(){
 var s=getSync();if(!s.userId)throw Error("Sign in first.");
 var remBooks=await fetchCloudBooks(),remSeries=await fetchCloudSeries(),remWork=await fetchCloudWorkIntel(),remChallenges=await fetchCloudChallenges();
 var beforeBooks=state.books.length,beforeSeries=seriesCatalog.filter(function(x){return !x.deleted}).length,beforeWork=Object.keys(workIntelligence||{}).length,beforeChallenges=Object.keys(getChallenges()||{}).length;
 state.books=mergeById(state.books,remBooks);seriesCatalog=mergeById(seriesCatalog,remSeries);
 workIntelligence=recordsToWorkIntel(mergeById(workIntelAsRecords(),remWork));
  saveChallenges(recordsToChallenges(mergeById(challengeRecords(),remChallenges)));
 save();saveSeries();saveWorkIntelligence();
 return{booksAdded:Math.max(0,state.books.length-beforeBooks),seriesAdded:Math.max(0,seriesCatalog.filter(function(x){return !x.deleted}).length-beforeSeries),workAdded:Math.max(0,Object.keys(workIntelligence||{}).length-beforeWork),challengesAdded:Math.max(0,Object.keys(getChallenges()||{}).length-beforeChallenges)}
}
async function pullSync(){
 syncStatus("☁️ Pulling cloud data + merging safely...",false);
 try{var r=await pullAndMergeCloud();render();if(state.view==="sync")syncStatus("☁️ Pull complete — local data kept, cloud data merged. Series added: "+r.seriesAdded+". Work Intelligence added: "+r.workAdded+". Reading Challenges added: "+r.challengesAdded+".",false)}
 catch(e){syncStatus(e.message,true)}
}
async function syncNow(){
 syncStatus("☁️ Two-way merge in progress...",false);
 try{
  await pullAndMergeCloud();
  await pushBooks();await pushSeries();await pushWorkIntel();await pushChallenges();
  save();saveSeries();saveWorkIntelligence();render();if(state.view==="sync")syncStatus("☁️ Synced successfully — books + series + Work Intelligence + Reading Challenges merged on both sides.",false)
 }catch(e){syncStatus(e.message,true)}
}
async function syncSeries(){
 var s=getSync();if(!s.token||!s.userId)return;
 var remote=await fetchCloudSeries();seriesCatalog=mergeById(seriesCatalog,remote);saveSeries();await pushSeries()
}
function autoSyncMaybe(){var s=getSync();if(s.auto&&navigator.onLine&&s.token)setTimeout(syncNow,250)}
function autoSyncSeriesMaybe(){var s=getSync();if(s.auto&&navigator.onLine&&s.token)setTimeout(syncSeries,250)}
function wirePage(){
 if(el("#homeScan"))el("#homeScan").onclick=openGuardian;if(el("#homeAddScan"))el("#homeAddScan").onclick=openGuardian;if(el("#saveChallenge"))el("#saveChallenge").onclick=function(){setChallengeGoal(el("#challengeGoal").value)};
 if(el('#customizeHome'))el('#customizeHome').onclick=function(){el('#homeCustomizer').classList.toggle('hidden')};
 document.querySelectorAll('[data-home-toggle]').forEach(function(cb){cb.onchange=function(){var x=homeDashSettings(),k=cb.getAttribute('data-home-toggle'),i=x.hidden.indexOf(k);if(cb.checked&&i>=0)x.hidden.splice(i,1);if(!cb.checked&&i<0)x.hidden.push(k);saveHomeDash(x);render();var box=el('#homeCustomizer');if(box)box.classList.remove('hidden')}});
 document.querySelectorAll('[data-home-move]').forEach(function(btn){btn.onclick=function(){var x=homeDashSettings(),k=btn.getAttribute('data-home-move'),i=x.order.indexOf(k),j=i+parseInt(btn.getAttribute('data-dir'),10);if(i<0||j<0||j>=x.order.length)return;var t=x.order[i];x.order[i]=x.order[j];x.order[j]=t;saveHomeDash(x);render();var box=el('#homeCustomizer');if(box)box.classList.remove('hidden')}});
 if(el('#resetHomeDashboard'))el('#resetHomeDashboard').onclick=function(){localStorage.removeItem(HOME_DASH_KEY);render();var box=el('#homeCustomizer');if(box)box.classList.remove('hidden')};
 document.querySelectorAll('[data-view-jump]').forEach(function(btn){btn.onclick=function(){state.view=btn.getAttribute('data-view-jump');save();render()}});
 document.querySelectorAll("[data-goto]").forEach(function(b){b.onclick=function(){state.view=b.getAttribute("data-goto");save();render()}});
 if(el("#newWish"))el("#newWish").onclick=function(){openWish()};
 if(el("#discoverSeriesBtn"))el("#discoverSeriesBtn").onclick=openSeriesDiscovery;
 document.querySelectorAll('[data-cleanup-filter]').forEach(function(btn){btn.onclick=function(){state.cleanupFilter=btn.getAttribute('data-cleanup-filter')||'all';save();render()}});
 document.querySelectorAll('[data-cleanup-fix]').forEach(function(btn){btn.onclick=function(){var b=visible().find(function(x){return x.id===btn.getAttribute('data-cleanup-fix')});if(b)openBook(b)}});
 document.querySelectorAll('[data-cleanup-view]').forEach(function(btn){btn.onclick=function(){var b=visible().find(function(x){return x.id===btn.getAttribute('data-cleanup-view')});if(b)openCollectorBook(b)}});

 function applyOracleControls(live){
  ['Mood','Genre','Length','Spice','Series'].forEach(function(k){var node=el('#oracle'+k);if(node)state['oracle'+k]=node.value});
  if(el('#oracleFavorites'))state.oracleFavorites=el('#oracleFavorites').checked;
  var pool=oracleFiltered();
  if(state.oraclePickId&&!pool.some(function(b){return b.id===state.oraclePickId}))state.oraclePickId='';
  save();
  if(live)render();
 }
 ['Mood','Genre','Length','Spice','Series'].forEach(function(k){var node=el('#oracle'+k);if(node)node.onchange=function(){applyOracleControls(true)}});
 if(el('#oracleFavorites'))el('#oracleFavorites').onchange=function(){applyOracleControls(true)};
 if(el('#oracleConsult'))el('#oracleConsult').onclick=function(){applyOracleControls(false);oraclePick(true)};
 if(el('#oracleReroll'))el('#oracleReroll').onclick=function(){oraclePick(true)};
 if(el('#oracleReset'))el('#oracleReset').onclick=function(){state.oracleMood='Anything';state.oracleGenre='Any';state.oracleLength='Any';state.oracleSpice='Any';state.oracleSeries='Any';state.oracleFavorites=false;state.oraclePickId='';save();render()};
 if(el('#oracleOpen'))el('#oracleOpen').onclick=function(){var b=visible().find(function(x){return x.id===el('#oracleOpen').getAttribute('data-id')});if(b)openCollectorBook(b)};
 if(el('#oracleStart'))el('#oracleStart').onclick=function(){var b=visible().find(function(x){return x.id===el('#oracleStart').getAttribute('data-id')});if(!b)return;b.status='currently-reading';b.updatedAt=now();save();state.view='journal';render();autoSyncMaybe()};

 var powerLive=function(){readPowerControls();render()};
 ['Genre','Status','Length','Spice','Series'].forEach(function(k){var n=el('#power'+k);if(n)n.onchange=powerLive});
 ['Favorite','Collector','Signed'].forEach(function(k){var n=el('#power'+k);if(n)n.onchange=powerLive});
 if(el('#powerQ'))el('#powerQ').oninput=function(){var v=el('#powerQ').value;clearTimeout(window.__powerTimer);window.__powerTimer=setTimeout(function(){state.powerCriteria=Object.assign({},powerCriteria(),{q:v});save();render();var q=el('#powerQ');if(q){q.focus();q.setSelectionRange(v.length,v.length)}},180)};
 if(el('#clearPower'))el('#clearPower').onclick=function(){state.powerCriteria={q:'',genre:'Any',status:'Any',length:'Any',spice:'Any',series:'Any',favorite:false,collector:false,signed:false};save();render()};
 if(el('#saveSmartShelf'))el('#saveSmartShelf').onclick=function(){var c=readPowerControls(),name=prompt('Name this Smart Shelf:');if(!name||!name.trim())return;smartShelfList().push({id:'sh_'+Date.now().toString(36),name:name.trim(),criteria:JSON.parse(JSON.stringify(c)),createdAt:now()});save();render()};
 document.querySelectorAll('[data-smart-open]').forEach(function(btn){btn.onclick=function(){var sh=smartShelfList().find(function(x){return x.id===btn.getAttribute('data-smart-open')});if(sh){state.powerCriteria=JSON.parse(JSON.stringify(sh.criteria||{}));save();render()}}});
 document.querySelectorAll('[data-smart-delete]').forEach(function(btn){btn.onclick=function(){var id=btn.getAttribute('data-smart-delete'),sh=smartShelfList().find(function(x){return x.id===id});if(!sh)return;if(!confirm('Delete Smart Shelf “'+sh.name+'”? Your books will not be changed.'))return;state.smartShelves=smartShelfList().filter(function(x){return x.id!==id});save();render()}});

 document.querySelectorAll('[data-atmosphere-pick]').forEach(function(btn){btn.onclick=function(){applyAtmosphere(btn.getAttribute('data-atmosphere-pick'));render()}});

 document.querySelectorAll('[data-achievement-filter]').forEach(function(btn){btn.onclick=function(){state.achievementFilter=btn.getAttribute('data-achievement-filter')||'All';save();render()}});

 document.querySelectorAll("[data-log-reading]").forEach(function(btn){btn.onclick=function(){var b=visible().find(function(x){return x.id===btn.getAttribute("data-log-reading")});if(b)openReadingSession(b)}});
 document.querySelectorAll("[data-edit-reading]").forEach(function(btn){btn.onclick=function(){var b=visible().find(function(x){return x.id===btn.getAttribute("data-edit-reading")});if(!b)return;var entry=[].concat(b.readingJournal||[]).find(function(x){return x.id===btn.getAttribute("data-entry-id")});if(entry)openReadingSession(b,entry)}});
 document.querySelectorAll("[data-delete-reading]").forEach(function(btn){btn.onclick=function(){var b=visible().find(function(x){return x.id===btn.getAttribute("data-delete-reading")});if(!b)return;var id=btn.getAttribute("data-entry-id");if(!confirm('Delete this reading journal entry? This cannot be undone.'))return;b.readingJournal=[].concat(b.readingJournal||[]).filter(function(x){return x.id!==id});recalcReadingProgress(b);b.updatedAt=now();save();render();autoSyncMaybe()}});
 document.querySelectorAll("[data-wish-filter]").forEach(function(btn){btn.onclick=function(){var f=btn.getAttribute("data-wish-filter");document.querySelectorAll("[data-wish-filter]").forEach(function(x){x.classList.toggle("active",x===btn)});var main=el("#wishMain"),gaps=el("#wishGaps");if(f==="gaps"){main.classList.add("hidden");gaps.classList.remove("hidden");return}gaps.classList.add("hidden");main.classList.remove("hidden");document.querySelectorAll(".wish-card").forEach(function(card){var b=visible().find(function(x){return x.id===card.getAttribute("data-wish-open")});var show=f==="all"||(f==="work"&&wishKind(b)==="work")||(f==="edition"&&wishKind(b)==="edition")||(f==="grail"&&wishPriority(b)==="GRAIL");card.style.display=show?"":"none"})}});

 document.querySelectorAll("[data-wish-gap]").forEach(function(btn){btn.onclick=function(){openWish({id:"",workId:"",title:btn.getAttribute("data-wish-title"),author:"",cover:"",genres:[],series:btn.getAttribute("data-wish-gap"),seriesNo:btn.getAttribute("data-wish-no"),status:"no-reading-status",owned:false,wantOwn:true,rating:0,favorite:false,spice:0,edition:{isbn:"",name:"",format:"Paperback",publisher:"",publicationDate:"",pages:"",printing:"",special:[]},wishKind:"work",wishPriority:"Normal",wishFeatures:[],wishNotes:"Series gap"})}});
 if(el("#exportBtn"))el("#exportBtn").onclick=exportJSON;
 if(el("#restoreFile"))el("#restoreFile").onchange=function(e){inspectRestore(e.target.files[0])};
 if(el("#saveSyncConfig"))el("#saveSyncConfig").onclick=function(){var s=getSync();s.url=el("#syncUrl").value.replace(/\/$/,"");s.anon=el("#syncAnon").value;putSync(s);el("#syncAuthStatus").textContent="Connection saved."};
 if(el("#signIn"))el("#signIn").onclick=signIn;if(el("#signUp"))el("#signUp").onclick=signUp;
 if(el("#signOut"))el("#signOut").onclick=function(){var s=getSync();s.token="";s.refresh="";s.userId="";putSync(s);render()};
 if(el("#autoSync"))el("#autoSync").onchange=function(){var s=getSync();s.auto=this.checked;putSync(s)};
 if(el("#pushSync"))el("#pushSync").onclick=syncNow;if(el("#pullSync"))el("#pullSync").onclick=pullSync
}
document.addEventListener("click",function(e){
 var addTop=e.target.closest("#addBtn");if(addTop){openBookshopIntake();return}
 var scanTop=e.target.closest("#scanBtn");if(scanTop){openGuardian();return}
 var installTop=e.target.closest("#installBtn");if(installTop&&deferredInstall){deferredInstall.prompt();deferredInstall.userChoice.then(function(){deferredInstall=null;el("#installBtn").classList.add("hidden")});return}
 var v=e.target.closest("[data-view]");if(v){state.view=v.getAttribute("data-view");state.filter="all";save();render();if(window.matchMedia("(max-width:820px)").matches)requestAnimationFrame(function(){window.scrollTo(0,0)});return}
 var f=e.target.closest("[data-filter]");if(f){state.filter=f.getAttribute("data-filter");render();return}
 var lv=e.target.closest("[data-library-view]");if(lv){setLibraryView(lv.getAttribute("data-library-view"));render();return}
 var lb=e.target.closest("[data-library-book]");if(lb){var lbook=visible().find(function(x){return x.id===lb.getAttribute("data-library-book")});if(lbook)openCollectorBook(lbook);return}

 var bg=e.target.closest("[data-browse-genre]");if(bg){state.browseGenre=bg.getAttribute("data-browse-genre");save();render();return}
 var bf=e.target.closest("[data-browse-filter]");if(bf){state.browseFilter=bf.getAttribute("data-browse-filter");save();render();return}
 var sb=e.target.closest("[data-stack-id]");if(sb){var bk=visible().find(function(x){return x.id===sb.getAttribute("data-stack-id")});if(bk)openCollectorBook(bk);return}

 var st=e.target.closest("[data-series-toggle]");if(st){toggleSeriesOwned(st.getAttribute("data-series-toggle"),st.getAttribute("data-series-title"));return}
 var sc=e.target.closest("[data-series-scan]");if(sc){catalogSeriesCopy(sc.getAttribute("data-series-scan"),sc.getAttribute("data-series-title"),sc.getAttribute("data-series-no"));return}
 var sf=e.target.closest("[data-series-find]");if(sf){findSeriesLineup(sf.getAttribute("data-series-find"),sf.getAttribute("data-series-author")||"");return}
 var se=e.target.closest("[data-series-edit]");if(se){openSeriesEditor(se.getAttribute("data-series-edit"));return}
 var mb=e.target.closest("[data-missing-series]");if(mb){openMissing(mb.getAttribute("data-missing-series"),mb.getAttribute("data-missing-title"),mb.getAttribute("data-missing-no"));return}
 var sv=e.target.closest("[data-shelf-view]");if(sv){e.stopPropagation();var vb=visible().find(function(x){return x.id===sv.getAttribute("data-shelf-view")});if(vb)openCollectorBook(vb);return}
 var se2=e.target.closest("[data-shelf-edit]");if(se2){e.stopPropagation();var eb=visible().find(function(x){return x.id===se2.getAttribute("data-shelf-edit")});if(eb)openBook(eb);return}

 var wv=e.target.closest("[data-wish-view]");if(wv){e.stopPropagation();var wb=visible().find(function(x){return x.id===wv.getAttribute("data-wish-view")});if(wb)openCollectorBook(wb);return}
 var we=e.target.closest("[data-wish-edit]");if(we){e.stopPropagation();var web=visible().find(function(x){return x.id===we.getAttribute("data-wish-edit")});if(web)openWish(web);return}
 var wo=e.target.closest("[data-wish-open]");if(wo){var wob=visible().find(function(x){return x.id===wo.getAttribute("data-wish-open")});if(wob)openCollectorBook(wob);return}

 var gj=e.target.closest("[data-goto]");if(gj){state.view=gj.getAttribute("data-goto");save();render();return}
 var vj=e.target.closest("[data-view-jump]");if(vj){state.view=vj.getAttribute("data-view-jump");save();render();return}

 var c=e.target.closest(".card");if(c){var b=visible().find(function(x){return x.id===c.getAttribute("data-id")});if(b)openCollectorBook(b);return}
});
el("#addBtn").onclick=openBookshopIntake;el("#scanBtn").onclick=openGuardian;el("#closeModal").onclick=closeModal;el("#modal").onclick=function(e){if(e.target.id==="modal")closeModal()};el("#search").oninput=function(){if(state.view!=="library")state.view="library";render()};
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferredInstall=e;el("#installBtn").classList.remove("hidden")});el("#installBtn").onclick=async function(){if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;el("#installBtn").classList.add("hidden")}};
if("serviceWorker"in navigator)window.addEventListener("load",function(){navigator.serviceWorker.register("./sw.js").catch(function(){})});
render();
})();

(function setupMobileShell(){
 var scan=document.getElementById("mobileScanBtn"),more=document.getElementById("mobileMoreBtn"),sheet=document.getElementById("mobileMore"),mobileNav=document.getElementById("mobileNav");
 function closeMore(){if(sheet)sheet.classList.add("hidden")}
 if(scan)scan.addEventListener("click",function(){var real=document.getElementById("scanBtn");if(real)real.click()});
 if(more)more.addEventListener("click",function(){if(sheet)sheet.classList.remove("hidden")});
 var close=document.getElementById("mobileMoreClose"),shade=document.getElementById("mobileMoreShade");
 if(close)close.addEventListener("click",closeMore);
 if(shade)shade.addEventListener("click",closeMore);
 if(sheet)sheet.querySelectorAll("[data-view]").forEach(function(b){b.addEventListener("click",closeMore)});
})();
