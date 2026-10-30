import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Home, BookOpen, Clock3, Compass, Heart, Headphones, Bookmark, Search, Settings,
  Moon, Sun, Menu, X, ChevronRight, ChevronLeft, Play, Pause, RotateCcw, Plus,
  Minus, CalendarDays, Sparkles, BookMarked, HandHeart, Library, ScrollText,
  CircleHelp, Download, ExternalLink, ArrowLeft, Languages, Check, Copy, MapPin,
  Timer, Target, NotebookPen, ListChecks, Volume2, Globe, Smartphone, Search as SearchIcon
} from 'lucide-react';
import surahs from './surahs.json';
import './style.css';

const A=`${import.meta.env.BASE_URL}assets/`;
const readStore=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)) ?? d}catch{return d}};
const saveStore=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const navItems=[
 ['home','হোম','Home',Home],['quran','কুরআন','Quran',BookOpen],['prayer','নামাজের সময়','Prayer',Clock3],
 ['qibla','কিবলা','Qibla',Compass],['tasbih','তাসবিহ','Tasbih',CircleHelp],
 ['duas','দোয়া','Duas',HandHeart],['hadith','হাদিস','Hadith',ScrollText],
 ['sunnah','সুন্নাহ','Sunnah',Sparkles],['ruqyah','রুকইয়াহ','Ruqyah',Heart],
 ['names','আল্লাহর নাম','Names',Library],['journal','জার্নাল','Journal',NotebookPen],
 ['khatam','খতম ট্র্যাকার','Khatam',Target],['listen','তিলাওয়াত','Listen',Headphones],
 ['settings','সেটিংস','Settings',Settings]
];
function App(){
 const [page,setPage]=useState('home');
 const [dark,setDark]=useState(readStore('annur-theme','dark')==='dark');
 const [lang,setLang]=useState(readStore('annur-lang','bn'));
 const [mobileMenu,setMobileMenu]=useState(false);
 const [lastPage,setLastPage]=useState(readStore('annur-last-page',2));
 const [bookmarks,setBookmarks]=useState(readStore('annur-bookmarks',[]));
 const [tasbih,setTasbih]=useState(readStore('annur-tasbih',0));
 const [goal,setGoal]=useState(readStore('annur-goal',100));
 const [journal,setJournal]=useState(readStore('annur-journal',[]));
 const [khatam,setKhatam]=useState(readStore('annur-khatam',0));
 const [search,setSearch]=useState('');
 const [toast,setToast]=useState('');
 const [selectedSurah,setSelectedSurah]=useState(null);
 const [readerPage,setReaderPage]=useState(lastPage);
 const [prayer,setPrayer]=useState(null);
 const [location,setLocation]=useState(readStore('annur-location',null));
 const [audioPlaying,setAudioPlaying]=useState(false);
 const [audioSurah,setAudioSurah]=useState(1);
 const [journalDraft,setJournalDraft]=useState('');
 const [journalTitle,setJournalTitle]=useState('');
 const [showNewJournal,setShowNewJournal]=useState(false);
 const [qibla,setQibla]=useState(null);
 const [orientation,setOrientation]=useState(null);
 const [activeDua,setActiveDua]=useState(null);
 const [hadithBook,setHadithBook]=useState('all');
 const [hadithData,setHadithData]=useState([]);
 const [hadithSections,setHadithSections]=useState({});
 const [sunnahData,setSunnahData]=useState([]);
 const [ruqyahData,setRuqyahData]=useState({});
 const [namesData,setNamesData]=useState([]);
 const [loadingData,setLoadingData]=useState(true);

 useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';saveStore('annur-theme',dark?'dark':'light')},[dark]);
 useEffect(()=>{saveStore('annur-lang',lang)},[lang]);
 useEffect(()=>{saveStore('annur-last-page',lastPage)},[lastPage]);
 useEffect(()=>saveStore('annur-bookmarks',bookmarks),[bookmarks]);
 useEffect(()=>saveStore('annur-tasbih',tasbih),[tasbih]);
 useEffect(()=>saveStore('annur-journal',journal),[journal]);
 useEffect(()=>saveStore('annur-khatam',khatam),[khatam]);
 useEffect(()=>saveStore('annur-location',location),[location]);
 useEffect(()=>{
   Promise.all([
    fetch(A+'hadith_fallback.json').then(r=>r.json()).catch(()=>[]),
    fetch(A+'hadith_sections_bn.json').then(r=>r.json()).catch(()=>({})),
    fetch(A+'sunnah.json').then(r=>r.json()).catch(()=>[]),
    fetch(A+'ruqyah_bn.json').then(r=>r.json()).catch(()=>({})),
    fetch(A+'muslim_names.json').then(r=>r.json()).catch(()=>[])
   ]).then(([h,hs,s,r,n])=>{setHadithData(h);setHadithSections(hs);setSunnahData(s);setRuqyahData(r);setNamesData(n);setLoadingData(false)});
 },[]);
 useEffect(()=>{if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{})},[]);
 const isBn=lang==='bn';
 const go=(p)=>{setPage(p);setMobileMenu(false);setSearch('');window.scrollTo({top:0,behavior:'smooth'})};
 const notify=(m)=>{setToast(m);setTimeout(()=>setToast(''),2200)};
 const addBookmark=(p)=>{setBookmarks(v=>v.includes(p)?v.filter(x=>x!==p):[...v,p]);notify(bookmarks.includes(p)?'বুকমার্ক সরানো হয়েছে':'বুকমার্ক সংরক্ষিত')};
 const activeTitle=navItems.find(x=>x[0]===page)?.[isBn?1:2]||'AnNur';
 const currentSurah=surahs.find(s=>s.id===selectedSurah)||surahs[0];
 const openReader=(p,sid=null)=>{setReaderPage(p);setLastPage(p);setSelectedSurah(sid);go('reader')};
 const getPrayer=async(lat,lon)=>{
   try{const res=await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=1`);const j=await res.json();if(j.code===200)setPrayer(j.data)}
   catch{notify('নামাজের সময় আনতে ইন্টারনেট প্রয়োজন')}
 };
 const locate=()=>{if(!navigator.geolocation){notify('এই ব্রাউজারে Location সমর্থিত নয়');return}
   navigator.geolocation.getCurrentPosition(pos=>{const l={lat:pos.coords.latitude,lon:pos.coords.longitude};setLocation(l);getPrayer(l.lat,l.lon);setQibla(bearingToKaaba(l.lat,l.lon));notify('অবস্থান পাওয়া গেছে')},()=>notify('Location permission দিন'))};
 const bearingToKaaba=(lat,lon)=>{const p1=lat*Math.PI/180,p2=21.4225*Math.PI/180,dl=(39.8262-lon)*Math.PI/180;const y=Math.sin(dl),x=Math.cos(p1)*Math.tan(p2)-Math.sin(p1)*Math.cos(dl);return (Math.atan2(y,x)*180/Math.PI+360)%360};
 useEffect(()=>{if(location&&!prayer)getPrayer(location.lat,location.lon)},[]);
 useEffect(()=>{const fn=e=>{if(typeof e.alpha==='number')setOrientation(e.alpha)};window.addEventListener('deviceorientationabsolute',fn,true);window.addEventListener('deviceorientation',fn,true);return()=>{window.removeEventListener('deviceorientationabsolute',fn,true);window.removeEventListener('deviceorientation',fn,true)}},[]);
 const addJournal=()=>{if(!journalDraft.trim())return;setJournal(v=>[{id:Date.now(),title:journalTitle||'আমার নোট',body:journalDraft,date:new Date().toISOString()},...v]);setJournalDraft('');setJournalTitle('');setShowNewJournal(false);notify('জার্নাল সংরক্ষিত')};
 const renderPage=()=>{
 switch(page){
 case 'home':return <HomePage isBn={isBn} go={go} openReader={openReader} lastPage={lastPage} prayer={prayer} location={location} locate={locate} tasbih={tasbih} khatam={khatam}/>;
 case 'quran':return <QuranPage isBn={isBn} search={search} setSearch={setSearch} bookmarks={bookmarks} addBookmark={addBookmark} openReader={openReader} />;
 case 'reader':return <ReaderPage page={readerPage} setPage={p=>{setReaderPage(p);setLastPage(p)}} surah={currentSurah} selectedSurah={selectedSurah} bookmarks={bookmarks} addBookmark={addBookmark} goBack={()=>go(selectedSurah?'quran':'home')}/>;
 case 'prayer':return <PrayerPage prayer={prayer} location={location} locate={locate}/>;
 case 'qibla':return <QiblaPage location={location} locate={locate} qibla={qibla??(location?bearingToKaaba(location.lat,location.lon):null)} orientation={orientation}/>;
 case 'tasbih':return <TasbihPage count={tasbih} setCount={setTasbih} goal={goal} setGoal={setGoal}/>;
 case 'duas':return <DuasPage data={ruqyahData} active={activeDua} setActive={setActiveDua}/>;
 case 'hadith':return <HadithPage data={hadithData} sections={hadithSections} book={hadithBook} setBook={setHadithBook} search={search} setSearch={setSearch}/>;
 case 'sunnah':return <SunnahPage data={sunnahData}/>;
 case 'ruqyah':return <RuqyahPage data={ruqyahData}/>;
 case 'names':return <NamesPage data={namesData} search={search} setSearch={setSearch}/>;
 case 'journal':return <JournalPage entries={journal} draft={journalDraft} setDraft={setJournalDraft} title={journalTitle} setTitle={setJournalTitle} show={showNewJournal} setShow={setShowNewJournal} add={addJournal}/>;
 case 'khatam':return <KhatamPage value={khatam} setValue={setKhatam}/>;
 case 'listen':return <ListenPage playing={audioPlaying} setPlaying={setAudioPlaying} surah={audioSurah} setSurah={setAudioSurah}/>;
 case 'settings':return <SettingsPage dark={dark} setDark={setDark} lang={lang} setLang={setLang}/>;
 default:return <HomePage isBn={isBn} go={go} openReader={openReader} lastPage={lastPage} prayer={prayer} location={location} locate={locate} tasbih={tasbih} khatam={khatam}/>;
 }};
 return <div className="app-shell">
  <aside className={`sidebar ${mobileMenu?'open':''}`}>
   <div className="brand"><img src={A+'an-nur-logo.png'} alt="AnNur logo"/><div><b>AnNur</b><small>نور · Islamic Companion</small></div><button className="mobile-close" onClick={()=>setMobileMenu(false)}><X/></button></div>
   <div className="nav-label">{isBn?'মূল মেনু':'MENU'}</div>
   <nav>{navItems.map(([id,bn,en,Icon])=><button key={id} className={`nav-item ${page===id?'active':''}`} onClick={()=>go(id)}><Icon size={18}/><span>{isBn?bn:en}</span>{id==='quran'&&<small>614</small>}</button>)}</nav>
   <div className="sidebar-bottom"><div className="offline-pill"><span className="pulse"></span>{isBn?'অফলাইন কনটেন্ট অন্তর্ভুক্ত':'Bundled content included'}</div><small>AN NUR · WEB EDITION 1.0</small></div>
  </aside>
  {mobileMenu&&<div className="scrim" onClick={()=>setMobileMenu(false)}></div>}
  <main className="main">
   <header className="topbar"><button className="icon-btn menu-btn" onClick={()=>setMobileMenu(true)}><Menu/></button><div className="crumb"><span>AnNur</span><ChevronRight size={14}/><b>{activeTitle}</b></div><div className="top-actions"><button className="icon-btn" title="Language" onClick={()=>setLang(isBn?'en':'bn')}><Languages size={18}/><small>{isBn?'বাং':'EN'}</small></button><button className="icon-btn" onClick={()=>setDark(v=>!v)} title="Theme">{dark?<Sun size={18}/>:<Moon size={18}/>}</button></div></header>
   <div className="content">{renderPage()}</div>
   <footer>© AnNur · Web Edition <span>Quran • Prayer • Dhikr</span></footer>
  </main>
  {toast&&<div className="toast"><Check size={16}/>{toast}</div>}
 </div>
}
function PageHead({eyebrow,title,desc,action}){return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{desc&&<p>{desc}</p>}</div>{action}</div>}
function HomePage({isBn,go,openReader,lastPage,prayer,location,locate,tasbih,khatam}){
 const tiles=[['quran','আল-কুরআন','পড়ুন ও অনুসরণ করুন',BookOpen],['prayer','নামাজের সময়','আজকের পাঁচ ওয়াক্ত',Clock3],['qibla','কিবলা','কিবলার দিক নির্ণয়',Compass],['tasbih','তাসবিহ','যিকির গণনা',CircleHelp],['duas','দোয়া ও যিকির','প্রয়োজনীয় দোয়া',HandHeart],['hadith','হাদিস','নির্বাচিত হাদিস',ScrollText],['sunnah','সুন্নাহ','দৈনন্দিন আমল',Sparkles],['journal','জার্নাল','নিজের নোট',NotebookPen]];
 return <><section className="hero"><div className="hero-copy"><div className="eyebrow light">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div><h1>আসসালামু আলাইকুম</h1><p>আপনার প্রতিদিনের ইবাদত, কুরআন তিলাওয়াত ও আত্মশুদ্ধির সঙ্গী।</p><div className="hero-actions"><button className="btn primary" onClick={()=>openReader(lastPage)}><BookOpen size={17}/> পড়া চালিয়ে যান</button><button className="btn ghost-light" onClick={()=>go('quran')}>কুরআন খুলুন <ChevronRight size={16}/></button></div></div><div className="hero-art"><img className="hero-logo" src={A+'an-nur-logo.png'} alt="AnNur logo"/></div><div className="hero-glow"></div></section>
 <div className="stats-grid"><div className="stat-card"><span>শেষ পড়া পৃষ্ঠা</span><b>{lastPage}</b><small>৬১৪ পৃষ্ঠার হাফেজি মুশাফ</small></div><div className="stat-card"><span>আজকের তাসবিহ</span><b>{tasbih}</b><small>আপনার যিকির কাউন্টার</small></div><div className="stat-card"><span>খতম অগ্রগতি</span><b>{Math.round(khatam/30*100)}%</b><small>{khatam} / ৩০ পারা</small></div><div className="stat-card"><span>নামাজের সময়</span><b>{prayer?.timings?.Fajr||'--:--'}</b><small>{location?'অবস্থান আপডেট':'অবস্থান দিন'}</small></div></div>
 <div className="section-row"><div><div className="eyebrow">EXPLORE</div><h2>আপনার প্রয়োজনীয় বিষয়</h2></div><button className="text-btn" onClick={()=>go('settings')}>সেটিংস <ChevronRight size={15}/></button></div>
 <div className="quick-grid">{tiles.map(([id,t,d,I])=><button className="quick-card" key={id} onClick={()=>go(id)}><span className="quick-icon"><I size={20}/></span><b>{t}</b><small>{d}</small><ChevronRight className="quick-arrow" size={16}/></button>)}</div>
 <div className="section-row"><div><div className="eyebrow">DAILY</div><h2>আজকের আমল</h2></div></div><div className="daily-card"><div className="daily-mark">ذِكْر</div><div><b>سُبْحَانَ اللَّهِ وَبِحَمْدِهِ</b><p>সুবহানাল্লাহি ওয়া বিহামদিহি</p><small>আল্লাহর প্রশংসাসহ পবিত্রতা ঘোষণা করছি।</small></div><button className="btn subtle" onClick={()=>go('tasbih')}>তাসবিহ করুন</button></div>
 </>;
}
function QuranPage({isBn,search,setSearch,bookmarks,addBookmark,openReader}){
 const [tab,setTab]=useState('surah');
 const filtered=surahs.filter(s=>`${s.id} ${s.bn} ${s.en} ${s.ar}`.toLowerCase().includes(search.toLowerCase()));
 return <><PageHead eyebrow="AL-QURAN · 114 SURAHS" title="আল-কুরআন" desc="হাফেজি মুশাফ, সূরা তালিকা এবং সংরক্ষিত পৃষ্ঠা।" action={<button className="btn primary" onClick={()=>openReader(2)}><BookOpen size={16}/> মুশাফ খুলুন</button>}/>
 <div className="reader-banner"><div><span>مُصْحَفُ الْحِفْظِ</span><h2>ইমদাদিয়া হাফেজি কুরআন</h2><p>৬১৪ পৃষ্ঠা · অফলাইন PDF</p></div><div className="banner-page">614<small>PAGES</small></div></div>
 <div className="tabs"><button className={tab==='surah'?'selected':''} onClick={()=>setTab('surah')}>সূরা তালিকা</button><button className={tab==='bookmarks'?'selected':''} onClick={()=>setTab('bookmarks')}>বুকমার্ক ({bookmarks.length})</button></div>
 <div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="সূরার নাম বা নম্বর লিখুন..."/></div>
 {tab==='surah'?<div className="surah-list">{filtered.map(s=><div className="surah-row" key={s.id}><button className="surah-main" onClick={()=>openReader(s.page,s.id)}><span className="surah-num">{String(s.id).padStart(3,'0')}</span><span className="surah-titles"><b>{s.bn}</b><small>{s.en} · {s.verses} আয়াত · {s.revelation==='Makki'?'মাক্কী':'মাদানী'}</small></span><span className="surah-ar">{s.ar}</span></button><button className={`mini-bookmark ${bookmarks.includes(s.page)?'saved':''}`} onClick={()=>addBookmark(s.page)}><Bookmark size={16}/></button></div>)}</div>:<div className="surah-list">{bookmarks.map(p=><button className="surah-row saved-row" key={p} onClick={()=>openReader(p)}><span className="surah-num">{p}</span><b>পৃষ্ঠা {p}</b><ChevronRight size={17}/></button>)}{!bookmarks.length&&<div className="empty">এখনো কোনো বুকমার্ক নেই।</div>}</div>}
 </>;
}
function ReaderPage({page,setPage,surah,selectedSurah,bookmarks,addBookmark,goBack}){
 return <><div className="reader-toolbar"><button className="btn subtle" onClick={goBack}><ArrowLeft size={16}/> ফিরে যান</button><div className="reader-meta"><b>{selectedSurah?surah.bn+' · '+surah.ar:'ইমদাদিয়া হাফেজি কুরআন'}</b><small>পৃষ্ঠা {page} / ৬১৪</small></div><button className={`icon-btn ${bookmarks.includes(page)?'is-saved':''}`} onClick={()=>addBookmark(page)}><Bookmark size={18}/></button></div><div className="pdf-frame"><iframe title="Imdadia Hafezi Quran PDF" src={`${A}Imdadia-Hafezi-Quran.pdf#page=${page}&toolbar=0&navpanes=0`} /></div><div className="reader-controls"><button className="btn subtle" disabled={page<=1} onClick={()=>setPage(page-1)}><ChevronLeft/> আগের পৃষ্ঠা</button><label>পৃষ্ঠা <input type="number" min="1" max="614" value={page} onChange={e=>setPage(Math.max(1,Math.min(614,Number(e.target.value)||1)))}/></label><button className="btn subtle" disabled={page>=614} onClick={()=>setPage(page+1)}>পরের পৃষ্ঠা <ChevronRight/></button></div><p className="hint">PDF ভিউয়ারে পৃষ্ঠা নেভিগেশন আপনার ব্রাউজার অনুযায়ী ভিন্ন হতে পারে।</p></>;
}
function PrayerPage({prayer,location,locate}){
 const times=['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];const labels=['ফজর','সূর্যোদয়','যোহর','আসর','মাগরিব','ইশা'];
 return <><PageHead eyebrow="SALAH · DAILY" title="নামাজের সময়" desc="আপনার অবস্থান অনুযায়ী আজকের নামাজের সময়।" action={<button className="btn primary" onClick={locate}><MapPin size={16}/> অবস্থান নিন</button>}/>{!location&&<div className="notice">নামাজের সময় দেখাতে আপনার অবস্থানের অনুমতি দিন।</div>}<div className="prayer-date"><CalendarDays size={18}/><div><b>{prayer?.date?.readable||new Date().toLocaleDateString('bn-BD',{dateStyle:'full'})}</b><small>{prayer?.date?.hijri?.date||'হিজরি তারিখ লোড হচ্ছে'}</small></div></div><div className="prayer-grid">{times.map((t,i)=><div className={`prayer-card ${t==='Fajr'?'highlight':''}`} key={t}><span>{labels[i]}</span><b>{prayer?.timings?.[t]?.split(' ')[0]||'--:--'}</b><small>{t}</small></div>)}</div><p className="hint">সময় AlAdhan API থেকে গণনা করে দেখানো হয়। স্থানীয় মসজিদের সময়ের সঙ্গে সামান্য পার্থক্য হতে পারে।</p></>;
}
function QiblaPage({location,locate,qibla,orientation}){
 return <><PageHead eyebrow="DIRECTION" title="কিবলা কম্পাস" desc="মক্কা শরীফের কাবার দিক নির্ণয় করুন।" action={<button className="btn primary" onClick={locate}><MapPin size={16}/> Location</button>}/><div className="compass-wrap"><div className="compass"><div className="compass-n">N</div><div className="compass-e">E</div><div className="compass-s">S</div><div className="compass-w">W</div><div className="compass-needle" style={{transform:`rotate(${qibla??0}deg)`}}><div className="needle-tip"></div><div className="needle-tail"></div></div><div className="compass-center">🕋</div></div><h2>{qibla===null?'অবস্থান প্রয়োজন':`${Math.round(qibla)}°`}</h2><p>{location?'আপনার অবস্থান থেকে কিবলার দিক':'কিবলা নির্ণয়ের জন্য Location অনুমতি দিন'}</p>{orientation!==null&&<small>Device heading: {Math.round(orientation)}° · কম্পাসের জন্য ফোন সমতল রাখুন</small>}</div><div className="notice">সঠিক দিক পেতে ফোনের কম্পাস ক্যালিব্রেট করুন। কিছু ব্রাউজার Device Orientation API সমর্থন নাও করতে পারে।</div></>;
}
function TasbihPage({count,setCount,goal,setGoal}){
 const pct=Math.min(100,count/goal*100);
 return <><PageHead eyebrow="DHIKR COUNTER" title="তাসবিহ" desc="মনোযোগের সঙ্গে যিকির করুন। কাউন্টারটি এই ব্রাউজারে সংরক্ষিত থাকবে।"/><div className="tasbih-card"><div className="counter-ring" style={{'--progress':`${pct}%`}}><div><strong>{count}</strong><small>COUNT</small></div></div><div className="tasbih-dhikr" dir="rtl">سُبْحَانَ اللَّهِ</div><p>সুবহানাল্লাহ</p><button className="tasbih-tap" onClick={()=>setCount(c=>c+1)} aria-label="Count tasbih"><Plus size={28}/></button><div className="counter-actions"><button className="btn subtle" onClick={()=>setCount(0)}><RotateCcw size={16}/> রিসেট</button><label>লক্ষ্য <input type="number" min="1" max="10000" value={goal} onChange={e=>setGoal(Math.max(1,Number(e.target.value)||1))}/></label></div><div className="progress"><span style={{width:`${pct}%`}}/></div><small>{count} / {goal} · {Math.max(0,goal-count)} বাকি</small></div></>;
}
function DuasPage({data,active,setActive}){
 const groups=Object.entries(data||{});
 return <><PageHead eyebrow="SUPPLICATIONS" title="দোয়া ও যিকির" desc="Bundled ruqyah and Quranic supplications."/><div className="data-list">{groups.map(([key,val])=><button className="data-card" key={key} onClick={()=>setActive(active===key?null:key)}><div><b>{key.replaceAll('-',' ')}</b><small>{Object.values(val||{}).flat().length}টি বিষয়</small></div><ChevronRight/></button>)}{active&&groups.filter(([k])=>k===active).map(([k,v])=><div className="content-panel" key={k}>{Object.entries(v||{}).map(([type,items])=><div key={type}><h3>{type.replaceAll('-',' ')}</h3>{(items||[]).map((item,i)=><article className="verse-card" key={i}><b>{item.title||`দোয়া ${i+1}`}</b><p className="arabic-text" dir="rtl">{item.arabic}</p>{item.transliteration&&<p>{item.transliteration}</p>}<p>{item.translation||item.bengali||''}</p></article>)}</div>)}</div>)}</div></>;
}
function HadithPage({data,sections,book,setBook,search,setSearch}){
 const books=[['all','সব'],['bukhari','বুখারী'],['muslim','মুসলিম'],['abudawud','আবু দাউদ'],['tirmidhi','তিরমিযী'],['nasai','নাসায়ী'],['ibnmajah','ইবনে মাজাহ']];
 const filtered=(data||[]).filter(h=>(book==='all'||h.book===book)&&`${h.ben||''} ${h.eng||''} ${h.n||''}`.toLowerCase().includes(search.toLowerCase()));
 return <><PageHead eyebrow="HADITH COLLECTION" title="হাদিস" desc="এই ZIP-এ থাকা নির্বাচিত offline hadith entries."/><div className="chips">{books.map(([v,l])=><button className={book===v?'chip active':'chip'} onClick={()=>setBook(v)} key={v}>{l}</button>)}</div><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="হাদিস খুঁজুন..."/></div><div className="data-list">{filtered.map((h,i)=><article className="verse-card" key={i}><div className="card-topline"><b>{h.book?.toUpperCase()} · #{h.n}</b><span>হাদিস</span></div><p>{h.ben||h.eng}</p>{h.eng&&<small>{h.eng}</small>}</article>)}{!filtered.length&&<div className="empty">এই bundled sample-এ মিল পাওয়া যায়নি।</div>}</div><p className="hint">নোট: এখানে bundled fallback entries দেখানো হচ্ছে; Android app-এর পূর্ণ Hadith browsing ও remote repository logic এখনও port করা হয়নি।</p></>;
}
function SunnahPage({data}){return <><PageHead eyebrow="DAILY PRACTICE" title="দৈনন্দিন সুন্নাহ" desc="অ্যাপের bundled Sunnah collection থেকে।"/><div className="data-list">{(data||[]).map((g,i)=><details className="details-card" key={i}><summary><b>{g.title_bn||g.title_en}</b><ChevronRight size={17}/></summary>{(g.items||[]).map((it,j)=><article className="verse-card" key={j}><b>{it.title_bn||it.title_en}</b><p className="arabic-text" dir="rtl">{it.arabic}</p><p>{it.description_bn||it.description_en||it.title_bn}</p></article>)}</details>)}</div></>}
function RuqyahPage({data}){const entries=Object.entries(data||{});return <><PageHead eyebrow="RUQYAH" title="রুকইয়াহ শারইয়্যাহ" desc="Bundled Quranic ruqyah material."/><div className="data-list">{entries.map(([key,groups])=><details className="details-card" key={key}><summary><b>{key.replaceAll('-',' ')}</b><ChevronRight size={17}/></summary>{Object.entries(groups||{}).map(([group,items])=><div key={group}><h3>{group.replaceAll('-',' ')}</h3>{(items||[]).map((it,i)=><article className="verse-card" key={i}><b>{it.title}</b><p className="arabic-text" dir="rtl">{it.arabic}</p><p>{it.translation}</p></article>)}</div>)}</details>)}</div></>}
function NamesPage({data,search,setSearch}){const f=(data||[]).filter(n=>`${n.ar} ${n.bn} ${n.en} ${n.mbn}`.toLowerCase().includes(search.toLowerCase()));return <><PageHead eyebrow="MUSLIM NAMES" title="মুসলিম নাম" desc="Bundled names collection."/><div className="searchbox"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="নাম খুঁজুন..."/></div><div className="name-grid">{f.slice(0,180).map((n,i)=><div className="name-card" key={i}><b className="arabic-text">{n.ar}</b><strong>{n.bn}</strong><small>{n.mbn||n.en}</small></div>)}</div><p className="hint">{f.length}টি নাম পাওয়া গেছে। প্রথম ১৮০টি একসঙ্গে দেখানো হচ্ছে।</p></>}
function JournalPage({entries,draft,setDraft,title,setTitle,show,setShow,add}){return <><PageHead eyebrow="PRIVATE NOTES" title="আমার জার্নাল" desc="এই ডিভাইসের browser storage-এ নোট রাখা হয়।" action={<button className="btn primary" onClick={()=>setShow(v=>!v)}><Plus size={16}/> নতুন নোট</button>}/>{show&&<div className="form-card"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="নোটের শিরোনাম"/><textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="আপনার নোট লিখুন..." rows="5"/><button className="btn primary" onClick={add}>সংরক্ষণ করুন</button></div>}<div className="data-list">{entries.map(e=><article className="journal-entry" key={e.id}><div className="card-topline"><b>{e.title}</b><small>{new Date(e.date).toLocaleDateString('bn-BD')}</small></div><p>{e.body}</p></article>)}{!entries.length&&<div className="empty">এখনো কোনো নোট নেই।</div>}</div><p className="hint">Privacy: নোট শুধু এই browser profile-এর localStorage-এ থাকে। Cloud sync বা biometric lock এই Web Edition-এ নেই।</p></>}
function KhatamPage({value,setValue}){return <><PageHead eyebrow="QURAN GOAL" title="খতম ট্র্যাকার" desc="৩০ পারার মধ্যে আপনার পড়ার অগ্রগতি সংরক্ষণ করুন।"/><div className="khatam-card"><div className="khatam-count"><strong>{value}</strong><span>/ ৩০ পারা</span></div><div className="progress"><span style={{width:`${Math.min(100,value/30*100)}%`}}/></div><div className="para-grid">{Array.from({length:30},(_,i)=><button key={i} className={i<value?'para done':'para'} onClick={()=>setValue(i+1)}><span>{String(i+1).padStart(2,'0')}</span>{i<value?<Check size={16}/>:<span>পারা</span>}</button>)}</div><button className="btn subtle" onClick={()=>setValue(0)}><RotateCcw size={16}/> রিসেট</button></div></>}
function ListenPage({playing,setPlaying,surah,setSurah}){const s=surahs.find(x=>x.id===surah)||surahs[0];const [audio,setAudio]=useState(null);useEffect(()=>{const a=new Audio(`https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${surah}.mp3`);a.onended=()=>setPlaying(false);setAudio(a);return()=>{a.pause()}},[surah]);useEffect(()=>{if(!audio)return;playing?audio.play().catch(()=>setPlaying(false)):audio.pause()},[playing,audio]);return <><PageHead eyebrow="QURAN RECITATION" title="তিলাওয়াত শুনুন" desc="Internet connection required for streaming audio."/><div className="listen-card"><div className="album-art"><img src={A+'an-nur-logo.png'}/></div><small>MISHARY RASHID ALAFASY</small><h2>{s.bn}</h2><p>{s.en} · سورة {s.ar}</p><select value={surah} onChange={e=>setSurah(Number(e.target.value))}>{surahs.map(x=><option value={x.id} key={x.id}>{x.id}. {x.bn} — {x.en}</option>)}</select><button className="play-button" onClick={()=>setPlaying(v=>!v)}>{playing?<Pause fill="currentColor"/>:<Play fill="currentColor"/>}</button><small>Streaming source: Islamic Network CDN · Alafasy</small></div></>}
function SettingsPage({dark,setDark,lang,setLang}){return <><PageHead eyebrow="PREFERENCES" title="সেটিংস" desc="Web Edition preferences."/><div className="settings-list"><div className="setting-row"><div><b>Appearance</b><small>Dark / Light theme</small></div><button className="toggle" onClick={()=>setDark(v=>!v)}>{dark?'Dark':'Light'}</button></div><div className="setting-row"><div><b>Language</b><small>বাংলা / English</small></div><button className="toggle" onClick={()=>setLang(v=>v==='bn'?'en':'bn')}>{lang==='bn'?'বাংলা':'English'}</button></div><div className="setting-row"><div><b>Install Web App</b><small>Browser menu → Install app / Add to Home Screen</small></div><Smartphone/></div><div className="setting-row"><div><b>Storage</b><small>Bookmarks, tasbih, journal and progress are local to this browser.</small></div><Download/></div></div><div className="notice">এই Web Edition মূল Android app-এর বিকল্প build। Google sign-in / Firestore sync, reminders, widgets, background playback এবং কিছু Android-only সুবিধা এখানে এখনও নেই।</div></>}
function AppRoot(){return <App/>}
createRoot(document.getElementById('root')).render(<AppRoot/>);
