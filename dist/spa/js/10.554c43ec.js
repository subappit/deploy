(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{e7cb:function(e,o,d){"use strict";d.r(o);var a=function(){var e=this,o=e.$createElement,d=e._self._c||o;return e.userLogged?d("q-page",[d("h5",{staticClass:"text-center no-margin q-py-lg"},[e._v("Lista RDO caricate")]),d("div",{staticClass:"q-px-lg"},[d("table-rdo",{on:{openSelectedRdo:e.openSelectedRdo,resetSelectedRdo:function(o){e.selectedRdo=null},openModal:function(o){return e.openModal("load-rdo","Carica RDO",!0,e.loadRdoClassObj,!1)}}})],1),d("modal",{attrs:{"selected-rdo":e.selectedRdo,"class-obj":e.classObj,modal:e.modal,"is-maximized":e.isMaximized,component:e.modalComponent,title:e.modalTitle},on:{"update:modal":function(o){e.modal=o}}})],1):e._e()},t=[],l=d("ded3"),s=d.n(l),n=d("29ef"),i=d("2f62"),c=d("714b"),m={name:"UserRdos",components:{Modal:c["a"],TableRdo:n["a"]},data(){return{loadRdoClassObj:{"q-pa-none":!0},modalComponent:void 0,modalTitle:void 0,isMaximized:!1,modal:!1,selectedRdo:null,classObj:{}}},computed:s()({},Object(i["c"])({userLogged:"user"})),methods:{openModal(e,o,d,a){this.modalComponent=e,this.modalTitle=o,this.isMaximized=d,this.modal=!0,this.classObj=a},openSelectedRdo(e){this.selectedRdo=e,this.openModal("load-rdo","RDO di "+e.contractor,!0,this.loadRdoClassObj,!1)}}},r=m,p=d("2877"),u=d("9989"),b=d("eebe"),R=d.n(b),h=Object(p["a"])(r,a,t,!1,null,"3111f6ef",null);o["default"]=h.exports;R()(h,"components",{QPage:u["a"]})}}]);