(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[9],{1613:function(s,t,a){"use strict";a.r(t);var e=function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("q-form",{on:{submit:function(t){return t.preventDefault(),t.stopPropagation(),s.onSubmit(t)}}},[a("div",{staticClass:"row justify-center content-center no-padding no-margin q-gutter-x-md q-gutter-y-lg"},[a("h5",{staticClass:"text-center col-12 no-margin q-pt-lg"},[s._v("Reimposta password")]),a("q-input",{staticClass:"col-12 col-md-6",attrs:{type:s.isPwd?"password":"text",name:"password",label:"Nuova password",outlined:"","reactive-rules":"",rules:[function(t){return s.isValid("password",t,s.$v)}]},scopedSlots:s._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:s.isPwd?"visibility_off":"visibility"},on:{click:function(t){s.isPwd=!s.isPwd}}})]},proxy:!0}]),model:{value:s.password,callback:function(t){s.password=t},expression:"password"}}),a("div",{staticClass:"col-12 col-md-6 text-center"},[a("q-btn",{attrs:{push:"",ripple:!1,label:"Reimposta password",color:"secondary",type:"submit"}})],1)],1)])},i=[],o=(a("e6cf"),a("ded3")),r=a.n(o),n=a("8f04"),d=a("b5ae"),c=a("2f62"),u={name:"ForgotPassword",data(){return{userId:void 0,password:void 0,isValid:n["a"].isValid,isPassword:n["a"].isPassword,isPwd:!0}},methods:r()(r()({},Object(c["b"])(["resetPassword"])),{},{async onSubmit(){if(this.$v.$touch(),this.$forceUpdate(),!this.$v.$invalid){this.$q.loading.show();const s={body:{id:this.userId,password:this.password}};await this.resetPassword(s),await this.$router.push("/"),this.$q.loading.hide()}}}),mounted(){this.userId=this.$route.params.userId},validations(){return{password:{required:d["required"],isPassword:n["a"].isPassword}}}},l=u,p=a("2877"),w=a("0378"),m=a("27f9"),f=a("0016"),h=a("9c40"),b=a("eebe"),v=a.n(b),P=Object(p["a"])(l,e,i,!1,null,"165210ea",null);t["default"]=P.exports;v()(P,"components",{QForm:w["a"],QInput:m["a"],QIcon:f["a"],QBtn:h["a"]})}}]);