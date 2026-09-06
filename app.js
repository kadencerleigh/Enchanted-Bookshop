(function(){
"use strict";
var KEY="enchanted-bookshop-v3", SERIES_KEY="enchanted-bookshop-series-v4", SYNC_KEY="enchanted-bookshop-sync", deferredInstall=null;
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
 return '<article class="card" data-id="'+esc(b.id)+'"><div class="cover">'+(b.cover?'<img src="'+esc(b.cover)+'" alt="">':esc(b.title))+'</div><div class="info"><div class="bt">'+esc(b.title)+'</div><div class="muted">'+esc(b.author)+'</div>'+(b.series?'<div class="muted">'+esc(b.series)+(b.seriesNo?' • #'+esc(b.seriesNo):'')+'</div>':'')+'<div>'+tags.map(function(t){return'<span class="tag">'+esc(t)+'</span>'}).join("")+'</div>'+(b.rating?'<div class="muted">'+stars(b.rating)+'</div>':'')+'<div class="muted">'+spice(b.spice||0)+' · '+esc((b.edition&&b.edition.format)||"Edition")+'</div></div></article>'
}
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
function home(){
 var o=owned(),read=o.filter(function(b){return b.status==="read"}),fav=o.filter(function(b){return b.favorite}),series={};o.forEach(function(b){if(b.series)series[b.series]=1});
 return '<div class="hero"><div class="eyebrow">Welcome home</div><h1 class="title">Your enchanted bookshop.</h1><p class="sub">V3 is a proper installable PWA foundation: offline-ready, camera-ready, local-first, and built with optional cross-device sync.</p><div class="toolbar"><button class="primary" id="homeScan">📷 Shopping Scanner</button><button class="pill" data-goto="sync">☁️ Set up sync</button></div></div>'+
 '<div class="stats"><div class="stat"><b>'+o.length+'</b><span>Owned</span></div><div class="stat"><b>'+read.length+'</b><span>Read</span></div><div class="stat"><b>'+fav.length+'</b><span>Favorites</span></div><div class="stat"><b>'+Object.keys(series).length+'</b><span>Series</span></div><div class="stat"><b>'+visible().filter(function(b){return b.wantOwn}).length+'</b><span>Want to Own</span></div></div>'+
 '<h2>Recently added</h2><div class="grid">'+(o.slice().reverse().slice(0,6).map(card).join("")||'<div class="empty">Your shelves are waiting. ✨</div>')+'</div>'
}
function library(){
 var b=filtered(),names={all:"All",favorites:"⭐ Favorites",tbr:"📖 Unread",read:"✅ Read",spicy:"🌶️ Spicy"};
 return '<div class="eyebrow">The collection</div><h1 class="title">My Library</h1><div class="toolbar">'+Object.keys(names).map(function(k){return'<button class="pill '+(state.filter===k?"active":"")+'" data-filter="'+k+'">'+names[k]+'</button>'}).join("")+'</div><div class="grid">'+(b.map(card).join("")||'<div class="empty">No books match that filter.</div>')+'</div>'
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
function series(){
 var map={};owned().filter(function(b){return b.series}).forEach(function(b){if(!map[b.series])map[b.series]=[];map[b.series].push(b)});
 seriesCatalog.filter(function(s){return !s.deleted}).forEach(function(s){if(!map[s.name])map[s.name]=[]});
 var names=Object.keys(map).sort();
 if(!names.length)return '<div class="eyebrow">Your shelves by story</div><h1 class="title">Series Brain™</h1><div class="empty">Add a series name to a book and it will appear here.</div>';
 return '<div class="eyebrow">V4.1 • Series Brain™</div><h1 class="title">Series</h1><p class="sub">Three states: ✅ cataloged, 📚 owned but not cataloged, and ❌ genuinely missing.</p>'+
 names.map(function(name){
  var a=map[name].slice().sort(function(x,y){return(+x.seriesNo||0)-(+y.seriesNo||0)}),cat=getSeries(name);
  if(!cat)return '<div class="seriesrow"><h3>'+esc(name)+'</h3><div class="muted">'+a.length+' cataloged • full lineup not added yet</div><div class="toolbar"><button class="primary" data-series-edit="'+esc(name)+'">🧠 Add series lineup</button></div><div class="grid">'+a.map(card).join("")+'</div></div>';
  var total=cat.books.length,cataloged=cat.books.filter(function(x){return catalogedSeriesEntry(x,a)}).length,ownedCount=cat.books.filter(function(x){return ownedSeriesEntry(x,a)}).length,missing=total-ownedCount;
  var ownPct=Math.round(total?ownedCount/total*100:0),catPct=Math.round(total?cataloged/total*100:0);
  var rows=cat.books.slice().sort(function(x,y){return(+x.number||999)-(+y.number||999)}).map(function(x){
   var st=seriesState(x,a),icon=st==="cataloged"?"✅":st==="owned"?"📚":"❌",label=st==="cataloged"?"Cataloged":st==="owned"?"Owned • needs cataloging":"Missing";
   var action=st==="cataloged"?'':st==="owned"?'<button class="pill" data-series-scan="'+esc(name)+'" data-series-title="'+esc(x.title)+'" data-series-no="'+esc(x.number||"")+'">📷 Catalog copy</button><button class="tiny danger" data-series-toggle="'+esc(name)+'" data-series-title="'+esc(x.title)+'">Mark missing</button>':'<button class="pill" data-series-toggle="'+esc(name)+'" data-series-title="'+esc(x.title)+'">📚 I own this</button>';
   return '<div class="seriesbook '+st+'vol"><b>'+icon+' '+(x.number?'#'+esc(x.number)+' ':'')+esc(x.title)+'</b><span>'+esc(x.type||"Main novel")+' • '+label+'</span><div class="seriesactions">'+action+'</div></div>'
  }).join("");
  var complete=total&&ownedCount===total?'<div class="complete">✨ Collection complete! Every volume is owned.</div>':'<div class="muted">'+missing+' genuinely missing</div>';
  return '<div class="seriesrow"><div class="serieshead"><div><h3>'+esc(name)+'</h3><div class="seriesstats"><b>📚 '+ownedCount+'/'+total+' owned</b><b>✨ '+cataloged+'/'+total+' cataloged</b></div>'+complete+'</div><button class="pill" data-series-edit="'+esc(name)+'">✏️ Edit lineup</button></div><label class="progresslabel">Owned</label><div class="progress"><i style="width:'+ownPct+'%"></i></div><label class="progresslabel">Cataloged</label><div class="progress catalogprogress"><i style="width:'+catPct+'%"></i></div><div class="serieslist">'+rows+'</div></div>'
 }).join("")
}
function openSeriesEditor(name){
 var existing=getSeries(name),books=existing?existing.books:owned().filter(function(b){return norm(b.series)===norm(name)}).map(function(b){return{number:b.seriesNo||"",title:b.title,type:"Main novel",ownedUncataloged:false}}).sort(function(a,b){return(+a.number||0)-(+b.number||0)});
 el("#modalBody").innerHTML='<div class="eyebrow">Series Brain™</div><h1 class="title">'+esc(name)+'</h1><p class="sub">One book per line: <b>number | title | type</b>. Ownership is managed from the Series page after saving.</p><div class="field full"><label>Series lineup</label><textarea id="seriesLines" style="min-height:300px">'+esc(books.map(function(x){return[x.number,x.title,x.type||"Main novel"].join(" | ")}).join("\\n"))+'</textarea></div><div class="actions"><button class="primary" id="saveSeriesLineup">Save lineup</button></div>';
 el("#modal").classList.remove("hidden");
 el("#saveSeriesLineup").onclick=function(){
  var previous={};books.forEach(function(x){previous[norm(x.title)]=!!x.ownedUncataloged});
  var lines=el("#seriesLines").value.split(/\n/).map(function(x){return x.trim()}).filter(Boolean),parsed=lines.map(function(line){var q=line.split("|").map(function(x){return x.trim()});var title=q[1]||q[0]||"";return{number:q[0]||"",title:title,type:q[2]||"Main novel",ownedUncataloged:previous[norm(title)]||false}}).filter(function(x){return x.title});
  var obj={id:seriesId(name),name:name,books:parsed,updatedAt:now(),deleted:false},ix=seriesCatalog.findIndex(function(s){return s.id===obj.id});if(ix>=0)seriesCatalog[ix]=obj;else seriesCatalog.push(obj);
  saveSeries();closeModal();render();autoSyncSeriesMaybe()
 }
}
function toggleSeriesOwned(name,title){
 var cat=getSeries(name);if(!cat)return;var entry=cat.books.find(function(x){return norm(x.title)===norm(title)});if(!entry)return;
 entry.ownedUncataloged=!entry.ownedUncataloged;cat.updatedAt=now();saveSeries();render();autoSyncSeriesMaybe()
}
function catalogSeriesCopy(name,title,no){
 state.view="library";render();openBook({id:"",workId:"",title:title,author:"",genres:[],series:name,seriesNo:no,status:"want-to-read",owned:true,wantOwn:false,rating:0,favorite:false,spice:0,edition:{isbn:"",format:"Paperback",publisher:"",publicationDate:"",pages:"",printing:"",special:[]},notes:""});
}
function openMissing(name,title,no){catalogSeriesCopy(name,title,no)}
function shelf(title,a){return'<div class="eyebrow">Your shelves</div><h1 class="title">'+title+'</h1><div class="grid">'+(a.map(card).join("")||'<div class="empty">Nothing here yet. ✨</div>')+'</div>'}
function backup(){
 return '<div class="eyebrow">Never lose your library</div><h1 class="title">Backup & Data</h1><div class="split"><div class="box"><h3>💾 Export backup</h3><p class="sub">Save everything as JSON.</p><button class="primary" id="exportBtn">Export JSON</button></div><div class="box"><h3>📥 Restore backup</h3><input type="file" id="restoreFile" accept=".json"></div></div>'
}
function getSync(){var s={url:"",anon:"",email:"",token:"",refresh:"",auto:false,userId:""};try{Object.assign(s,JSON.parse(localStorage.getItem(SYNC_KEY))||{})}catch(e){}return s}
function putSync(s){localStorage.setItem(SYNC_KEY,JSON.stringify(s))}
function syncPage(){
 var s=getSync(), signed=!!s.token;
 return '<div class="eyebrow">Optional cross-device cloud</div><h1 class="title">Sync</h1><p class="sub">Your bookshop always works locally first. For phone ↔ Windows sync, V3 can connect to your own Supabase project. That keeps the cloud account under your control.</p>'+
 '<div class="box"><h3>1. Connect your project</h3><div class="form"><div class="field full"><label>Supabase project URL</label><input id="syncUrl" placeholder="https://xxxxx.supabase.co" value="'+esc(s.url)+'"></div><div class="field full"><label>Anon / publishable key</label><input id="syncAnon" type="password" placeholder="eyJ..." value="'+esc(s.anon)+'"></div></div><div class="actions"><button class="primary" id="saveSyncConfig">Save connection</button></div></div>'+
 '<div class="box"><h3>2. Your sync account</h3><div class="form"><div class="field"><label>Email</label><input id="syncEmail" type="email" value="'+esc(s.email)+'"></div><div class="field"><label>Password</label><input id="syncPassword" type="password" placeholder="••••••••"></div></div><div class="actions">'+(signed?'<button class="danger" id="signOut">Sign out</button>':'<button class="pill" id="signUp">Create account</button><button class="primary" id="signIn">Sign in</button>')+'</div><div id="syncAuthStatus" class="syncstatus '+(signed?"ok":"")+'">'+(signed?'☁️ Signed in — sync is available.':'Not signed in yet.')+'</div></div>'+
 '<div class="box"><h3>3. Sync your library</h3><p class="tiny">Sync merges by book ID and keeps the newest update. Deletions are synced too. Your local copy remains available offline.</p><label><input type="checkbox" id="autoSync" '+(s.auto?"checked":"")+'> Auto-sync after local changes when online</label><div class="actions"><button class="pill" id="pullSync">☁️ Pull + merge</button><button class="primary" id="pushSync">☁️ Sync now</button></div><div id="syncRunStatus" class="syncstatus">Ready.</div></div>'+
 '<div class="box"><h3>Server setup</h3><p class="tiny">The included <b>SUPABASE_SETUP.sql</b> file creates the table and row-level security rules required for this app. Run it once in your Supabase SQL editor before syncing.</p></div>'
}
function render(){
 document.querySelectorAll("[data-view]").forEach(function(b){b.classList.toggle("active",b.getAttribute("data-view")===state.view)});
 var c=el("#content");
 if(state.view==="home")c.innerHTML=home();
 else if(state.view==="library")c.innerHTML=library();
 else if(state.view==="series")c.innerHTML=series();
 else if(state.view==="wishlist")c.innerHTML=shelf("✨ Want to Own",visible().filter(function(b){return b.wantOwn}));
 else if(state.view==="tbr")c.innerHTML=shelf("📖 Want to Read",visible().filter(function(b){return b.status==="want-to-read"}));
 else if(state.view==="favorites")c.innerHTML=shelf("⭐ Favorites",visible().filter(function(b){return b.favorite}));
 else if(state.view==="backup")c.innerHTML=backup();
 else if(state.view==="sync")c.innerHTML=syncPage();
 wirePage()
}
function field(label,name,value,required,full){return'<div class="field '+(full?"full":"")+'"><label>'+label+'</label><input name="'+name+'" '+(required?"required":"")+' value="'+esc(value||"")+'"></div>'}
function selectField(label,name,opts,value){return'<div class="field"><label>'+label+'</label><select name="'+name+'">'+opts.map(function(x){return'<option value="'+esc(x)+'" '+(x===value?"selected":"")+'>'+esc(x.replace(/-/g," "))+'</option>'}).join("")+'</select></div>'}
function checkbox(name,label,checked){return'<div class="field"><label style="text-transform:none"><input type="checkbox" name="'+name+'" '+(checked?"checked":"")+'> '+label+'</label></div>'}
function openBook(b){
 b=b||{id:"",workId:"",title:"",author:"",genres:[],series:"",seriesNo:"",status:"want-to-read",owned:true,wantOwn:false,rating:0,favorite:false,spice:0,edition:{isbn:"",format:"Paperback",publisher:"",publicationDate:"",pages:"",printing:"",special:[]},notes:""};var e=b.edition||{};
 el("#modalBody").innerHTML='<div class="eyebrow">'+(b.id?"Edit copy":"Add to collection")+'</div><h1 class="title">'+(b.id?"Edit Book":"A New Book")+'</h1><form id="bookForm"><div class="form">'+
 field("Title","title",b.title,true)+field("Author","author",b.author)+field("Genres","genres",(b.genres||[]).join(", "))+field("Series","series",b.series)+field("Series number","seriesNo",b.seriesNo)+
 selectField("Reading status","status",["want-to-read","currently-reading","read","dnf","rereading"],b.status)+selectField("Rating","rating",["0","1","2","3","4","5"],String(b.rating||0))+selectField("Spice","spice",["0","1","2","3","4","5"],String(b.spice||0))+
 field("ISBN","isbn",e.isbn)+selectField("Format","format",["Paperback","Hardcover","Box Set","Ebook","Audiobook","Other"],e.format||"Paperback")+field("Publisher","publisher",e.publisher)+field("Publication date","publicationDate",e.publicationDate)+field("Page count","pages",e.pages)+field("Printing","printing",e.printing)+field("Special features","special",(e.special||[]).join(", "),"",true)+
 '<div class="field full"><label>Notes</label><textarea name="notes">'+esc(b.notes||"")+'</textarea></div>'+checkbox("owned","I own this physical copy",b.owned)+checkbox("wantOwn","I want to own this",b.wantOwn)+checkbox("favorite","Favorite",b.favorite)+'</div><div class="actions">'+(b.id?'<button type="button" class="danger" id="deleteBtn">Delete</button>':'')+'<button class="primary" type="submit">'+(b.id?"Save changes":"Add to bookshop")+'</button></div></form>';
 el("#modal").classList.remove("hidden");
 el("#bookForm").onsubmit=function(ev){ev.preventDefault();var f=new FormData(ev.target),n={id:b.id||uid(),workId:b.workId||uid(),title:f.get("title"),author:f.get("author"),cover:b.cover||"",genres:String(f.get("genres")||"").split(",").map(function(x){return x.trim()}).filter(Boolean),series:f.get("series"),seriesNo:f.get("seriesNo"),status:f.get("status"),rating:+f.get("rating"),spice:+f.get("spice"),owned:f.has("owned"),wantOwn:f.has("wantOwn"),favorite:f.has("favorite"),notes:f.get("notes"),edition:{isbn:f.get("isbn"),format:f.get("format"),publisher:f.get("publisher"),publicationDate:f.get("publicationDate"),pages:f.get("pages"),printing:f.get("printing"),special:String(f.get("special")||"").split(",").map(function(x){return x.trim()}).filter(Boolean)},updatedAt:now(),deleted:false};var ix=state.books.findIndex(function(x){return x.id===n.id});if(ix>=0)state.books[ix]=n;else state.books.push(n);save();closeModal();render();autoSyncMaybe()};
 if(b.id)el("#deleteBtn").onclick=function(){if(confirm("Remove this copy from your bookshop?")){var x=state.books.find(function(x){return x.id===b.id});x.deleted=true;x.updatedAt=now();save();closeModal();render();autoSyncMaybe()}}
}
var scannerStream=null,scannerTimer=null,detector=null,busy=false;
function openGuardian(){
 stopScanner();el("#modalBody").innerHTML='<div class="eyebrow">V3 • Shopping Guardian</div><h1 class="title">Scan a book</h1><p class="sub">Use the camera barcode reader on supported browsers, or enter the ISBN manually.</p><div class="camera" id="cameraBox"><div class="muted">📷 Camera is off.</div></div><div class="toolbar"><button class="primary" id="startCam">📷 Start Camera</button><button class="pill hidden" id="stopCam">Stop</button></div><div class="field full"><label>ISBN</label><div class="lookuprow"><input id="isbnInput" inputmode="numeric" placeholder="9780062059932"><button class="primary" id="lookupBtn">Identify</button></div></div><div id="guardianResult"></div>';
 el("#modal").classList.remove("hidden");el("#startCam").onclick=startScanner;el("#stopCam").onclick=stopScanner;el("#lookupBtn").onclick=lookupISBN;el("#isbnInput").onkeydown=function(e){if(e.key==="Enter")lookupISBN()}
}
async function startScanner(){
 var r=el("#guardianResult");if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){r.innerHTML='<div class="guardian purple"><h3>Camera unavailable here</h3><div class="muted">Install/open the hosted PWA over HTTPS. Manual ISBN still works.</div></div>';return}
 if(!("BarcodeDetector" in window)){r.innerHTML='<div class="guardian purple"><h3>Barcode detection unavailable</h3><div class="muted">This browser does not expose automatic barcode detection. Manual ISBN still works.</div></div>';return}
 try{var f=await BarcodeDetector.getSupportedFormats();var wanted=["ean_13","ean_8","upc_a","upc_e"].filter(function(x){return f.indexOf(x)>=0});detector=new BarcodeDetector({formats:wanted.length?wanted:f});scannerStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}}});el("#cameraBox").innerHTML='<video id="scanVideo" playsinline autoplay muted></video><div class="guide"></div>';var v=el("#scanVideo");v.srcObject=scannerStream;await v.play();el("#startCam").classList.add("hidden");el("#stopCam").classList.remove("hidden");scannerTimer=setInterval(scanFrame,350)}catch(e){r.innerHTML='<div class="guardian red"><h3>Camera could not start</h3><div class="muted">'+esc(e.message||"Check permission.")+'</div></div>'}
}
async function scanFrame(){if(busy||!detector||!el("#scanVideo"))return;var v=el("#scanVideo");if(v.readyState<2)return;busy=true;try{var cs=await detector.detect(v);for(var i=0;i<cs.length;i++){var raw=cleanISBN(cs[i].rawValue);if((raw.length===13&&(raw.indexOf("978")===0||raw.indexOf("979")===0))||raw.length===10){el("#isbnInput").value=raw;stopScanner();if(navigator.vibrate)navigator.vibrate(100);lookupISBN();break}}}catch(e){}busy=false}
function stopScanner(){if(scannerTimer){clearInterval(scannerTimer);scannerTimer=null}if(scannerStream){scannerStream.getTracks().forEach(function(t){t.stop()});scannerStream=null}detector=null;busy=false;var b=el("#cameraBox");if(b)b.innerHTML='<div class="muted">📷 Camera is off.</div>';if(el("#startCam"))el("#startCam").classList.remove("hidden");if(el("#stopCam"))el("#stopCam").classList.add("hidden")}
async function lookupISBN(){
 var isbn=cleanISBN(el("#isbnInput").value),r=el("#guardianResult");if(isbn.length!==10&&isbn.length!==13){r.innerHTML='<div class="guardian red"><h3>ISBN looks incomplete</h3></div>';return}r.innerHTML='<div class="syncstatus">🔮 Identifying...</div>';var found=null,source="";
 try{var g=await fetch("https://www.googleapis.com/books/v1/volumes?q=isbn:"+encodeURIComponent(isbn));if(g.ok){var j=await g.json();if(j.items&&j.items.length){var v=j.items[0].volumeInfo||{};found={title:v.title||"",author:(v.authors||[]).join(", "),genres:v.categories||[],cover:(v.imageLinks&&(v.imageLinks.thumbnail||v.imageLinks.smallThumbnail))||"",edition:{isbn:isbn,format:"",publisher:v.publisher||"",publicationDate:v.publishedDate||"",pages:v.pageCount||"",printing:"",special:[]}};source="Google Books"}}}catch(e){}
 if(!found)try{var o=await fetch("https://openlibrary.org/isbn/"+isbn+".json");if(o.ok){var q=await o.json();found={title:q.title||"",author:"",genres:q.subjects||[],cover:"https://covers.openlibrary.org/b/isbn/"+isbn+"-L.jpg",edition:{isbn:isbn,format:q.physical_format||"",publisher:(q.publishers||[]).join(", "),publicationDate:q.publish_date||"",pages:q.number_of_pages||"",printing:"",special:[]}};source="Open Library"}}catch(e){}
 if(!found){r.innerHTML='<div class="guardian purple"><h3>🟣 Could not identify automatically</h3><div class="actions"><button class="primary" id="manualAdd">Add manually</button></div></div>';el("#manualAdd").onclick=function(){openBook({id:"",workId:"",title:"",author:"",genres:[],series:"",seriesNo:"",status:"want-to-read",owned:true,wantOwn:false,rating:0,favorite:false,spice:0,edition:{isbn:isbn,format:"Paperback",publisher:"",publicationDate:"",pages:"",printing:"",special:[]},notes:""})};return}
 showMatch(found,source)
}
function showMatch(f,source){
 var isbn=cleanISBN(f.edition.isbn),exact=visible().find(function(b){return cleanISBN(b.edition&&b.edition.isbn)===isbn&&isbn}),same=visible().find(function(b){return norm(b.title)===norm(f.title)&&(!f.author||!b.author||norm(b.author)===norm(f.author))}),r=el("#guardianResult");
 if(exact){r.innerHTML='<div class="guardian red"><div class="eyebrow">Exact ISBN match</div><h3>🚨 YOU ALREADY OWN THIS EXACT EDITION</h3><div class="compare"><div><b>Your copy</b><div class="muted">'+esc(exact.title)+'<br>'+esc(exact.author)+'<br>'+esc(exact.edition.format||"")+'<br>'+esc(isbn)+'</div></div><div><b>In your hand</b><div class="muted">'+esc(f.title)+'<br>'+esc(f.author)+'<br>'+esc(f.edition.format||"")+'<br>'+esc(isbn)+'</div></div></div><div class="tiny">Metadata: '+esc(source)+'</div></div>';return}
 if(same){r.innerHTML='<div class="guardian yellow"><div class="eyebrow">Same work • different edition</div><h3>🟡 WAITTTT — DIFFERENT EDITION</h3><div class="compare"><div><b>Your copy</b><div class="muted">'+esc(same.edition.format||"Unknown")+'<br>'+esc(same.edition.isbn||"No ISBN saved")+'</div></div><div><b>In your hand</b><div class="muted">'+esc(f.edition.format||"Unknown")+'<br>'+esc(isbn)+'</div></div></div><div class="actions"><button class="primary" id="addFound">Add this edition</button></div></div>';el("#addFound").onclick=function(){prefill(f)};return}
 r.innerHTML='<div class="guardian green"><h3>🟢 NEW TO YOUR LIBRARY ✨</h3><div class="muted">'+esc(f.title)+'<br>'+esc(f.author)+'<br>'+esc(isbn)+'</div><div class="actions"><button class="primary" id="addFound">Add to bookshop</button></div></div>';el("#addFound").onclick=function(){prefill(f)}
}
function prefill(f){openBook({id:"",workId:"",title:f.title||"",author:f.author||"",genres:f.genres||[],series:"",seriesNo:"",status:"want-to-read",owned:true,wantOwn:false,rating:0,favorite:false,spice:0,cover:f.cover||"",edition:f.edition,notes:""})}
function closeModal(){stopScanner();el("#modal").classList.add("hidden")}
function exportJSON(){var blob=new Blob([JSON.stringify({app:"Enchanted Bookshop",version:3,exported:now(),books:state.books},null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="enchanted-bookshop-v3-backup.json";document.body.appendChild(a);a.click();a.remove()}
function restoreJSON(file){if(!file)return;var r=new FileReader();r.onload=function(){try{var x=JSON.parse(r.result);if(!Array.isArray(x.books))throw Error("Invalid");state.books=x.books;save();render();alert("Restored ✨")}catch(e){alert("That backup could not be read.")}};r.readAsText(file)}
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
async function syncNow(){
 var st=el("#syncRunStatus");if(st){st.className="syncstatus";st.textContent="☁️ Syncing..."}try{
  var s=getSync();if(!s.userId)throw Error("Sign in first.");
  var remoteRes=await api("enchanted_books?select=id,data,updated_at,deleted",{method:"GET"}),remote=await remoteRes.json(),map={};
  state.books.forEach(function(b){map[b.id]=b});remote.forEach(function(row){var rb=row.data||{};rb.id=row.id;rb.updatedAt=row.updated_at;rb.deleted=!!row.deleted;var lb=map[rb.id];if(!lb||new Date(rb.updatedAt)>new Date(lb.updatedAt||0))map[rb.id]=rb});
  state.books=Object.keys(map).map(function(k){return map[k]});save();
  var payload=state.books.map(function(b){return{id:b.id,user_id:s.userId,data:b,updated_at:b.updatedAt||now(),deleted:!!b.deleted}});
  if(payload.length)await api("enchanted_books?on_conflict=id",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(payload)});
  save();render();if(state.view==="sync"&&el("#syncRunStatus")){el("#syncRunStatus").className="syncstatus ok";el("#syncRunStatus").textContent="☁️ Synced successfully."}
 }catch(e){if(st){st.className="syncstatus bad";st.textContent=e.message}else alert(e.message)}
}
async function pullSync(){await syncNow()}
async function syncSeries(){
 var s=getSync();if(!s.token||!s.userId)return;
 var rr=await api("enchanted_series?select=id,data,updated_at,deleted",{method:"GET"}),remote=await rr.json(),map={};
 seriesCatalog.forEach(function(x){map[x.id]=x});remote.forEach(function(row){var x=row.data||{};x.id=row.id;x.updatedAt=row.updated_at;x.deleted=!!row.deleted;var l=map[x.id];if(!l||new Date(x.updatedAt)>new Date(l.updatedAt||0))map[x.id]=x});
 seriesCatalog=Object.keys(map).map(function(k){return map[k]}).filter(function(x){return !x.deleted});saveSeries();
 var payload=seriesCatalog.map(function(x){return{id:x.id,user_id:s.userId,data:x,updated_at:x.updatedAt||now(),deleted:!!x.deleted}});
 if(payload.length)await api("enchanted_series?on_conflict=id",{method:"POST",headers:{"Prefer":"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(payload)});
}
var originalSyncNow=syncNow;
syncNow=async function(){await originalSyncNow();try{await syncSeries()}catch(e){console.warn(e)}if(state.view==="series")render()}
function autoSyncMaybe(){var s=getSync();if(s.auto&&navigator.onLine&&s.token)setTimeout(syncNow,250)}
function autoSyncSeriesMaybe(){var s=getSync();if(s.auto&&navigator.onLine&&s.token)setTimeout(syncSeries,250)}
function wirePage(){
 if(el("#homeScan"))el("#homeScan").onclick=openGuardian;
 document.querySelectorAll("[data-goto]").forEach(function(b){b.onclick=function(){state.view=b.getAttribute("data-goto");save();render()}});
 if(el("#exportBtn"))el("#exportBtn").onclick=exportJSON;
 if(el("#restoreFile"))el("#restoreFile").onchange=function(e){restoreJSON(e.target.files[0])};
 if(el("#saveSyncConfig"))el("#saveSyncConfig").onclick=function(){var s=getSync();s.url=el("#syncUrl").value.replace(/\/$/,"");s.anon=el("#syncAnon").value;putSync(s);el("#syncAuthStatus").textContent="Connection saved."};
 if(el("#signIn"))el("#signIn").onclick=signIn;if(el("#signUp"))el("#signUp").onclick=signUp;
 if(el("#signOut"))el("#signOut").onclick=function(){var s=getSync();s.token="";s.refresh="";s.userId="";putSync(s);render()};
 if(el("#autoSync"))el("#autoSync").onchange=function(){var s=getSync();s.auto=this.checked;putSync(s)};
 if(el("#pushSync"))el("#pushSync").onclick=syncNow;if(el("#pullSync"))el("#pullSync").onclick=pullSync
}
document.addEventListener("click",function(e){
 var v=e.target.closest("[data-view]");if(v){state.view=v.getAttribute("data-view");state.filter="all";save();render();return}
 var f=e.target.closest("[data-filter]");if(f){state.filter=f.getAttribute("data-filter");render();return}
 var st=e.target.closest("[data-series-toggle]");if(st){toggleSeriesOwned(st.getAttribute("data-series-toggle"),st.getAttribute("data-series-title"));return}
 var sc=e.target.closest("[data-series-scan]");if(sc){catalogSeriesCopy(sc.getAttribute("data-series-scan"),sc.getAttribute("data-series-title"),sc.getAttribute("data-series-no"));return}
 var se=e.target.closest("[data-series-edit]");if(se){openSeriesEditor(se.getAttribute("data-series-edit"));return}
 var mb=e.target.closest("[data-missing-series]");if(mb){openMissing(mb.getAttribute("data-missing-series"),mb.getAttribute("data-missing-title"),mb.getAttribute("data-missing-no"));return}
 var c=e.target.closest(".card");if(c){var b=visible().find(function(x){return x.id===c.getAttribute("data-id")});if(b)openBook(b)}
});
el("#addBtn").onclick=function(){openBook()};el("#scanBtn").onclick=openGuardian;el("#closeModal").onclick=closeModal;el("#modal").onclick=function(e){if(e.target.id==="modal")closeModal()};el("#search").oninput=function(){if(state.view!=="library")state.view="library";render()};
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();deferredInstall=e;el("#installBtn").classList.remove("hidden")});el("#installBtn").onclick=async function(){if(deferredInstall){deferredInstall.prompt();await deferredInstall.userChoice;deferredInstall=null;el("#installBtn").classList.add("hidden")}};
if("serviceWorker"in navigator)window.addEventListener("load",function(){navigator.serviceWorker.register("./sw.js").catch(function(){})});
render();
})();