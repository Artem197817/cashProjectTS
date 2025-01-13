/*! name: vanilla-calendar-pro v3.0.1 | url: https://github.com/uvarov-frontend/vanilla-calendar-pro */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).VanillaCalendarProUtils={})}(this,(function(e){"use strict";const t=e=>new Date(`${e}T00:00:00`),n=e=>`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`;e.getDate=e=>t(e),e.getDateString=e=>n(e),e.getWeekNumber=(e,n)=>((e,n)=>{const a=t(e),r=(a.getDay()-n+7)%7;a.setDate(a.getDate()+4-r);const o=new Date(a.getFullYear(),0,1),s=Math.ceil(((+a-+o)/864e5+1)/7);return{year:a.getFullYear(),week:s}})(e,n),e.parseDates=e=>(e=>e.reduce(((e,a)=>{if(a instanceof Date||"number"==typeof a){const t=a instanceof Date?a:new Date(a);e.push(t.toISOString().substring(0,10))}else a.match(/^(\d{4}-\d{2}-\d{2})$/g)?e.push(a):a.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/g,((a,r,o)=>{const s=t(r),i=t(o),d=new Date(s.getTime());for(;d<=i;d.setDate(d.getDate()+1))e.push(n(d));return a}));return e}),[]))(e),Object.defineProperty(e,Symbol.toStringTag,{value:"Module"})}));